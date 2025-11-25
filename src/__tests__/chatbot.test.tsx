import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chatbot } from '@/components/Chatbot';
import { vi } from 'vitest';

vi.mock('@/integrations/supabase/client', async () => {
  const supabase = {
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: { success: true, reply: 'Hello there!' } })),
    },
  } as any;
  return { supabase };
});

describe('Chatbot', () => {
  it('sends message and receives reply', async () => {
    render(<Chatbot />);
    // Type into input
    const input = screen.getByPlaceholderText(/Ask anything/i);
    await userEvent.type(input, 'Hi');
    // Click send
    const sendBtn = screen.getByRole('button');
    await userEvent.click(sendBtn);
    // Await reply
    const reply = await screen.findByText(/Hello there!/i);
    expect(reply).toBeInTheDocument();
  });
});
