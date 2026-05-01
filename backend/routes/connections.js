import { Router } from 'express';
import * as ctrl from '../controllers/connectionController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

r.get('/', requireAuth, asyncHandler(ctrl.list));
r.post('/connect', requireAuth, asyncHandler(ctrl.connect));
r.post('/:id/disconnect', requireAuth, asyncHandler(ctrl.disconnect));
r.post('/:id/sync', requireAuth, asyncHandler(ctrl.sync));

export default r;
