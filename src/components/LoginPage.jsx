import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TickImage from '../assets/images/tick.png'
import logo from '../assets/images/exchange_logo.png';


const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();
  
    useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/afd1/check-auth`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          navigate('/wallet'); // ✅ Redirect using router
        }
      })
      .catch(console.error);
  }, [navigate]);

  const showAlert = (message, type = 'success') => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/afd1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        showAlert('Login successful! Redirecting...', 'success');
        setTimeout(() => navigate('/wallet'), 1500);
      } else {
        showAlert(data.message || 'Login failed.', 'danger');
      }
    } catch (err) {
      showAlert('Login error. Please try again.', 'danger');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      showAlert('Passwords do not match.', 'danger');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/afd1/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        showAlert('Registration successful! You can now log in.', 'success');
        setActiveTab('login');
      } else {
        showAlert(data.error || 'Registration failed.', 'danger');
      }
    } catch (err) {
      showAlert('Registration error.', 'danger');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#e5e7eb] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-xl rounded-3xl overflow-hidden bg-white">

        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-100 to-white p-8">
          <div className="rounded-xl flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt="Saint Crown Logo" className="logo-image" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-1">
            {activeTab === 'login' ? 'AFD1 User Portal' : 'AFD1 User Portal'}
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Secure access to your digital treasury
          </p>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block pb-1 pl-1 text-left text-sm text-gray-700">Username</label>
                <input
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block pb-1 pl-1 text-left text-sm text-gray-700">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400 bg-white"
                  required
                />
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" />
                Remember me
                
              </div>

              <button
                type="submit"
                className="w-full bg-[#357bb5] text-white py-2 rounded-md font-semibold hover:bg-[#2563eb] transition"
              >
                Login
              </button>

              <div className="text-center text-sm mt-4 text-gray-600 flex justify-center items-center gap-[15px] cursor-pointer">
                Not yet registered?{' '}
                <p
                  onClick={() => setActiveTab('register')}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign up here
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block pb-1 pl-1 text-left text-sm text-gray-700">Username</label>
                <input
                  name="username"
                  type="text"
                  placeholder="Enter a username"
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block pb-1 pl-1 text-left text-sm text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block pb-1 pl-1 text-left text-sm text-gray-700">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Create password"
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block pb-1 pl-1 text-left text-sm text-gray-700">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400 bg-white"
                  required
                />
              </div>

              <div className="flex items-start text-sm text-gray-600">
                <input type="checkbox" className="mr-2 mt-1" required />
                I agree to the Terms and Conditions
              </div>

              <button
                type="submit"
                className="w-full bg-[#357bb5] text-white py-2 rounded-md font-semibold hover:bg-[#2563eb] transition"
              >
                Register
              </button>

              <div className="text-center text-sm mt-4 text-gray-600 flex justify-center items-center gap-[15px] cursor-pointer">
                Already have an account?{' '}
                <p
                  onClick={() => setActiveTab('login')}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Login here
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Right Panel */}
        <div className="md:flex flex-col justify-center w-full md:w-1/2 bg-gradient-to-b from-white to-blue-100 text-black p-8">
          <h2 className="text-3xl font-semibold mb-2">Welcome to AFD1 User Platform</h2>
          <p className="mb-4 text-base">Manage your digital assets securely with blockchain technology</p>
          <ul className="list-disc list-inside space-y-1 text-sm p-0">
            <li className='text-base flex gap-[10px] items-center'><img width={17} src={TickImage}/>Multi-blockchain support</li>
            <li className='text-base flex gap-[10px] items-center'><img width={17} src={TickImage}/>Institutional-grade security</li>
            <li className='text-base flex gap-[10px] items-center'><img width={17} src={TickImage}/>Seamless wallet synchronization</li>
            <li className='text-base flex gap-[10px] items-center'><img width={17} src={TickImage}/>Real-time transaction monitoring</li>
          </ul>
        </div>
      </div>

      {/* Alerts */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`bg-${a.type === 'danger' ? 'red' : 'green'}-100 border-l-4 border-${a.type === 'danger' ? 'red' : 'green'}-500 text-${a.type === 'danger' ? 'red' : 'green'}-700 p-4 rounded shadow-md`}
          >
            <div className="flex justify-between items-center">
              <span>{a.message}</span>
              <button onClick={() => setAlerts((prev) => prev.filter((al) => al.id !== a.id))}>
                ✖️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
