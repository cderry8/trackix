import { Router } from 'express';
import * as ctrl from '../controllers/goalController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

r.get('/', requireAuth, asyncHandler(ctrl.list));
r.post('/', requireAuth, asyncHandler(ctrl.create));
r.patch('/:id', requireAuth, asyncHandler(ctrl.update));
r.delete('/:id', requireAuth, asyncHandler(ctrl.remove));
r.get('/:id/savings-plan', requireAuth, asyncHandler(ctrl.savingsPlan));

export default r;
