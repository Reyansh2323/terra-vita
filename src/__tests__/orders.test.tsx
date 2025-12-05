import React from 'react';
import { render, screen } from '@testing-library/react';
import Orders from '@/pages/Orders';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('@/integrations/supabase/client', async () => {
  const supabase = {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: { user: { id: 'user-123' } } } })),
    },
    from: vi.fn(() => ({ select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [
          { id: 'order-1', buyer_id: 'user-123', price: 42.99, status: 'pending', tracking_notes: 'Order No: 12345 - ETA: 2 days' }
        ], error: null }))
      }))
    })) })),
  } as any;
  return { supabase };
});

describe('Orders page', () => {
  it('renders previous orders when logged in', async () => {
    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    const title = await screen.findByText(/Previous Orders/i);
    expect(title).toBeInTheDocument();

    const orderLines = await screen.findAllByText(/Order No: 12345/i);
    expect(orderLines.length).toBeGreaterThan(0);
  });
});
