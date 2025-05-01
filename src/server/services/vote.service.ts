
import { supabase } from '@/lib/supabase';
import { Vote } from '@/types';

export const voteService = {
  /**
   * Add a vote for a poll option
   */
  async addVote(pollId: string, optionId: string, userId: string) {
    // Check if user has already voted on this poll
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .single();
    
    if (existingVote) {
      return {
        data: null,
        error: { message: 'You have already voted on this poll' }
      };
    }
    
    // Insert the new vote
    return await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: userId
      })
      .select()
      .single();
  },
  
  /**
   * Get votes for a specific poll
   */
  async getVotesByPollId(pollId: string) {
    return await supabase
      .from('votes')
      .select('*')
      .eq('poll_id', pollId);
  },
  
  /**
   * Check if a user has voted on a specific poll
   */
  async hasUserVotedOnPoll(pollId: string, userId: string) {
    const { data } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .single();
    
    return !!data;
  }
};
