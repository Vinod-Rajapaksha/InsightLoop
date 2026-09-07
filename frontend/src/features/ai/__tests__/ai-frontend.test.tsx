// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { AIChat } from '../components/AIChat';
import { useAskAI } from '../hooks/useAI';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hook
vi.mock('../hooks/useAI', () => ({
  useAskAI: vi.fn(),
  useAIStatus: vi.fn().mockReturnValue({ data: { enabled: true }, isLoading: false }),
  useWeeklySummary: vi.fn().mockReturnValue({ data: { summary: 'Test' }, isLoading: false }),
  useRiskAnalysis: vi.fn().mockReturnValue({ data: null, isLoading: false }),
  useCompareWeeks: vi.fn().mockReturnValue({ data: null, isLoading: false }),
}));

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('AI Frontend UI', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders AI Chat properly', () => {
    (useAskAI as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false
    });
    
    renderWithClient(<AIChat />);
    expect(screen.getByText('AI Assistant')).toBeDefined();
    expect(screen.getByPlaceholderText('Ask something about your team...')).toBeDefined();
  });

  it('rejects empty questions', () => {
    const mockMutate = vi.fn();
    (useAskAI as any).mockReturnValue({
      mutateAsync: mockMutate,
      isPending: false
    });
    
    renderWithClient(<AIChat />);
    
    const sendButton = screen.getByLabelText('Send'); 
    fireEvent.click(sendButton);
    
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows loading state when generating response', () => {
    (useAskAI as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true
    });
    
    renderWithClient(<AIChat initialMessages={[{id: '1', role: 'user', content: 'test'}]} />);
    expect(screen.getByText('Analyzing team reports...')).toBeDefined();
  });
});
