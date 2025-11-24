import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import InfiniteMenu from '@/components/InfiniteMenu';

// Mock supabase client to return null so component falls back to local JSON
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({ select: () => ({ eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: null, error: new Error('no remote') }) }) }) }) })
  }
}));

describe('InfiniteMenu', () => {
  it('renders fallback items and can toggle open/closed', async () => {
    render(<InfiniteMenu />);

    // wait for fallback data to populate
    const imgs = await screen.findAllByRole('img', { hidden: true });
    expect(imgs.length).toBeGreaterThan(0);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // toggle closed
    fireEvent.click(button);
    // clicking toggles should not unmount images (just hide visually)
    const imgs2 = await screen.findAllByRole('img', { hidden: true });
    expect(imgs2.length).toBeGreaterThan(0);
  });
});
