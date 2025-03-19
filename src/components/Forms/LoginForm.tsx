'use client';

import { useNotifications } from '@/context/notificationsContext';
import LoadingOverlay from '../UI/LoadingOverlay';
import { useState } from 'react';

interface LoginFormProps {
  handleLogin: () => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
}

export default function LoginForm({
  handleLogin,
  email,
  setEmail,
  password,
  setPassword,
  error,
}: LoginFormProps) {
  const { loading } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSubmitting(true);
          handleLogin();
        }}
        className="bg-white p-6 w-96"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 mb-2 mt-2 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 mb-4 mt-2 rounded-lg"
        />
        <button
          type="submit"
          className="btn bg-black text-white w-full py-2 rounded-lg"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            'Login'
          )}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {loading && <LoadingOverlay />}
      </form>
    </div>
  );
}
