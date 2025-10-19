import Groq from 'groq-sdk';
import { mcpTools, executeMCPTool, formatToolResponse } from '../mcp/tools';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

const SYSTEM_PROMPT = `You are an intelligent expense tracking assistant. You help users understand their spending patterns, analyze expenses, and answer questions about their financial data.

You have access to the following tools to retrieve expense data:
- get_user_expenses: Get all expenses for a user (with optional date filtering)
- get_expenses_with_categories: Get expenses with category information
- get_expense_summary: Get spending summary grouped by category
- get_total_expenses: Calculate total expenses for a user
- get_user_categories: Get all expense categories for a user

When answering questions:
1. Use the appropriate tools to fetch relevant data
2. Provide clear, concise answers with specific numbers when available
3. Offer insights and observations about spending patterns
4. Be helpful and conversational
5. Format currency values appropriately
6. If asked about trends or comparisons, use the data to provide meaningful analysis

Remember: You can only access data for the specific user making the request.`;

export async function processLLMQuery(
  userQuery: string, 
  userId: string,
  conversationHistory: ChatMessage[] = []
): Promise<{ response: string; toolsUsed: string[] }> {
  try {
    const toolsUsed: string[] = [];
    
    // Prepare messages with system prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userQuery }
    ];

    // First LLM call - determine if tools are needed
    let response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Using Groq's fastest model
      messages,
      tools: mcpTools.map(tool => ({
        type: 'function' as const,
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema
        }
      })),
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 2048
    });

    let responseMessage = response.choices[0]?.message;

    // Handle tool calls iteratively
    const maxIterations = 5;
    let iterations = 0;
    
    while (responseMessage?.tool_calls && iterations < maxIterations) {
      iterations++;
      
      // Add assistant's response with tool calls to messages
      messages.push(responseMessage);

      // Execute each tool call
      const toolResults = await Promise.all(
        responseMessage.tool_calls.map(async (toolCall: {id: string; function: {name: string; arguments: string}}) => {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);
          
          // Inject userId into tool arguments
          toolArgs.userId = userId;
          
          toolsUsed.push(toolName);
          
          try {
            const result = await executeMCPTool(toolName, toolArgs);
            const formattedResult = formatToolResponse(toolName, result);
            
            return {
              role: 'tool',
              tool_call_id: toolCall.id,
              name: toolName,
              content: formattedResult
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
              role: 'tool',
              tool_call_id: toolCall.id,
              name: toolName,
              content: JSON.stringify({ error: errorMessage })
            };
          }
        })
      );

      // Add tool results to messages
      messages.push(...toolResults);

      // Make another LLM call with tool results
      response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 2048
      });

      responseMessage = response.choices[0]?.message;
    }

    const finalResponse = responseMessage?.content || 'I apologize, but I encountered an issue processing your request.';
    
    return {
      response: finalResponse,
      toolsUsed: [...new Set(toolsUsed)] // Remove duplicates
    };

  } catch (error) {
    console.error('Error in processLLMQuery:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`LLM processing failed: ${errorMessage}`);
  }
}

// Function to validate Groq API key
export function validateGroqApiKey(): boolean {
  return !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 0;
}

