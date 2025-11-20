import { Router } from 'express';
import AnalysisHistory from '../models/AnalysisHistory';

const router = Router();

// Get all analysis history
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = parseInt(req.query.skip as string) || 0;

    const history = await AnalysisHistory.find()
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await AnalysisHistory.countDocuments();

    res.json({
      success: true,
      data: history,
      total,
      limit,
      skip
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single analysis by ID
router.get('/history/:id', async (req, res) => {
  try {
    const analysis = await AnalysisHistory.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete analysis by ID
router.delete('/history/:id', async (req, res) => {
  try {
    const analysis = await AnalysisHistory.findByIdAndDelete(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;