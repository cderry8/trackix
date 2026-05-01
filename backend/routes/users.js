import { Router } from 'express';
import * as ctrl from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

r.patch('/me', requireAuth, asyncHandler(ctrl.updateProfile));
r.post('/me/password', requireAuth, asyncHandler(ctrl.changePassword));

export default r;
