# PromptOps Gemini + Supabase Setup Guide

## ✅ Completed

- [x] API route for Gemini streaming (`app/api/generate-prompt/route.ts`)
- [x] Server Action for saving prompt history (`app/actions/savePromptHistory.ts`)
- [x] Token cost utilities (`lib/tokenUtils.ts`)
- [x] Updated frontend with real API integration (`app/page.tsx`)
- [x] Updated OutputSection with token metadata display
- [x] Supabase schema migrations created in `supabase/migrations/`

## 🔧 Next Steps: Database Setup

### 1. Apply Supabase Migrations

Your Supabase SQL migrations are ready at:

- `supabase/migrations/001_create_prompts_table.sql` – Main prompts table with RLS
- `supabase/migrations/002_create_token_usage_daily_table.sql` – Daily token aggregation

**To apply these:**

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Create new queries and paste the contents of both migration files into separate queries
4. Execute each query (the RLS policies are included)

**Or use Supabase CLI if installed:**

```bash
supabase migration up
```

### 2. Verify RLS Policies

After running migrations, verify in Supabase SQL Editor:

```sql
-- Check prompts table RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies
WHERE tablename IN ('prompts', 'token_usage_daily');
```

Expected output: 8 policies (4 per table: SELECT, INSERT, UPDATE, DELETE)

### 3. (Optional) Service Role Key

The Server Action uses the **publishable key** by default, which respects RLS. If you want the admin to bypass RLS (not recommended for production), you can optionally add your service role key to `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Get it from:** Supabase → Project Settings → API → Service Role Key (Keep this secret!)

## 🧪 Testing

### Test 1: Verify Environment

```bash
echo "Checking environment variables..."
grep -E "GEMINI_|NEXT_PUBLIC_SUPABASE" .env
```

Expected: All 4 vars present with values

### Test 2: Start Dev Server

```bash
bun run dev
```

Visit http://localhost:3000

### Test 3: Test API Endpoint (if not authenticated, will error as expected)

```bash
curl -X POST http://localhost:3000/api/generate-prompt \
  -H "Content-Type: application/json" \
  -d '{
    "category": "coding",
    "tone": "professional",
    "input": "How to write a React hook?"
  }'
```

You should see SSE stream of JSON chunks with token metadata at the end.

### Test 4: Full User Flow

1. Go to http://localhost:3000
2. Click "Auth" and sign in with an email (magic link)
3. Enter a prompt request (e.g., "Write a TypeScript function for sorting")
4. Select category + tone
5. Click "Generate & Run"
6. Watch real-time streaming response
7. Observe token counts and cost calculation
8. Close browser dev tools, check Supabase SQL Editor:

```sql
SELECT user_id, category, input_tokens, output_tokens, total_cost
FROM prompts
ORDER BY created_at DESC
LIMIT 1;
```

Expected: 1 row with your user's data and accurate token counts

## ⚙️ Environment Variables

**Already configured:**

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- ✅ `GEMINI_API_KEY` (server-only, safe)
- ✅ `GEMINI_MODEL` = `gemini-1.5-pro`

**Optional (for admin RLS bypass):**

- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` – Add to `.env.local` if needed

## 📊 Database Schema Overview

### `prompts` table

- Stores individual prompt generations
- Tracks tokens and cost per request
- User-bound via RLS (users see only their data)
- Indexed on: `user_id`, `created_at`, `category`

### `token_usage_daily` table

- Aggregates daily token usage per user
- One row per user per day (UNIQUE constraint)
- Tracks total cost for daily budgeting
- Useful for cost tracking dashboard later

## 💰 Cost Tracking

Prices hardcoded for **Gemini 1.5 Pro**:

- Input: $0.075/MTok = $0.00005/token
- Output: $0.30/MTok = $0.000075/token

Formula: `cost = (inputTokens × 0.00005) + (outputTokens × 0.000075)`

Each generation stores:

- Exact token counts in `prompts` table
- Daily aggregates in `token_usage_daily` table
- Full audit trail for cost visibility

## 🚀 Deployment to Vercel

When ready to deploy:

```bash
bun run build      # Verify build succeeds
git add .
git commit -m "Add Gemini AI + Supabase integration"
git push
```

Vercel will auto-deploy. Ensure environment variables are set in Vercel project settings:

- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional)

## ⚠️ Important Notes

1. **RLS is enforced**: Users can only access their own prompts
2. **Streaming is real-time**: Tokens display as they arrive
3. **Cost calculated instantly**: Displayed immediately after generation
4. **Auth required** to save history (unauthenticated requests still call API but won't save)
5. **Service role key** not needed unless you want to bypass RLS (not recommended)

---

**Next Phase:** After verifying this works, you can add:

- Prompt history browser
- Daily/monthly cost dashboard
- Export as PDF
- Template variables
- A/B testing comparisons
