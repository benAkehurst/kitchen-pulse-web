'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@/hooks/useUser';
import { User } from '@/types/Models';
import AvatarUpload from '@/components/Utility/AvatarUpload';
import { useNotifications } from '@/context/notificationsContext';

const userSchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  telephone: z.string().optional(),
  avatar: z.string().optional(),
});

type FormValues = z.infer<typeof userSchema>;

interface UserProfileFormProps {
  initialData: User;
}

export default function UserProfileForm({ initialData }: UserProfileFormProps) {
  const { updateProfile } = useUser();
  const { addNotification } = useNotifications();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || '',
      company: initialData?.company || '',
      telephone: initialData?.telephone || '',
      avatar: initialData?.avatar || '',
    },
  });

  // Sync initialData with the form
  useEffect(() => {
    reset({
      name: initialData.name || '',
      company: initialData.company || '',
      telephone: initialData.telephone || '',
    });
  }, [initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateProfile.mutateAsync(data);
      addNotification({
        message: 'Profile updated successfully',
        type: 'success',
      });
    } catch (error) {
      if (error) {
        addNotification({
          message: 'Error updating profile',
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-lg bg-white">
      <AvatarUpload initialAvatar={initialData.avatar} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="my-4">
          <label className="block mb-2 text-xl">Name</label>
          <input
            {...register('name')}
            placeholder="Your name"
            className="border p-2 w-full rounded-lg text-xl"
          />
        </div>

        <div className="my-4">
          <label className="block mb-2 text-xl">Company Name</label>
          <input
            {...register('company')}
            placeholder="Company name"
            className="border p-2 w-full rounded-lg text-xl"
          />
        </div>

        <div className="my-4">
          <label className="block mb-2 text-xl">Telephone</label>
          <input
            {...register('telephone')}
            placeholder="Telephone number"
            className="border p-2 w-full rounded-lg text-xl"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn bg-black text-white p-2 rounded w-full hover:bg-gray-800"
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
