
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { voteService } from '../vote.service';

// Mock the Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: '123', poll_id: 'poll-123', option_id: 'option-123', user_id: 'user-123' },
            error: null
          }))
        }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: null
            }))
          }))
        }))
      })),
    }))
  }
}));

describe('Vote Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a vote when user has not voted yet', async () => {
    const result = await voteService.addVote('poll-123', 'option-123', 'user-123');
    
    expect(result).toEqual({
      data: { id: '123', poll_id: 'poll-123', option_id: 'option-123', user_id: 'user-123' },
      error: null
    });
  });

  // Additional tests would go here
});
