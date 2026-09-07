import React, { useState, useRef, useEffect } from 'react';
import { useAskAI } from '../hooks/useAI';
import { AIMarkdown } from './AIMarkdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AISource } from '../types/ai.types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: AISource[];
}

interface AIChatProps {
  initialMessages?: ChatMessage[];
}

const SUGGESTED_QUESTIONS = [
  "What are the biggest blockers this week?",
  "Which projects need attention?",
  "Summarize this week's achievements.",
  "What risks should I pay attention to?"
];

export const AIChat: React.FC<AIChatProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const askMutation = useAskAI();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (questionText: string) => {
    const text = questionText.trim();
    if (!text || askMutation.isPending) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const response = await askMutation.mutateAsync({ question: text });
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again."
      }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border shadow-sm overflow-hidden">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-muted-foreground p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">AI Assistant</h3>
              <p>Ask questions about your team's work, reports, blockers and trends.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-4">
              {SUGGESTED_QUESTIONS.map(q => (
                <Button 
                  key={q} 
                  variant="outline" 
                  className="h-auto py-3 px-4 justify-start text-left font-normal whitespace-normal hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all"
                  onClick={() => handleSend(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-muted/50 border rounded-tl-sm'
                }`}>
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  ) : (
                    <div className="space-y-4">
                      <AIMarkdown content={msg.content} />
                      
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                          <div className="font-medium mb-2">Sources ({msg.sources.length})</div>
                          <ul className="space-y-1">
                            {msg.sources.map((src, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                {src.project || 'Project'} • {src.week || 'Week'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            
            {askMutation.isPending && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-muted/50 border rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Analyzing team reports...
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t bg-card">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about your team..."
            className="min-h-[60px] max-h-[200px] resize-none pr-12 rounded-xl"
            disabled={askMutation.isPending}
          />
          <Button 
            size="icon" 
            aria-label="Send"
            className="absolute right-2 bottom-2 h-10 w-10 rounded-lg" 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || askMutation.isPending}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="text-center mt-2 text-[11px] text-muted-foreground">
          AI can make mistakes. Verify important information with actual reports.
        </div>
      </div>
    </div>
  );
};
