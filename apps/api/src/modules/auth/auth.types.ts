export interface AuthPayload {
  sub: string;
  role: 'user' | 'admin' | 'moderator';
}

export interface AuthCookies {
  accessToken: string;
}
