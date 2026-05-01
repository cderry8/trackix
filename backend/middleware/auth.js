import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export function requireAuth(req, res, next) {
  (async () => {
    try {
      const header = req.headers.authorization;
      if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const token = header.slice(7);
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.sub).select('suspended');
      if (!user || user.suspended) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = { id: decoded.sub, role: decoded.role };
      next();
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  })().catch(next);
}
