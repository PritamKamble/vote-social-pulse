
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PollDetailComponent from '@/components/polls/PollDetail';
import { usePoll } from '@/hooks/usePolls';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';

const PollDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { poll, loading, error, hasVoted, vote, voteLoading } = usePoll(id || '');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleVote = async (optionId: string) => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/poll/${id}` } });
      return;
    }
    
    await vote(optionId, user.id);
  };

  const isOwner = user && poll && user.id === poll.user_id;

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Loading poll...</p>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{error || "Poll not found"}</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost" 
          className="mb-4 flex items-center gap-1"
        >
          <ArrowLeft size={18} /> Back
        </Button>
        
        {isOwner && (
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-md mb-6 text-sm">
            You created this poll
          </div>
        )}
      </div>
      
      <PollDetailComponent
        poll={poll}
        hasVoted={hasVoted}
        onVote={handleVote}
        isLoading={voteLoading}
      />
      
      {!user && !hasVoted && (
        <div className="max-w-2xl mx-auto mt-6 bg-gray-50 p-4 rounded-xl text-center">
          <p className="text-gray-600">
            You need to <a href="/login" className="text-primary hover:underline">sign in</a> to vote on this poll.
          </p>
        </div>
      )}
    </div>
  );
};

export default PollDetail;
