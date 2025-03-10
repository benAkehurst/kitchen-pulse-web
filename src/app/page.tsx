'use client';

import Login from '@/components/Layout/Auth';
import RegisterCTA from '@/components/Utility/RegisterCTA';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Welcome to Kitchen Pulse</h1>
      <RegisterCTA />
      <Login />
    </div>
  );
}
