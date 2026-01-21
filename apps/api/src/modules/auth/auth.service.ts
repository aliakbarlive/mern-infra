import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env, isProd } from '../../config/env.ts';
import { IUser, User } from '../users/user.model.ts';
import type { AuthPayload } from './auth.types.ts';

const ACCESS_TOKEN_EXPIRES_IN = '15m';

export async function registerUser(params: {
  email: string;
  password: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}): Promise<IUser> {
  const existing = await User.findOne({ email: params.email });
  if (existing) {
    const err: any = new Error('Email already in use');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(params.password, 10);

  const user = await User.create({
    email: params.email,
    passwordHash,
    displayName: params.displayName,
    bio: params.bio,
    avatarUrl: params.avatarUrl,
  });

  return user;
}

export async function authenticateUser(params: {
  email: string;
  password: string;
}): Promise<IUser> {
  const user = await User.findOne({ email: params.email });
  if (!user) {
    const err: any = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(params.password, user.passwordHash);
  if (!valid) {
    const err: any = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  return user;
}

export function signAccessToken(user: IUser): string {
  const payload: AuthPayload = {
    sub: user._id.toString(),
    role: user.role,
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function buildAuthCookie(token: string) {
  return {
    name: 'access_token',
    value: token,
    options: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: isProd,
      maxAge: 15 * 60 * 1000,
      path: '/',
    },
  };
}
