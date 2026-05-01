import { Router } from 'express';
import * as auth from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();

r.post('/register', asyncHandler(auth.register));
r.post('/login', asyncHandler(auth.login));
r.post('/refresh', asyncHandler(auth.refresh));
r.post('/logout', requireAuth, asyncHandler(auth.logout));
r.get('/me', requireAuth, asyncHandler(auth.me));

export default r;
