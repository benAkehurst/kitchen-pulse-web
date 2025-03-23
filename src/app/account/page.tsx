'use client';

import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import UserProfileForm from '@/components/Forms/UserProfileForm';
import { useNotifications } from '@/context/notificationsContext';
import LoadingOverlay from '@/components/UI/LoadingOverlay';

export default function AccountPage() {
  const {
    user,
    userQuery: { isLoading: userLoading, isError: userError },
  } = useUser();
  const { logout } = useAuth();
  const { addNotification } = useNotifications();

  const isLoading = userLoading;
  const isError = userError;

  if (isError) {
    addNotification({
      message: 'Error fetching dashboard data',
      type: 'error',
    });
  }

  if (isLoading) return <LoadingOverlay />;

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">Account settings</h1>
        <button
          className="btn bg-black text-white p-2 rounded hover:bg-gray-800"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
      <div>
        <UserProfileForm initialData={user} />
      </div>
    </div>
  );
}
