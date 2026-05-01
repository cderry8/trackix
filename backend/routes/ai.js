import { Router } from 'express';
import * as ctrl from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

r.post('/insights', requireAuth, asyncHandler(ctrl.insights));
r.get('/weekly', requireAuth, asyncHandler(ctrl.weeklyReport));

export default r;
