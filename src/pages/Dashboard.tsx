
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PollForm from '@/components/polls/PollForm';
import PollCard from '@/components/polls/PollCard';
import { useAuth } from '@/hooks/useAuth';
import { usePolls } from '@/hooks/usePolls';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { polls, loading, createPoll, deletePoll } = usePolls(user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isCreating, setIsCreating] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleCreatePoll = async (title: string, options: string[]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create polls",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setFormLoading(true);
      setError(undefined);
      
      const poll = await createPoll(title, options);
      
      toast({
        title: "Poll created",
        description: "Your poll has been successfully created.",
      });
      
      setIsCreating(false);
      
      // Check if poll exists before navigating
      if (poll && poll.id) {
        navigate(`/poll/${poll.id}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    try {
      await deletePoll(pollId);
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Create and manage your polls</p>
        </div>
        
        {!isCreating && (
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-primary hover:bg-primary-600 flex items-center gap-2"
          >
            <Plus size={18} /> Create New Poll
          </Button>
        )}
      </div>
      
      {isCreating ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Create New Poll</h2>
            <Button variant="ghost" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>
          <PollForm 
            onSubmit={handleCreatePoll} 
            isLoading={formLoading} 
            error={error} 
          />
        </div>
      ) : (
        <Tabs defaultValue="my-polls" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="my-polls">My Polls</TabsTrigger>
            <TabsTrigger value="all-polls">All Polls</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-polls">
            {loading ? (
              <p className="text-center py-8">Loading your polls...</p>
            ) : polls.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">You haven't created any polls yet</h3>
                <p className="text-gray-500 mb-6">Create your first poll to start collecting votes</p>
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="bg-primary hover:bg-primary-600"
                >
                  Create Your First Poll
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {polls.map((poll) => (
                  <PollCard 
                    key={poll.id} 
                    poll={poll} 
                    isOwner={true}
                    onDelete={() => handleDeletePoll(poll.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all-polls">
            <div className="text-center py-8">
              <p>Feature coming soon! This tab will display public polls from all users.</p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Dashboard;
