import React from "react";
import { Link } from "react-router-dom";

const ServerErrorPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-red-50 overflow-hidden">
      <div className="text-center">
        <div className="text-9xl font-bold text-red-500 animate-pulse">500</div>
        <div className="text-2xl mt-4 text-gray-700">Internal Server Error</div>
        <p className="text-md mt-2 text-gray-600 max-w-md mx-auto">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="mt-6 space-x-4">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-transform hover:scale-105"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-block px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-transform hover:scale-105"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
