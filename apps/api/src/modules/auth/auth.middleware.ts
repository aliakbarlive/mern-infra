import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import type { AuthPayload } from './auth.types';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
    (req as any).user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }
}
