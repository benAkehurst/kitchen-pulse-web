'use client';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="mt-4">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
