
import React from 'react';
import { Poll, PollOption } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PollResultsProps {
  poll: Poll;
}

const COLORS = ['#123456', '#4287f5', '#82ca9d', '#ffc658', '#8884d8', '#83a6ed', '#8dd1e1', '#a4de6c'];

const PollResults: React.FC<PollResultsProps> = ({ poll }) => {
  // Transform the options data for the chart
  const chartData = poll.options
    ?.filter(option => option.votes_count !== undefined)
    .map((option, index) => ({
      name: option.label,
      value: option.votes_count || 0,
      color: COLORS[index % COLORS.length]
    })) || [];

  // Calculate total votes
  const totalVotes = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Poll Results</h3>
      
      {totalVotes > 0 ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Total votes: {totalVotes}</p>
              {chartData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="text-sm truncate max-w-[200px]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.value}</span>
                    <span className="text-xs text-gray-500">
                      ({(item.value / totalVotes * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          No votes yet. Be the first to vote!
        </div>
      )}
    </div>
  );
};

export default PollResults;
