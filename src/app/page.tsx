'use client';

import { useState } from 'react';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('refresh_token', data.session.refresh_token);

      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsLogin(true);
        setSuccess(false);
        setFormData({ fullName: '', email: '', password: '' });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

      <div className="min-h-screen flex relative z-10">
        {/* Left Half - Features */}
        <div className="w-1/2 flex flex-col justify-center items-center p-12 relative">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-indigo-600/90 to-blue-600/90 backdrop-blur-sm"></div>
          
          <div className="max-w-lg relative z-10">
            {/* Logo and Title with animation */}
            <div className="mb-12 animate-slideInLeft">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-7xl transform hover:scale-110 transition-transform duration-300 hover:rotate-12">
                  💰
            </div>
                <h1 className="text-6xl font-bold text-white drop-shadow-2xl">
                  Expense Tracker
                </h1>
          </div>
              <p className="text-2xl text-white/90 font-light ml-20">
                Track Your Expenses Effortlessly
              </p>
            </div>

            {/* Description Content */}
            <div className="animate-slideInLeft animation-delay-200">
              <p className="text-xl text-white leading-relaxed">
                Stay on top of your spending with real-time expense tracking and detailed analytics. Gain insights into your habits, set financial goals, and manage your budget effortlessly. Your data stays secure, private, and accessible anytime, anywhere.
              </p>
            </div>

            {/* Decorative elements */}
            <div className="mt-12 flex gap-3 opacity-50">
              <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-ping animation-delay-200"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-ping animation-delay-400"></div>
            </div>
          </div>
        </div>

        {/* Right Half - Login/Signup Form */}
        <div className="w-1/2 flex items-center justify-center p-12 relative">
          <div className="w-full max-w-md animate-slideInRight">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
              
              <div className="relative z-10">
                {/* Toggle Tabs */}
                <div className="flex mb-8 bg-gray-700/50 rounded-xl p-1.5 backdrop-blur-sm">
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                      setSuccess(false);
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      isLogin
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                      setSuccess(false);
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      !isLogin
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl backdrop-blur-sm animate-fadeIn">
                    <p className="text-green-300 text-sm text-center flex items-center justify-center gap-2">
                      <span className="text-xl">✓</span>
                      Account created successfully! Switching to login...
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm animate-shake">
                    <p className="text-red-300 text-sm flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      {error}
                    </p>
                  </div>
                )}

                {/* Login Form */}
                {isLogin ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div className="group">
                      <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-xl">📧</span>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm group-hover:border-purple-500/50"
                          placeholder="john@example.com"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label 
                        htmlFor="password" 
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-xl">🔒</span>
                        </div>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm group-hover:border-purple-500/50"
                          placeholder="••••••••"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transform hover:scale-105 relative overflow-hidden group"
                    >
                      <span className="relative z-10">
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Logging in...
                          </span>
                        ) : (
                          'Login'
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                  </form>
                ) : (
                  // Signup Form
                  <form onSubmit={handleSignupSubmit} className="space-y-6">
                    <div className="group">
                      <label 
                        htmlFor="fullName" 
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-xl">👤</span>
                        </div>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm group-hover:border-purple-500/50"
                          placeholder="John Doe"
                          required
                          disabled={loading || success}
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label 
                        htmlFor="signup-email" 
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-xl">📧</span>
                        </div>
                        <input
                          type="email"
                          id="signup-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm group-hover:border-purple-500/50"
                          placeholder="john@example.com"
                          required
                          disabled={loading || success}
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label 
                        htmlFor="signup-password" 
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-xl">🔒</span>
                        </div>
                        <input
                          type="password"
                          id="signup-password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm group-hover:border-purple-500/50"
                          placeholder="••••••••"
                          required
                          minLength={6}
                          disabled={loading || success}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                        <span>ℹ️</span>
                        Must be at least 6 characters long
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || success}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transform hover:scale-105 relative overflow-hidden group"
                    >
                      <span className="relative z-10">
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Account...
                          </span>
                        ) : (
                          'Sign Up'
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
