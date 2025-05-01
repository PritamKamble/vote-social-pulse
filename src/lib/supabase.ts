
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// These would be replaced with actual environment variables in a production app
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

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
