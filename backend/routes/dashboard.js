import { Router } from 'express';
import * as ctrl from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

r.get('/summary', requireAuth, asyncHandler(ctrl.summary));
r.get('/category-breakdown', requireAuth, asyncHandler(ctrl.categoryBreakdown));
r.get('/monthly-trend', requireAuth, asyncHandler(ctrl.monthlyTrend));
r.get('/income-vs-expense', requireAuth, asyncHandler(ctrl.incomeVsExpense));
r.get('/heatmap', requireAuth, asyncHandler(ctrl.heatmap));
r.get('/projection', requireAuth, asyncHandler(ctrl.projection));

export default r;
