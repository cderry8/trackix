import { Router } from 'express';
import * as ctrl from '../controllers/alertController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

r.get('/', requireAuth, asyncHandler(ctrl.list));
r.post('/:id/read', requireAuth, asyncHandler(ctrl.markRead));
r.post('/read-all', requireAuth, asyncHandler(ctrl.markAllRead));

export default r;
