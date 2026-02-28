import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { UploadResponse } from '../types/index';

export async function cleanCSV(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
                error: 'File is required'
            });
        }

        const inputFilePath = req.file.path;
        const outputFileName = `cleaned_${req.file.originalname}`;
        const outputFilePath = path.join('uploads', outputFileName);

        const rows: any[] = [];
        const uniqueRows = new Set();
        let headers: string[] = [];

        // 1. Read and clean data
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(inputFilePath)
                .pipe(csvParser())
                .on('headers', (h) => {
                    headers = h;
                })
                .on('data', (row) => {
                    // Check for complete emptiness
                    const values = Object.values(row);
                    const isCompletelyEmpty = values.every(val => val === '' || val === null || val === undefined);

                    if (isCompletelyEmpty) return;

                    // Deduplication
                    const rowString = JSON.stringify(row);
                    if (uniqueRows.has(rowString)) return;

                    uniqueRows.add(rowString);
                    rows.push(row);
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (err) => {
                    reject(err);
                });
        });

        if (rows.length === 0) {
            throw new Error('Dataset is completely empty after cleaning.');
        }

        // 2. Write to new CSV file
        const csvWriter = createObjectCsvWriter({
            path: outputFilePath,
            header: headers.map(header => ({ id: header, title: header })),
        });

        await csvWriter.writeRecords(rows);

        // 3. Delete Original File
        fs.unlink(inputFilePath, (err) => {
            if (err) console.error('Error deleting original file:', err);
        });

        // 4. Send Cleaned File to user
        res.download(outputFilePath, outputFileName, (err) => {
            if (err) console.error('Error sending file download:', err);

            // Clean up the output file after sending it
            fs.unlink(outputFilePath, (err2) => {
                if (err2) console.error('Error deleting cleaned file:', err2);
            });
        });

    } catch (error: any) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error cleaning CSV',
            error: error.message
        });
    }
}
