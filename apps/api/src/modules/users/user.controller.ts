import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { User } from './user.model';

const updateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  bio: z.string().max(280).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function getMeHandler(req: Request, res: Response, next: NextFunction) {
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

export async function updateMeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: { message: 'Unauthorized' } });
    }

    const parsed = updateProfileSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: parsed },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ user: serializeUser(user) });
  } catch (err) {
    if ((err as any).name === 'ZodError') {
      (err as any).status = 400;
      (err as any).details = (err as any).errors;
    }
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
