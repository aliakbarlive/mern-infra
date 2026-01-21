import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useLogoutMutation, useMeQuery } from '../features/auth/api';
import { useAuthStore } from '../store/authStore';

const AuthInitializer: React.FC = () => {
  const status = useAuthStore((s) => s.status);
  useMeQuery(status === 'idle');
  return null;
};

export const AppLayout: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { mutateAsync: logout, isPending } = useLogoutMutation();
  console.log('render AppLayout, user =', user);
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <AuthInitializer />
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">MERN Social</Link>
        <nav className="flex gap-3 text-sm items-center">
          <Link to="/" className="hover:underline">Feed</Link>
          {user && (
            <>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <Link to="/create" className="hover:underline">Create</Link>
              <Link to="/settings" className="hover:underline">Settings</Link>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
          {user && (
            <span className="text-xs text-slate-200 hidden sm:inline">{user.displayName}</span>
          )}
          {user && (
            <Button
              type="button"
              onClick={() => logout()}
              disabled={isPending}
              className="ml-2 px-3 py-1 text-xs"
            >
              Logout
            </Button>
          )}
        </nav>
      </header>
      <main className="flex-1 w-full max-w-3xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};
