import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware';
import { getMeHandler, updateMeHandler } from './user.controller';

export const userRouter = Router();

userRouter.get('/me', requireAuth, getMeHandler);
userRouter.patch('/me', requireAuth, updateMeHandler);
