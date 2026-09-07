import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils';

interface AIMarkdownProps {
  content: string;
  className?: string;
}

export const AIMarkdown: React.FC<AIMarkdownProps> = ({ content, className }) => {
  return (
    <div className={cn('prose prose-sm md:prose-base dark:prose-invert max-w-none prose-slate', className)}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
