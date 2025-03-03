'use client';

import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/Models';
import { useEffect, useState } from 'react';
import UserProfileForm from '@/components/UserProfileForm';

export default function AccountPage() {
  const { getUserInformation } = useUser();
  const { logout } = useAuth();
  const [userInformation, setUserInformation] = useState<User>({
    email: '',
    name: '',
    company: '',
    telephone: '',
    avatar: '',
  });

  useEffect(() => {
    const getUser = async () => {
      const userInformation = await getUserInformation();
      setUserInformation(userInformation);
    };
    getUser();
  }, []);

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl mb-4">Account settings</h1>
        <button
          className="bg-black text-white p-2 rounded hover:bg-gray-800"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
      <div>
        <UserProfileForm initialData={userInformation} />
      </div>
    </div>
  );
}
