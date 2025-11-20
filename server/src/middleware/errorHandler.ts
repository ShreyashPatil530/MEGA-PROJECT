import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File size too large',
      error: 'Maximum file size exceeded'
    });
  }

  if (err.message === 'Only CSV files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type',
      error: 'Only CSV files are allowed'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
}