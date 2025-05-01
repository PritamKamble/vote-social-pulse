
# Social Polling Web App

A real-time social polling application built with React, TypeScript, and Supabase.

## Features

- User authentication (email/password) with Supabase Auth
- Create, read, update, and delete polls
- Real-time vote updates with Supabase Realtime
- Visualization of poll results with charts
- Mobile-responsive design

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vote-social-pulse.git
cd vote-social-pulse
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root and add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

## Database Schema

The application uses three main tables:

1. **polls** - Store poll information
   - id (UUID, PK)
   - user_id (UUID, FK to auth.users)
   - title (TEXT)
   - created_at (timestamptz, default: now())

2. **options** - Store poll options
   - id (UUID, PK)
   - poll_id (UUID, FK to polls)
   - label (TEXT)

3. **votes** - Store user votes
   - id (bigint identity, PK)
   - poll_id (UUID, FK to polls)
   - option_id (UUID, FK to options)
   - user_id (UUID, FK to auth.users)
   - created_at (timestamptz, default: now())
   - UNIQUE constraint on (poll_id, user_id)

## Row Level Security (RLS)

The following RLS policies are implemented:

- **polls**: 
  - Anyone can read all polls
  - Only authenticated poll owners can insert/update/delete their own polls

- **options**:
  - Anyone can read all options
  - Only authenticated poll owners can insert/update/delete options for their polls

- **votes**:
  - Anyone can read all votes
  - Authenticated users can insert votes (with one vote per poll restriction)
  - No one can update or delete votes

## SQL Migration

```sql
-- Create tables
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  label TEXT NOT NULL
);

CREATE TABLE public.votes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_poll_vote UNIQUE (poll_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create policies for polls
CREATE POLICY "Anyone can read polls" 
ON public.polls FOR SELECT USING (true);

CREATE POLICY "Users can create their own polls" 
ON public.polls FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own polls" 
ON public.polls FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own polls" 
ON public.polls FOR DELETE USING (auth.uid() = user_id);

-- Create policies for options
CREATE POLICY "Anyone can read options" 
ON public.options FOR SELECT USING (true);

CREATE POLICY "Poll owners can create options" 
ON public.options FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.polls 
    WHERE id = poll_id
  )
);

-- Create policies for votes
CREATE POLICY "Anyone can read votes" 
ON public.votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote once per poll" 
ON public.votes FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  NOT EXISTS (
    SELECT 1 FROM public.votes 
    WHERE poll_id = NEW.poll_id AND user_id = auth.uid()
  )
);

-- Create view for vote counts
CREATE VIEW option_votes AS
SELECT 
  o.id AS option_id,
  o.poll_id,
  o.label,
  COUNT(v.id) AS votes_count
FROM 
  public.options o
LEFT JOIN 
  public.votes v ON o.id = v.option_id
GROUP BY 
  o.id, o.poll_id, o.label;
```

## Deployment

This application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add the following environment variables in Vercel project settings:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
3. Deploy using the Vercel dashboard or CLI

## Testing

The project includes stubs for Jest unit tests and Cypress E2E tests:

- Run unit tests: `npm test`
- Run Cypress tests: `npm run cypress:open`

## License

MIT License
