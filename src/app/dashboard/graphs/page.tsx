'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/AuthContext';

export default function GraphsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Array<{
    id: string;
    amount: number;
    category: string;
    date: string;
  }>>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch expenses when component mounts
    const fetchExpenses = async () => {
      try {
        // TODO: Implement actual API call to fetch expenses
        // For now, using mock data
        setExpenses([]);
        setLoadingExpenses(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setLoadingExpenses(false);
      }
    };

    if (user) {
      fetchExpenses();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b-4 border-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="cursor-pointer group">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent transition-all duration-200 group-hover:scale-105">
              💰 Expense Tracker
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              👋 {user.fullName || user.email}
            </span>
            <Link href="/dashboard">
              <button
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
              >
                <span className="text-lg">📝</span>
                Add Expense
              </button>
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Smart Graphs
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize your expenses with interactive charts and analytics
          </p>
        </div>

        {loadingExpenses ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading expenses...</p>
            </div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 border-t-4 border-purple-600 text-center">
            <div className="text-8xl mb-6">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Expenses Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Start adding expenses to see beautiful graphs and analytics here!
            </p>
            <Link href="/dashboard">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                Add Your First Expense
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-t-4 border-purple-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📊</span>
                Category Distribution
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Chart will be displayed here</p>
              </div>
            </div>

            {/* Monthly Spending Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-t-4 border-blue-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📈</span>
                Monthly Spending Trend
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Chart will be displayed here</p>
              </div>
            </div>

            {/* Payment Method Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-t-4 border-green-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>💳</span>
                Payment Method Breakdown
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Chart will be displayed here</p>
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-t-4 border-pink-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>💰</span>
                Summary Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Total Expenses</span>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">$0.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">This Month</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">$0.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Average per Day</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">$0.00</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

