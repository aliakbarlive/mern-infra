import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  logoutLocal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
  logoutLocal: () => set({ user: null, status: 'unauthenticated' }),
}));
