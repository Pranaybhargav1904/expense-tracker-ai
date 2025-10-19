'use client';

import { useAuth } from '@/app/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatInterface from '@/app/components/ChatInterface';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Chat Assistant</h1>
              <p className="text-gray-600 mt-1">Ask questions about your expenses in natural language</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <ChatInterface userId={user.id} />
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Example Questions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• &quot;What are my total expenses?&quot;</li>
            <li>• &quot;How much did I spend on food this month?&quot;</li>
            <li>• &quot;Give me a breakdown of my spending by category&quot;</li>
            <li>• &quot;What are my biggest expenses?&quot;</li>
            <li>• &quot;Show me expenses from last week&quot;</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

