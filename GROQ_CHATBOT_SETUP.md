# Groq LLM Chatbot Integration

## Overview

This expense tracker now includes an intelligent chatbot powered by Groq's LLM API with Model Context Protocol (MCP) support. The chatbot can answer custom queries about your expenses using natural language.

## Features

- **Natural Language Queries**: Ask questions in plain English about your expenses
- **MCP Tool Integration**: The LLM can automatically fetch relevant expense data using specialized tools
- **Context-Aware**: Maintains conversation history for better context understanding
- **Real-time Analysis**: Get instant insights about spending patterns, totals, and categories
- **Persistent History**: All queries and responses are saved to the database

## Setup Instructions

### 1. Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in to your account
3. Generate a new API key
4. Copy the API key

### 2. Configure Environment Variables

Open your `.env.local` file and add your Groq API key:

```bash
GROQ_API_KEY=your_actual_groq_api_key_here
```

Replace `your_actual_groq_api_key_here` with the API key you copied from Groq Console.

### 3. Restart Development Server

After updating the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## API Usage

### Endpoint: `/api/chat`

#### POST Request

Send a chat message and get an AI-powered response:

```typescript
// Request
POST /api/chat
Content-Type: application/json

{
  "userId": "user-uuid-here",
  "message": "What are my total expenses this month?",
  "conversationHistory": [] // Optional: previous messages for context
}

// Response
{
  "id": "query-uuid",
  "query": "What are my total expenses this month?",
  "response": "Based on your expense data, your total expenses this month are $1,234.56. This includes expenses across categories like Food ($400), Transport ($300), and Entertainment ($534.56).",
  "toolsUsed": ["get_user_expenses", "get_expense_summary"],
  "timestamp": "2025-10-19T12:00:00Z"
}
```

#### GET Request

Health check to verify API configuration:

```typescript
GET /api/chat

// Response
{
  "status": "ok",
  "groqConfigured": true,
  "message": "Chat API is ready"
}
```

## Available MCP Tools

The LLM has access to the following tools to retrieve your expense data:

### 1. `get_user_expenses`
Retrieve all expenses with optional date filtering.
- **Parameters**: `userId`, `startDate` (optional), `endDate` (optional)
- **Use case**: "Show me all my expenses" or "What did I spend in January?"

### 2. `get_expenses_with_categories`
Get expenses with their associated category details.
- **Parameters**: `userId`
- **Use case**: "What categories am I spending in?"

### 3. `get_expense_summary`
Get spending summary grouped by category.
- **Parameters**: `userId`
- **Use case**: "Give me a breakdown by category"

### 4. `get_total_expenses`
Calculate total expenses for a user.
- **Parameters**: `userId`
- **Use case**: "How much have I spent in total?"

### 5. `get_user_categories`
Get all expense categories for a user.
- **Parameters**: `userId`
- **Use case**: "What expense categories do I have?"

## Example Queries

Here are some example questions you can ask the chatbot:

### Basic Queries
- "What are my total expenses?"
- "How much did I spend this month?"
- "Show me all my expenses"

### Category-Based Queries
- "What are my biggest spending categories?"
- "How much did I spend on food?"
- "Give me a breakdown by category"

### Time-Based Queries
- "What did I spend last week?"
- "Show me my expenses from January to March"
- "How does this month compare to last month?"

### Analysis Queries
- "Where am I spending the most money?"
- "What patterns do you see in my spending?"
- "Any suggestions to reduce expenses?"

## Implementation Details

### Architecture

```
User Query → API Route → LLM Service → MCP Tools → Database
                ↓
          Response with Insights
```

### Key Components

1. **MCP Tools** (`src/app/lib/mcp/tools.ts`)
   - Defines available tools and their schemas
   - Executes tool calls to fetch expense data
   - Formats responses for LLM consumption

2. **LLM Service** (`src/app/lib/groq/llmService.ts`)
   - Handles communication with Groq API
   - Manages tool call execution
   - Processes conversation history
   - Uses `llama-3.3-70b-versatile` model

3. **Chat API** (`src/app/api/chat/route.ts`)
   - Validates requests
   - Processes queries through LLM service
   - Saves conversation history to database
   - Returns formatted responses

### Conversation History

To maintain context across multiple messages, pass previous messages in `conversationHistory`:

```typescript
const conversationHistory = [
  { role: 'user', content: 'What are my total expenses?' },
  { role: 'assistant', content: 'Your total expenses are $1,500.' },
  { role: 'user', content: 'What about just food expenses?' }
];

// The LLM will understand the context from previous messages
```

## Error Handling

The API handles various error scenarios:

- **Missing API Key**: Returns 500 with configuration error
- **Invalid User ID**: Returns 400 with validation error
- **Rate Limiting**: Returns 429 with retry message
- **Tool Execution Errors**: Returns 500 with specific error message

## Security Notes

- ⚠️ **Never commit** your `.env.local` file to version control
- The API key should be kept secret and not exposed to the client
- All database queries are scoped to the authenticated user
- Tool calls automatically inject the correct `userId`

## Performance

- **Model**: Uses Groq's `llama-3.3-70b-versatile` for fast responses
- **Caching**: Groq API includes built-in caching for improved performance
- **Tool Execution**: Tools run in parallel when possible
- **Max Iterations**: Limited to 5 tool call iterations to prevent infinite loops

## Troubleshooting

### "Groq API key not configured"
- Verify `.env.local` contains `GROQ_API_KEY=your_key`
- Restart your development server after adding the key

### "Rate limit exceeded"
- Groq has rate limits on free tier
- Wait a few moments before trying again
- Consider upgrading to a paid plan for higher limits

### "Failed to process chat message"
- Check that your Supabase connection is working
- Verify the user has expenses in the database
- Check browser console for detailed error messages

## Next Steps

### Frontend Integration

Create a chat UI component to interact with the API:

```typescript
const sendMessage = async (message: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: currentUser.id,
      message,
      conversationHistory
    })
  });
  
  const data = await response.json();
  return data.response;
};
```

### Enhancements

Consider adding:
- Streaming responses for better UX
- Voice input/output capabilities
- More sophisticated analytics tools
- Budget recommendations
- Expense prediction models
- Export functionality for reports

## Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Groq API documentation
3. Check your database connection
4. Verify environment variables are loaded correctly

