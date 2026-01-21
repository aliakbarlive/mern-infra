import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../users/user.model.ts';
import { authenticateUser, buildAuthCookie, registerUser, signAccessToken } from './auth.service.ts';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2),
  bio: z.string().max(280).optional(),
  avatarUrl: z.string().url().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.parse(req.body);
    const user = await registerUser(parsed);
    const token = signAccessToken(user);
    const cookie = buildAuthCookie(token);

    res
      .cookie(cookie.name, cookie.value, cookie.options)
      .status(201)
      .json({ user: serializeUser(user) });
  } catch (err) {
    if ((err as any).name === 'ZodError') {
      (err as any).status = 400;
      (err as any).details = (err as any).errors;
    }
    next(err);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await authenticateUser(parsed);
    const token = signAccessToken(user);
    const cookie = buildAuthCookie(token);

    res
      .cookie(cookie.name, cookie.value, cookie.options)
      .json({ user: serializeUser(user) });
  } catch (err) {
    if ((err as any).name === 'ZodError') {
      (err as any).status = 400;
      (err as any).details = (err as any).errors;
    }
    next(err);
  }
}

export async function logoutHandler(_req: Request, res: Response) {
  res.clearCookie('access_token', { path: '/' }).status(204).send();
}

export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: { message: 'Unauthorized' } });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: { message: 'Unauthorized' } });
    }

    res.json({ user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

function serializeUser(user: any) {
  return {
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    bio: user.bio ?? '',
    avatarUrl: user.avatarUrl ?? '',
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
