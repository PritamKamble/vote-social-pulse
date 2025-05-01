
// User type based on Supabase auth
export interface User {
  id: string;
  email?: string;
}

// Poll types
export interface Poll {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  options?: PollOption[];
}

export interface PollOption {
  id: string;
  poll_id: string;
  label: string;
  votes_count?: number;
}

export interface Vote {
  id: number;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
