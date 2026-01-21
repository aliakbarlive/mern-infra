import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { FormError } from '../components/ui/FormError';
import { Input } from '../components/ui/Input';
import { getErrorMessage, useLoginMutation } from '../features/auth/api';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { mutateAsync, isPending, error } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.log('render LoginPage');
    try {
      await mutateAsync(values);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (e) {
      console.error(e);
    }
  };
  const { watch } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  console.log("watch email =", watch("email"));
  console.log("watch password =", watch("password"));


  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-lg font-semibold">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <Input type="email" autoComplete="email" {...register('email')} />
            <FormError message={errors.email?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <Input type="password" autoComplete="current-password" {...register('password')} />
            <FormError message={errors.password?.message} />
          </div>
          <FormError message={error ? getErrorMessage(error) : undefined} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="text-xs text-slate-600">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-slate-900 font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};
