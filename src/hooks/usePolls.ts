
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Poll, PollOption } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const usePolls = (userId?: string) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPolls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('polls').select('*');
      
      // If userId is provided, filter by user_id
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch options for each poll
      const pollsWithOptions = await Promise.all(
        data.map(async (poll) => {
          const { data: options } = await supabase
            .from('options')
            .select('*')
            .eq('poll_id', poll.id);
            
          return { ...poll, options: options || [] };
        })
      );
      
      setPolls(pollsWithOptions);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching polls",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const createPoll = async (title: string, optionLabels: string[]) => {
    try {
      if (!userId) throw new Error('User not authenticated');
      
      // Step 1: Create the poll
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({ title, user_id: userId })
        .select('*')
        .single();
        
      if (pollError) throw pollError;
      
      // Step 2: Create the options
      const optionsToInsert = optionLabels.map(label => ({
        poll_id: poll?.id,
        label
      }));
      
      const { error: optionsError } = await supabase
        .from('options')
        .insert(optionsToInsert);
        
      if (optionsError) throw optionsError;
      
      // Refresh polls
      fetchPolls();
      
      toast({
        title: "Poll created",
        description: "Your poll has been successfully created.",
      });
      
      return poll;
    } catch (err: any) {
      toast({
        title: "Error creating poll",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deletePoll = async (pollId: string) => {
    try {
      if (!userId) throw new Error('User not authenticated');
      
      // Check if user owns this poll
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .eq('user_id', userId)
        .single();
        
      if (pollError) throw new Error('Poll not found or you do not have permission');
      
      // Delete the poll (cascade will handle options and votes)
      const { error: deleteError } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId);
        
      if (deleteError) throw deleteError;
      
      // Update state
      setPolls(polls.filter(p => p.id !== pollId));
      
      toast({
        title: "Poll deleted",
        description: "Your poll has been successfully deleted.",
      });
    } catch (err: any) {
      toast({
        title: "Error deleting poll",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    polls,
    loading,
    error,
    fetchPolls,
    createPoll,
    deletePoll,
  };
};

export const usePoll = (pollId: string) => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const { toast } = useToast();

  const fetchPoll = useCallback(async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch poll data
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .single();
        
      if (pollError) throw pollError;
      
      // Fetch options with vote counts
      const { data: options, error: optionsError } = await supabase
        .from('options')
        .select(`
          id,
          poll_id,
          label,
          votes:votes(count)
        `)
        .eq('poll_id', pollId);
        
      if (optionsError) throw optionsError;
      
      // Process options to extract vote counts
      const optionsWithCounts = options.map((option: any) => ({
        ...option,
        votes_count: option.votes.length > 0 ? parseInt(option.votes[0].count) : 0,
        votes: undefined
      }));
      
      // Check if user has voted
      if (userId) {
        const { data: vote, error: voteError } = await supabase
          .from('votes')
          .select('*')
          .eq('poll_id', pollId)
          .eq('user_id', userId)
          .single();
          
        setHasVoted(!!vote && !voteError);
      }
      
      setPoll({
        ...pollData,
        options: optionsWithCounts
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching poll",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [pollId, toast]);

  const vote = async (optionId: string, userId: string) => {
    if (hasVoted) return;
    
    try {
      setVoteLoading(true);
      
      // Insert vote
      const { error } = await supabase
        .from('votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_id: userId
        });
        
      if (error) throw error;
      
      setHasVoted(true);
      
      // Refetch poll data to update vote counts
      await fetchPoll(userId);
      
      toast({
        title: "Vote recorded",
        description: "Your vote has been successfully recorded.",
      });
    } catch (err: any) {
      toast({
        title: "Error voting",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setVoteLoading(false);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchPoll(session.user.id);
      } else {
        fetchPoll();
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [fetchPoll]);

  // Subscribe to realtime changes
  useEffect(() => {
    const userId = supabase.auth.getSession().then(({ data }) => {
      return data?.session?.user?.id;
    });
    
    const channel = supabase
      .channel(`poll:${pollId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'votes',
        filter: `poll_id=eq.${pollId}`
      }, () => {
        userId.then(id => fetchPoll(id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId, fetchPoll]);

  return {
    poll,
    loading,
    error,
    hasVoted,
    vote,
    voteLoading,
    fetchPoll
  };
};
