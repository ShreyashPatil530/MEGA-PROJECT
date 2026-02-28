import { Request, Response } from 'express';
import Groq from 'groq-sdk';

export async function generateReport(req: Request, res: Response) {
    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const { analysisData } = req.body;

        if (!analysisData) {
            return res.status(400).json({ success: false, message: 'Analysis data is required' });
        }

        const { fileName, totalRows, totalColumns, missingPercentage, duplicateRowsPercentage, completenessScore, numericColumns, categoricalColumns, outlierCount } = analysisData;

        // Create a summarized version of stats to avoid overwhelming the LLM
        const summarizedStats: any = {};
        if (analysisData.stats) {
            Object.keys(analysisData.stats).slice(0, 10).forEach(key => {
                summarizedStats[key] = analysisData.stats[key];
            });
        }

        const prompt = `
      You are an expert Data Analyst. I have analyzed a dataset named "${fileName}".
      Here are the key metrics:
      - Total Rows: ${totalRows}
      - Total Columns: ${totalColumns} (${numericColumns} numeric, ${categoricalColumns} categorical)
      - Missing Data: ${missingPercentage}%
      - Duplicate Rows: ${duplicateRowsPercentage}%
      - Completeness Score: ${completenessScore}/100
      - Total Outliers: ${outlierCount}
      
      Statistical Highlights (up to 10 columns):
      ${JSON.stringify(summarizedStats, null, 2)}
      
      Please write a comprehensive, easy-to-read analytical report (in Markdown format).
      Include:
      1. An Executive Summary.
      2. Data Health & Quality Assessment.
      3. Key Insights based on the provided statistics (focus on mean, outliers, min/max).
      4. Recommendations for Next Steps or Data Cleaning.
      Keep it professional and concise.
    `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a highly skilled Data Scientist providing actionable insights from dataset summaries.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1500,
        });

        const reportContent = chatCompletion.choices[0]?.message?.content || 'Failed to generate report.';

        return res.status(200).json({
            success: true,
            report: reportContent,
        });
    } catch (error: any) {
        console.error('Groq API Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate AI report', error: error.message });
    }
}
