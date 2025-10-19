import { supabase } from '../supabaseClient';
import type { User, UserInsert, UserUpdate } from '../types';

// Get all users
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as User[];
}

// Get user by ID
export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as User;
}

// Get user by email
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data as User;
}

// Create a new user
export async function createUser(user: UserInsert) {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// Ensure user exists in users table (upsert)
export async function ensureUserExists(userId: string, email?: string, name?: string) {
  try {
    // First, try to get the user
    const existing = await getUserById(userId);
    return existing;
  } catch {
    // User doesn't exist, create it
    try {
      return await createUser({
        id: userId,
        email: email || null,
        name: name || null,
      });
    } catch (createError) {
      console.error('Failed to create user:', createError);
      throw createError;
    }
  }
}

// Update a user
export async function updateUser(id: string, updates: UserUpdate) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// Delete a user
export async function deleteUser(id: string) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}


