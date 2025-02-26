'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      console.log('email, password: ', email, password);
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white w-full py-2">
          Login
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
