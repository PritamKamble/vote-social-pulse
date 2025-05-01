
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// For local development, replace these with your actual Supabase credentials
// In production, these would come from environment variables
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const subscribeToVotes = (pollId: string, callback: () => void) => {
  return supabase
    .channel(`poll:${pollId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'votes',
      filter: `poll_id=eq.${pollId}`
    }, () => {
      callback();
    })
    .subscribe();
};
