import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api, getErrorMessage } from '../../lib/api';
import { useAuthStore, User } from '../../store/authStore';

interface AuthResponse {
  user: User;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput extends LoginInput {
  displayName: string;
}

export function useMeQuery(enabled: boolean = true) {
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);

  const query = useQuery<AuthResponse>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get<AuthResponse>("/auth/me");
      return res.data;
    },
    enabled,
    retry: false,
  });

  useEffect(() => {
    if (!enabled) return;

    if (query.isSuccess) {
      setUser(query.data.user);
      setStatus("authenticated");
    }

    if (query.isError) {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [enabled, query.isSuccess, query.isError, query.data, setUser, setStatus]);

  return query;
}


export function useLoginMutation() {
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, LoginInput>({
    mutationFn: async (input) => {
      const res = await api.post<AuthResponse>('/auth/login', input);
      return res.data;
    },
    onMutate: () => {
      setStatus('loading');
    },
    onSuccess: (data) => {
      setUser(data.user);
      setStatus('authenticated');
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: () => {
      setStatus('unauthenticated');
    },
  });
}

export function useRegisterMutation() {
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, RegisterInput>({
    mutationFn: async (input) => {
      const res = await api.post<AuthResponse>('/auth/register', input);
      return res.data;
    },
    onMutate: () => {
      setStatus('loading');
    },
    onSuccess: (data) => {
      setUser(data.user);
      setStatus('authenticated');
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: () => {
      setStatus('unauthenticated');
    },
  });
}

export function useLogoutMutation() {
  const logoutLocal = useAuthStore((s) => s.logoutLocal);
  const queryClient = useQueryClient();

  return useMutation<void, unknown, void>({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      logoutLocal();
      queryClient.clear();
    },
  });
}

export { getErrorMessage };

