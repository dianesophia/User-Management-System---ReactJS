import { Link } from "react-router-dom";

export const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded shadow text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl text-gray-700 mb-6">Unauthorized</p>
      <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
      <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Go Back to Login
      </Link>
    </div>
  </div>
);
