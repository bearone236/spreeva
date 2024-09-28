'use client'

import { useState } from 'react';
import LevelDisplay from '@/components/LevelDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type HistoryEntry = {
  id: string;
  date: string;
  theme: string;
  level: 'Low' | 'Middle' | 'High';
  speakTime: number;
  thinkTime: number;
  aiEvaluation: string;
  aiImprovedText: string | null;
  spokenText: string;
};

const HistoryCard = ({ entry }: { entry: HistoryEntry }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className='mb-4 overflow-hidden shadow-lg border rounded-lg'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-start'>
          <div className='w-full'>
            <p className='text-sm text-gray-500'>{entry.date}</p>
            <h3 className='text-lg font-semibold text-[#ed7e00] mt-1'>
              {entry.theme}
            </h3>
          </div>
          <div className='ml-4'>
            <LevelDisplay level={entry.level} />
          </div>
        </div>
        {isExpanded && (
          <div className='mt-4 text-sm text-gray-600'>
            <div className='border p-2 rounded mb-2 bg-gray-50'>
              <span className='font-semibold'>あなたの文章:</span>{' '}
              <span className='whitespace-pre-wrap break-words'>
                {entry.spokenText}
              </span>
            </div>
            <div className='border p-2 rounded mb-2 bg-gray-50'>
              <span className='font-semibold'>シンキング時間:</span> {entry.thinkTime} seconds
            </div>
            <div className='border p-2 rounded mb-2 bg-gray-50'>
              <span className='font-semibold'>スピーキング時間:</span> {entry.speakTime} seconds
            </div>
            <div className='border p-2 rounded mb-2 bg-gray-50'>
              <span className='font-semibold'>AI評価:</span>
              <span className='whitespace-pre-wrap break-words block mt-2'>
                <ReactMarkdown>{entry.aiEvaluation}</ReactMarkdown>
              </span>
            </div>
            {entry.aiImprovedText && (
              <div className='border p-2 rounded bg-gray-50'>
                <span className='font-semibold'>AIの改善案:</span>{' '}
                <span className='whitespace-pre-wrap break-words block mt-2'>
                  {entry.aiImprovedText}
                </span>
              </div>
            )}
          </div>
        )}
        <Button
          variant='ghost'
          size='sm'
          className='mt-2 w-full text-[#ed9600] flex items-center justify-center'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className='w-4 h-4 mr-2' /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className='w-4 h-4 mr-2' /> Show More
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function HistoryPageClient({ history }: { history: HistoryEntry[] }) {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100'>
      <Card className='w-full max-w-4xl bg-white shadow-lg rounded-lg'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-[#ed7e00] text-center py-4'>
            スピーキング履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
            {history.map(entry => (
              <HistoryCard key={entry.id} entry={entry} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
