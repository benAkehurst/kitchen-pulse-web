'use client';

import { useNotifications } from '@/context/notificationsContext';

const LoadingOverlay = () => {
  const { loadingMessage } = useNotifications();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold">{loadingMessage}</p>
        <div className="mt-4">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
