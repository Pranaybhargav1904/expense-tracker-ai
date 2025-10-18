import { supabase } from '../supabaseClient';
import type { AIQuery, AIQueryInsert, AIQueryUpdate } from '../types';

// Get all AI queries
export async function getAllAIQueries() {
  const { data, error } = await supabase
    .from('ai_queries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as AIQuery[];
}

// Get AI queries by user ID
export async function getAIQueriesByUserId(userId: string) {
  const { data, error } = await supabase
    .from('ai_queries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as AIQuery[];
}

// Get recent AI queries by user (limit to last N queries)
export async function getRecentAIQueries(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('ai_queries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as AIQuery[];
}

// Get AI query by ID
export async function getAIQueryById(id: string) {
  const { data, error } = await supabase
    .from('ai_queries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as AIQuery;
}

// Create a new AI query
export async function createAIQuery(aiQuery: AIQueryInsert) {
  const { data, error } = await supabase
    .from('ai_queries')
    .insert(aiQuery)
    .select()
    .single();

  if (error) throw error;
  return data as AIQuery;
}

// Update an AI query
export async function updateAIQuery(id: string, updates: AIQueryUpdate) {
  const { data, error } = await supabase
    .from('ai_queries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as AIQuery;
}

// Delete an AI query
export async function deleteAIQuery(id: string) {
  const { error } = await supabase
    .from('ai_queries')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Search AI queries by text
export async function searchAIQueries(userId: string, searchText: string) {
  const { data, error } = await supabase
    .from('ai_queries')
    .select('*')
    .eq('user_id', userId)
    .or(`query_text.ilike.%${searchText}%,ai_response.ilike.%${searchText}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as AIQuery[];
}


