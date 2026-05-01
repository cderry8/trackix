import { Router } from 'express';
import * as ctrl from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

r.use(requireAuth, requireAdmin);

r.get('/stats', asyncHandler(ctrl.stats));
r.get('/users', asyncHandler(ctrl.users));
r.post('/users/:id/suspend', asyncHandler(ctrl.suspendUser));
r.post('/users/:id/unsuspend', asyncHandler(ctrl.unsuspendUser));
r.delete('/users/:id', asyncHandler(ctrl.deleteUser));
r.get('/activity', asyncHandler(ctrl.activity));
r.get('/logs', asyncHandler(ctrl.logs));

export default r;
