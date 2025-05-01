
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Poll, PollOption } from '@/types';
import PollResults from './PollResults';

interface PollDetailProps {
  poll: Poll;
  hasVoted: boolean;
  onVote: (optionId: string) => Promise<void>;
  isLoading: boolean;
}

const PollDetail: React.FC<PollDetailProps> = ({ 
  poll, 
  hasVoted, 
  onVote,
  isLoading 
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleVote = async () => {
    if (!selectedOption) return;
    await onVote(selectedOption);
  };

  const formattedDate = new Date(poll.created_at).toLocaleDateString();

  return (
    <Card className="max-w-2xl mx-auto rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{poll.title}</CardTitle>
        <p className="text-sm text-gray-500">Created on {formattedDate}</p>
      </CardHeader>
      <CardContent>
        {hasVoted ? (
          <PollResults poll={poll} />
        ) : (
          <div className="space-y-6">
            <RadioGroup 
              value={selectedOption} 
              onValueChange={setSelectedOption}
              className="space-y-3"
            >
              {poll.options?.map((option: PollOption) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-base cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <Button
              onClick={handleVote}
              disabled={!selectedOption || isLoading}
              className="w-full bg-primary hover:bg-primary-600 mt-4"
            >
              {isLoading ? "Submitting..." : "Submit Vote"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PollDetail;
