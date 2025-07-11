import React from 'react';

const LoginPageNew = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#e5e7eb] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-xl rounded-3xl overflow-hidden bg-white">
        
        {/* Left Panel (Login Form) */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-100 to-white p-8">
          <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">➡️</span>
          </div>

          <h2 className="text-2xl font-bold text-center mb-1">Sign in with email</h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Secure access to your digital treasury
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-left text-sm text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-left text-sm text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2" />
              Remember me
              <span className="ml-auto text-blue-500 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>

          <div className="text-center text-sm mt-4 text-gray-600">
            Not yet registered?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Sign in here
            </a>
          </div>
        </div>

        {/* Right Panel (Info Section) */}
        <div className="hidden md:flex flex-col justify-center w-full md:w-1/2 bg-gradient-to-b from-white to-blue-100 text-white p-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome to AFD1 User Platform</h2>
          <p className="mb-4 text-sm">Manage your digital assets securely with blockchain technology</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Multi-blockchain support</li>
            <li>Institutional-grade security</li>
            <li>Seamless wallet synchronization</li>
            <li>Real-time transaction monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPageNew;
