
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Poll } from '@/types';

interface PollCardProps {
  poll: Poll;
  onDelete?: () => void;
  isOwner?: boolean;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onDelete, isOwner = false }) => {
  const formattedDate = new Date(poll.created_at).toLocaleDateString();
  
  return (
    <Card className="poll-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{poll.title}</CardTitle>
        <p className="text-sm text-gray-500">Created on {formattedDate}</p>
      </CardHeader>
      <CardContent>
        {poll.options && poll.options.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Options:</p>
            <ul className="list-disc pl-5 space-y-1">
              {poll.options.slice(0, 3).map((option) => (
                <li key={option.id} className="text-gray-700">
                  {option.label}
                </li>
              ))}
              {poll.options.length > 3 && (
                <li className="text-gray-500 italic">
                  +{poll.options.length - 3} more options
                </li>
              )}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 italic">No options available</p>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Link to={`/poll/${poll.id}`}>
          <Button variant="default" className="bg-primary hover:bg-primary-600">
            View Poll
          </Button>
        </Link>
        
        {isOwner && onDelete && (
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="ml-2"
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PollCard;
