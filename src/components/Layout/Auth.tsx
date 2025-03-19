'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '../Forms/LoginForm';
import { useNotifications } from '@/context/notificationsContext';

export default function Login() {
  const { login } = useAuth();
  const { setLoading, setLoadingMessage } = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { accessToken } = await login(email, password);
      setLoading(false);
      setLoadingMessage('Logging in');
      router.push(`/dashboard?token=${accessToken}`);
    } catch (err) {
      if (err) {
        setLoading(false);
        setLoadingMessage('');
        setError('Invalid credentials');
      }
    }
  };

  return (
    <LoginForm
      handleLogin={handleLogin}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
    />
  );
}
