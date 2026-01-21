import { Router } from 'express';
import { loginHandler, logoutHandler, meHandler, registerHandler } from './auth.controller.ts';
import { requireAuth } from './auth.middleware.ts';

export const authRouter = Router();

authRouter.post('/register', registerHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/logout', requireAuth, logoutHandler);
authRouter.get('/me', requireAuth, meHandler);
