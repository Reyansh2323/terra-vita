# Terra Vitta Swapper

Local development setup and recent UI/UX feature additions.

## Development

1. Install dependencies

```bash
npm install
```

2. Environment variables

Create a `.env` or `.env.local` file with the following keys:
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

Also set the `GEMINI_API_KEY` securely as a Supabase Function environment variable for the `chat` function — do not store it in source. This will enable the chat edge function to call the Gemini API.

3. Run dev server

```bash
npm run dev
```

4. Tests

```bash
npm test
```

## Recent UI & Backend Enhancements

- Split text animated title component (`src/components/SplitTitle.tsx`) used across the landing and buyer dashboard hero.
- Floating translucent AI chat CTA (`src/components/AIChatButton.tsx`) — now opens a persistent chat panel anchored bottom-right.
- Chatbot reliability: client now uses `supabase.functions.invoke('chat')` with retry/backoff; server reads Gemini key from environment variables.
- Checkout now persists orders in Supabase (`orders` table) using the authenticated user ID and displays an order confirmation dialog with ETA and order number.
- Orders page (`/orders`) lists previous orders for a logged-in user.
- Account menu added to headers (`src/components/AccountMenu.tsx`) with links to Orders & Account settings.
- UI animations & polish: `pop-in`, `split-letter`, `btn-glow`, and other utilities added to `src/index.css` and used on hero, cards, and CTAs.
- Light-mode glass theme fixes and logo usage unified to use local assets from `public/`.

## Notes & Limitations
- Orders are stored in the database by user ID. If a user clears their browser data and is not logged in, their session cannot be re-associated without logging in again; however orders remain stored on the server while tied to the user in Supabase.
- The `GEMINI_API_KEY` (LLM API) must be set securely in the Supabase environment to avoid exposing secrets in source control.
a
