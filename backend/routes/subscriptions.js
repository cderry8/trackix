import { Router } from 'express';
import * as ctrl from '../controllers/subscriptionController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

r.get('/', requireAuth, asyncHandler(ctrl.list));
r.post('/', requireAuth, asyncHandler(ctrl.create));
r.get('/summary', requireAuth, asyncHandler(ctrl.getSummary));
r.patch('/:id', requireAuth, asyncHandler(ctrl.update));
r.delete('/:id', requireAuth, asyncHandler(ctrl.remove));
r.post('/:id/cancel', requireAuth, asyncHandler(ctrl.cancel));

export default r;
