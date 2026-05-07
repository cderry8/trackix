import { Router } from 'express';
import * as ctrl from '../controllers/reviewController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

// Public endpoint for landing page
r.get('/public', asyncHandler(ctrl.listApproved));

// User endpoints
r.get('/my', requireAuth, asyncHandler(ctrl.listMine));
r.post('/', requireAuth, asyncHandler(ctrl.create));
r.patch('/:id', requireAuth, asyncHandler(ctrl.update));
r.delete('/:id', requireAuth, asyncHandler(ctrl.remove));

// Admin endpoints
r.get('/admin/all', requireAuth, requireAdmin, asyncHandler(ctrl.listAll));
r.get('/admin/stats', requireAuth, requireAdmin, asyncHandler(ctrl.getStats));
r.post('/admin/:id/approve', requireAuth, requireAdmin, asyncHandler(ctrl.approve));
r.post('/admin/:id/reject', requireAuth, requireAdmin, asyncHandler(ctrl.reject));

export default r;
