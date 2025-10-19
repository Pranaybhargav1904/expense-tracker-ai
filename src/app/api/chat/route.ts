import { NextRequest, NextResponse } from 'next/server';
import { processLLMQuery, validateGroqApiKey, ChatMessage } from '@/app/lib/groq/llmService';
import { createAIQuery, ensureUserExists } from '@/app/lib/db';

// POST - Process a chat message with LLM
export async function POST(request: NextRequest) {
  try {
    // Validate Groq API key
    if (!validateGroqApiKey()) {
      return NextResponse.json(
        { error: 'Groq API key is not configured. Please set GROQ_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { userId, message, conversationHistory } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate conversation history if provided
    let history: ChatMessage[] = [];
    if (conversationHistory) {
      if (!Array.isArray(conversationHistory)) {
        return NextResponse.json(
          { error: 'Conversation history must be an array' },
          { status: 400 }
        );
      }
      history = conversationHistory;
    }

    // Ensure user exists in database
    try {
      await ensureUserExists(userId);
    } catch (userError) {
      console.error('Failed to ensure user exists:', userError);
      // Continue anyway
    }

    // Process the query with LLM
    const { response, toolsUsed } = await processLLMQuery(
      message.trim(),
      userId,
      history
    );

    // Try to save the query and response to database (optional)
    let aiQuery = null;
    try {
      aiQuery = await createAIQuery({
        user_id: userId,
        query_text: message.trim(),
        ai_response: response,
      });
    } catch (dbError) {
      console.error('Failed to save AI query to database:', dbError);
      // Continue anyway - don't fail the request if DB save fails
    }

    return NextResponse.json({
      id: aiQuery?.id || crypto.randomUUID(),
      query: message.trim(),
      response,
      toolsUsed,
      timestamp: aiQuery?.created_at || new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    console.error('POST /api/chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle specific error types
    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid or missing Groq API key' },
        { status: 401 }
      );
    }

    if (errorMessage.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: errorMessage || 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

// GET - Health check for chat API
export async function GET() {
  const apiKeyConfigured = validateGroqApiKey();
  
  return NextResponse.json({
    status: 'ok',
    groqConfigured: apiKeyConfigured,
    message: apiKeyConfigured 
      ? 'Chat API is ready' 
      : 'Groq API key not configured'
  });
}

