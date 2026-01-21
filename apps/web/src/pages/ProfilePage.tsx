import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { FormError } from '../components/ui/FormError';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { api, getErrorMessage } from '../lib/api';
import { useAuthStore } from '../store/authStore';

const profileSchema = z.object({
  displayName: z.string().min(2),
  bio: z.string().max(280).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [apiError, setApiError] = React.useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName ?? '',
      bio: user?.bio ?? '',
      avatarUrl: user?.avatarUrl ?? '',
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setApiError(undefined);
    try {
      await api.patch('/users/me', values);
    } catch (e) {
      setApiError(getErrorMessage(e));
    }
  };

  if (!user) {
    return <p className="text-sm text-slate-700">You must be logged in to edit your profile.</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-4">
      <h1 className="text-lg font-semibold">Edit profile</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="block text-sm font-medium text-slate-700">Display name</label>
          <Input {...register('displayName')} />
          <FormError message={errors.displayName?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Bio</label>
          <Textarea rows={3} {...register('bio')} />
          <FormError message={errors.bio?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Avatar URL</label>
          <Input {...register('avatarUrl')} />
          <FormError message={errors.avatarUrl?.message} />
        </div>
        <FormError message={apiError} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </form>
    </div>
  );
};
