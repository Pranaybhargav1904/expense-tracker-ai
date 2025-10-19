import { 
  getExpensesByUserId, 
  getExpensesWithCategory,
  getExpensesByDateRange,
  getTotalExpensesByUser,
  getExpensesSummaryByCategory
} from '../db/expenses';
import { getCategoriesByUserId } from '../db/categories';

// Define MCP tool schemas
export const mcpTools = [
  {
    name: 'get_user_expenses',
    description: 'Retrieve all expenses for a specific user with optional date filtering',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The user ID to fetch expenses for'
        },
        startDate: {
          type: 'string',
          description: 'Optional start date in YYYY-MM-DD format',
          optional: true
        },
        endDate: {
          type: 'string',
          description: 'Optional end date in YYYY-MM-DD format',
          optional: true
        }
      },
      required: ['userId']
    }
  },
  {
    name: 'get_expenses_with_categories',
    description: 'Get all expenses with their associated category details for a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The user ID to fetch expenses for'
        }
      },
      required: ['userId']
    }
  },
  {
    name: 'get_expense_summary',
    description: 'Get a summary of expenses grouped by category for a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The user ID to get summary for'
        }
      },
      required: ['userId']
    }
  },
  {
    name: 'get_total_expenses',
    description: 'Calculate the total amount of all expenses for a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The user ID to calculate total for'
        }
      },
      required: ['userId']
    }
  },
  {
    name: 'get_user_categories',
    description: 'Get all expense categories for a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The user ID to fetch categories for'
        }
      },
      required: ['userId']
    }
  }
];

// Tool execution function
export async function executeMCPTool(toolName: string, args: {userId: string; startDate?: string; endDate?: string}) {
  try {
    switch (toolName) {
      case 'get_user_expenses': {
        if (args.startDate && args.endDate) {
          return await getExpensesByDateRange(args.userId, args.startDate, args.endDate);
        }
        return await getExpensesByUserId(args.userId);
      }
      
      case 'get_expenses_with_categories': {
        return await getExpensesWithCategory(args.userId);
      }
      
      case 'get_expense_summary': {
        const summary = await getExpensesSummaryByCategory(args.userId);
        // Group and sum by category
        const grouped = summary.reduce((acc: Record<string, number>, item: {amount: number; categories: {name: string} | null}) => {
          const categoryName = item.categories?.name || 'Uncategorized';
          if (!acc[categoryName]) {
            acc[categoryName] = 0;
          }
          acc[categoryName] += Number(item.amount);
          return acc;
        }, {} as Record<string, number>);
        return grouped;
      }
      
      case 'get_total_expenses': {
        const total = await getTotalExpensesByUser(args.userId);
        return { total, currency: 'USD' };
      }
      
      case 'get_user_categories': {
        return await getCategoriesByUserId(args.userId);
      }
      
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);
    throw error;
  }
}

// Convert tool response to string for LLM consumption
export function formatToolResponse(toolName: string, response: unknown): string {
  return JSON.stringify(response, null, 2);
}

