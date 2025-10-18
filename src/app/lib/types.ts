// Database Types

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
}

export interface AIQuery {
  id: string;
  user_id: string;
  query_text: string | null;
  ai_response: string | null;
  created_at: string;
}

// Insert types (without auto-generated fields)
export type UserInsert = Omit<User, 'id' | 'created_at'>;
export type CategoryInsert = Omit<Category, 'id' | 'created_at'>;
export type ExpenseInsert = Omit<Expense, 'id' | 'created_at'>;
export type AIQueryInsert = Omit<AIQuery, 'id' | 'created_at'>;

// Update types (all fields optional except id)
export type UserUpdate = Partial<Omit<User, 'id' | 'created_at'>>;
export type CategoryUpdate = Partial<Omit<Category, 'id' | 'created_at'>>;
export type ExpenseUpdate = Partial<Omit<Expense, 'id' | 'created_at'>>;
export type AIQueryUpdate = Partial<Omit<AIQuery, 'id' | 'created_at'>>;


