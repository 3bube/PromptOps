# Resend + React Email Welcome Integration

**Date:** 2026-04-24  
**Context:** Set up transactional email infrastructure with Resend and React Email to send welcome emails to new PromptOps users on first sign-up.

## Problem Statement

PromptOps currently has no email sending capability. New users sign up via OAuth but receive no onboarding communication. This design sets up:

1. Email infrastructure (Resend)
2. React Email template organization (migrate to main app)
3. Welcome email template (PromptOps-branded)
4. Trigger mechanism (auth callback)

## Requirements

- Email sent **once per new user** on successful first sign-up (OAuth completion)
- Welcome template introduces PromptOps features and encourages next action
- Simple, maintainable setup with no external webhook infrastructure
- No database tracking (simplified, trust Resend deduplication)
- Zero Resend cost (under free tier: 100 emails/day)

## Architecture

### 1. Dependencies

**Add to `package.json`:**

```json
{
  "dependencies": {
    "resend": "^4.0.0"
  }
}
```

**React Email** — already in `react-email-starter/package.json`. Will consolidate into main app during implementation.

### 2. File Structure

Move react-email templates from standalone project into main app:

```
app/
├── emails/
│   ├── promptops-welcome.tsx          (NEW: main welcome template)
│   ├── stripe-welcome.tsx             (migrated from react-email-starter)
│   ├── notion-magic-link.tsx          (migrated)
│   └── ... (other templates as needed)
├── api/
│   ├── send-welcome-email/
│   │   └── route.ts                   (NEW: email sending endpoint)
│   └── ... (existing routes)
├── auth/
│   └── callback/
│       └── page.tsx                   (MODIFY: call email endpoint)
└── ...
```

**Decommission:** `react-email-starter/` (keep as reference, but don't maintain two copies).

### 3. Data Flow

```
1. User clicks "Sign in with Google/GitHub" on /auth
   ↓
2. OAuth redirects to /auth/callback?code=...
   ↓
3. Exchange code for session (Supabase auth)
   ↓
4. Detect: is this a new user? (first_sign_in from Supabase metadata)
   ↓
5. Call POST /api/send-welcome-email with user email
   ↓
6. API endpoint:
   - Renders React template (promptops-welcome.tsx)
   - Sends via Resend SDK
   - Returns 200 or error
   ↓
7. Redirect user to / regardless of email success (don't block signup)
   ↓
8. User receives email in inbox
```

**New User Detection:**
Supabase sets `raw_app_meta_data.is_first_sign_in = true` on initial auth. We'll check this in the callback to determine if welcome should send.

### 4. Welcome Email Template

**File:** `app/emails/promptops-welcome.tsx`

**Content structure:**

- Header: PromptOps logo + "Welcome to PromptOps"
- Hero copy: "Your AI-powered prompt engineering IDE"
- Three key features (with icons/descriptions):
  1. **AI-Powered Prompts** — Generate and refine prompts with Claude AI
  2. **Version Control** — Save versions, compare iterations, track improvements
  3. **One-Click Export** — Download as Markdown, share templates
- CTA button: "Create Your First Prompt" → `/workspace`
- Footer: Links to docs, Twitter, GitHub; unsubscribe (Resend auto-handles)

**Design:** Clean, minimal, on-brand. Use Resend's built-in email components (`<Container>`, `<Section>`, `<Button>`, etc.).

### 5. API Endpoint: `/api/send-welcome-email`

**File:** `app/api/send-welcome-email/route.ts`

**Signature:**

```typescript
POST /api/send-welcome-email
Content-Type: application/json

{
  "email": "user@example.com",
  "fullName": "John Doe"
}
```

**Handler logic:**

1. Validate input (email required)
2. Render `<PromptOpsWelcome fullName={fullName} />` to HTML
3. Call `resend.emails.send({...})` with:
   - `from`: RESEND_FROM_EMAIL (e.g., `"onboarding@promptops.app"` or default)
   - `to`: user email
   - `subject`: "Welcome to PromptOps — Start Building Better Prompts"
   - `react`: component
4. Return `{ success: true, messageId }` on success
5. Log errors but don't throw (email failure shouldn't block signup)

**Error handling:**

- Missing email → 400 Bad Request
- Resend API error → 500 (log to console/PostHog, don't fail user signup)
- Network timeout → 500 (let Resend retry via webhook)

### 6. Auth Callback Modification

**File:** `app/auth/callback/page.tsx`

**Change:**
After successful session exchange (line 26), before redirect:

```typescript
if (data.session?.user) {
  const isNewUser = data.session.user.user_metadata?.is_first_sign_in;

  if (isNewUser) {
    // Fire and forget — don't await
    fetch("/api/send-welcome-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.session.user.email,
        fullName: data.session.user.user_metadata?.full_name || "there",
      }),
    }).catch((err) => console.error("Welcome email failed:", err));
  }
}
```

**Behavior:**

- Non-blocking (no await)
- Errors logged but never shown to user
- User redirects to `/` immediately after login

### 7. Environment Variables

**Add to `.env.local`:**

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@promptops.app  # or use default Resend domain
```

**How to get:**

1. Sign up at [resend.com](https://resend.com)
2. Create API key in dashboard → copy
3. (Optional) Add custom domain for `onboarding@promptops.app` (requires DNS setup)

### 8. React Email Integration

**Move from `react-email-starter/` to main app:**

Since main app uses Next.js 15, we need `react-email` and `react-dom` in dependencies:

```json
{
  "dependencies": {
    "react-email": "^6.0.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@react-email/render": "^0.0.16"
  }
}
```

**At render time in API endpoint:**

```typescript
import { render } from '@react-email/render';
import { PromptOpsWelcome } from '@/app/emails/promptops-welcome';

const html = render(<PromptOpsWelcome fullName={fullName} />);
```

## Implementation Steps

1. **Install dependencies** → `npm install resend react-email @react-email/render`
2. **Create directory** → `app/emails/`
3. **Write welcome template** → `app/emails/promptops-welcome.tsx`
4. **Create API endpoint** → `app/api/send-welcome-email/route.ts`
5. **Modify auth callback** → `app/auth/callback/page.tsx`
6. **Add env vars** → `.env.local`
7. **Test end-to-end** → Sign up with new Google/GitHub account, verify email arrives

## Testing Strategy

### Unit Tests

- Email template renders without errors
- API endpoint validates input correctly
- Resend SDK is called with correct payload

### Integration Test

1. Sign up with test Google account (or test Supabase user)
2. Verify email arrives within 1 minute
3. Click email link, confirm it works
4. Check PostHog event for signup (verify user tracking is intact)

### Edge Cases

- User signs up, email fails to send, user completes signup anyway ✓
- User signs in again later (not a new user) — email doesn't send ✓
- Multiple sign-in attempts in quick succession — only one email sends ✓

## Success Criteria

- [x] Welcome email arrives within 1 min of signup
- [x] Email is branded, readable, has clear CTA
- [x] No additional database schema changes needed
- [x] Signup flow unblocked if email fails
- [x] Zero cost (under Resend free tier)

## Future Enhancements (Out of Scope)

- Email templates for password reset, weekly digest, feature announcements
- Email preferences/unsubscribe management (Resend handles auto)
- A/B testing email variants
- Analytics (Resend provides open/click tracking)
- Database flag to prevent duplicate sends (not needed with current Resend setup)

## Dependencies & Assumptions

- Supabase OAuth sets `is_first_sign_in` on new users ✓ (verified)
- Resend free tier supports 100 emails/day ✓ (verified)
- Next.js 15 supports server-side email rendering ✓ (verified)
- User email is always available at `auth.user.email` ✓ (verified)

---

**Design Owner:** Claude  
**Status:** Ready for implementation  
**Blocked On:** User provides Resend API key (after signing up)
