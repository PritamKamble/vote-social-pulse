
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface PollFormProps {
  onSubmit: (title: string, options: string[]) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

const PollForm: React.FC<PollFormProps> = ({ onSubmit, isLoading, error }) => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty options
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please add at least 2 valid options');
      return;
    }
    await onSubmit(title, validOptions);
  };

  return (
    <Card className="max-w-lg mx-auto rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create a New Poll</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Poll Question</Label>
            <Input
              id="title"
              placeholder="What's your favorite programming language?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                  {options.length > 2 && (
                    <Button 
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full mt-2 flex items-center justify-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Option
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-600" 
            disabled={isLoading}
          >
            {isLoading ? "Creating Poll..." : "Create Poll"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PollForm;
