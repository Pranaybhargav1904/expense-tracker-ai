'use client';

import { useState } from 'react';

interface UserDebugInfoProps {
  userId: string | undefined;
}

interface DebugData {
  currentUserId: string;
  totalExpenses: number;
  userExpenses: Array<{id: string; amount: number; description: string; user_id: string}> | null;
  allExpenses: Array<{id: string; amount: number; description: string; user_id: string}>;
}

export default function UserDebugInfo({ userId }: UserDebugInfoProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugInfo = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/debug?userId=${userId}`);
      const data = await response.json();
      setDebugData(data);
    } catch (error) {
      console.error('Debug fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!showDebug) {
    return (
      <button
        onClick={() => {
          setShowDebug(true);
          fetchDebugInfo();
        }}
        className="fixed bottom-4 left-4 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors z-50"
      >
        🐛 Debug Info
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-96 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-600 overflow-auto z-50">
      <div className="sticky top-0 bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white">🐛 Debug Info</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="p-4 text-xs">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : debugData ? (
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Your User ID:</p>
              <p className="font-mono text-purple-600 dark:text-purple-400 break-all">{userId}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Total Expenses in DB:</p>
              <p className="text-gray-700 dark:text-gray-300">{debugData.totalExpenses}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Your Expenses:</p>
              <p className="text-gray-700 dark:text-gray-300">
                {debugData.userExpenses?.length || 0} expenses
              </p>
              {debugData.userExpenses && debugData.userExpenses.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {debugData.userExpenses.map((exp) => (
                    <li key={exp.id} className="text-gray-600 dark:text-gray-400">
                      ${exp.amount} - {exp.description || 'No description'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-600 dark:text-red-400 mt-1">
                  ⚠️ No expenses found for your user ID
                </p>
              )}
            </div>

            {debugData.allExpenses && debugData.allExpenses.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">All Expenses (by user_id):</p>
                <ul className="mt-2 space-y-1">
                  {debugData.allExpenses.map((exp) => (
                    <li key={exp.id} className="text-gray-600 dark:text-gray-400">
                      <span className={exp.user_id === userId ? 'text-green-600 font-bold' : ''}>
                        User: {exp.user_id.substring(0, 8)}...
                      </span>
                      {' '}- ${exp.amount}
                      {exp.user_id === userId && ' ✓'}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-gray-300 dark:border-gray-600">
              <button
                onClick={fetchDebugInfo}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Click refresh to load data</p>
        )}
      </div>
    </div>
  );
}

