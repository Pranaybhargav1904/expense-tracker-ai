'use client';

import { useState, useEffect } from 'react';

interface Expense {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  category_id: string | null;
  user_id: string;
  created_at: string;
}

interface ExpensesListProps {
  userId: string | undefined;
  onExpensesLoaded?: (expenses: Expense[]) => void;
}

export default function ExpensesList({ userId, onExpensesLoaded }: ExpensesListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchExpenses = async () => {
    if (!userId) {
      setError('User ID not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/expenses?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const data = await response.json();
      setExpenses(data);
      
      // Notify parent component
      if (onExpensesLoaded) {
        onExpensesLoaded(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchExpenses();
    }
  }, [isOpen, userId]);

  const formatDate = (dateString: string) => {
    // Parse date string directly without timezone conversion
    const [year, month, day] = dateString.split('T')[0].split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0).toFixed(2);
  };

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="font-semibold text-lg">Your Expenses</span>
          {!isOpen && expenses.length > 0 && (
            <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
              {expenses.length} items
            </span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expenses Content */}
      {isOpen && (
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-indigo-100 dark:border-gray-700 overflow-hidden animate-fadeIn">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your expenses...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
              <button
                onClick={fetchExpenses}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Expenses Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start tracking your expenses by adding your first entry above.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                User ID: <span className="font-mono text-xs">{userId?.substring(0, 16)}...</span>
              </p>
            </div>
          ) : (
            <>
              {/* Summary Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 px-6 py-4 border-b border-indigo-100 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      ${getTotalExpenses()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {expenses.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expenses List */}
              <div className="max-h-96 overflow-y-auto">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {expenses.map((expense, index) => (
                    <div
                      key={expense.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                              {index + 1}
                            </span>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {expense.description || 'No description'}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 ml-8">
                            {formatDate(expense.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            ${Number(expense.amount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refresh Button */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={fetchExpenses}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Expenses
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

