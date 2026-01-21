import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FormError } from '../components/ui/FormError';
import { useRegisterMutation, getErrorMessage } from '../features/auth/api';

const registerSchema = z.object({
  displayName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await mutateAsync(values);
      navigate('/', { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-lg font-semibold">Create account</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700">Display name</label>
            <Input {...register('displayName')} />
            <FormError message={errors.displayName?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <Input type="email" autoComplete="email" {...register('email')} />
            <FormError message={errors.email?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <Input type="password" autoComplete="new-password" {...register('password')} />
            <FormError message={errors.password?.message} />
          </div>
          <FormError message={error ? getErrorMessage(error) : undefined} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
      </div>
    </div>
  );
};
