import { Router } from 'express';
import * as ctrl from '../controllers/currencyController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

r.get('/rates', asyncHandler(ctrl.rates));
r.get('/convert', asyncHandler(ctrl.convert));
r.get('/preferred', requireAuth, asyncHandler(ctrl.preferred));

export default r;
