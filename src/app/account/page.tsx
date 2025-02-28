'use client';

import { useUser } from '@/hooks/useUser';
import { User } from '@/types/Models';
import { useEffect, useState } from 'react';
import UserProfileForm from '@/components/UserProfileForm';

export default function AccountPage() {
  const { getUserInformation } = useUser();
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
      <h1 className="text-3xl mb-4">Account settings</h1>
      <div>
        <UserProfileForm initialData={userInformation} />
      </div>
    </div>
  );
}
