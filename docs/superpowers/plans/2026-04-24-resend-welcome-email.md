# Resend + React Email Welcome Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up transactional email infrastructure with Resend to send welcome emails to new PromptOps users on OAuth sign-up.

**Architecture:** Install Resend SDK + move react-email into main app. Create `/api/send-welcome-email` endpoint that renders React template and sends via Resend. Trigger from auth callback on first sign-up detection. Unblock user signup if email fails.

**Tech Stack:** Resend (email provider), React Email (template), Next.js 15 API routes, TypeScript

---

## File Structure

**Files to create:**

- `app/emails/promptops-welcome.tsx` — React Email welcome template
- `app/api/send-welcome-email/route.ts` — POST endpoint to send emails via Resend

**Files to modify:**

- `package.json` — add resend, react-email, @react-email/render
- `app/auth/callback/page.tsx` — call email endpoint after successful login (lines 26-30)
- `.env.local` — add RESEND_API_KEY and RESEND_FROM_EMAIL

**No database changes** (using Supabase's built-in `is_first_sign_in` metadata)

---

## Task 1: Install Dependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Add dependencies to package.json**

Open `package.json` and add these to the `dependencies` object:

```json
{
  "dependencies": {
    "resend": "^4.0.0",
    "react-email": "^6.0.0",
    "@react-email/render": "^0.0.16"
  }
}
```

Make sure these are added alongside existing dependencies like `@ai-sdk/openai`, `supabase`, etc.

- [ ] **Step 2: Run npm/bun install**

```bash
bun install
```

Expected: All three packages resolve and install successfully. No conflicts or missing peer dependencies.

- [ ] **Step 3: Verify installation**

```bash
bun list resend react-email @react-email/render
```

Expected: Output shows all three packages installed.

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock
git commit -m "install: add resend, react-email, @react-email/render"
```

---

## Task 2: Create Welcome Email Template

**Files:**

- Create: `app/emails/promptops-welcome.tsx`

- [ ] **Step 1: Create emails directory**

```bash
mkdir -p app/emails
```

- [ ] **Step 2: Write the welcome template**

Create `app/emails/promptops-welcome.tsx`:

```typescript
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "react-email";

interface PromptOpsWelcomeProps {
  fullName?: string;
}

export const PromptOpsWelcome = ({ fullName = "there" }: PromptOpsWelcomeProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://promptops.app";

  return (
    <Html>
      <Head />
      <Preview>Welcome to PromptOps — Start Building Better Prompts</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>✨ PromptOps</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Text style={heading}>Welcome to PromptOps, {fullName}!</Text>
            <Text style={subheading}>
              Your AI-powered prompt engineering IDE
            </Text>
          </Section>

          {/* Features */}
          <Section style={featuresSection}>
            <Row>
              <Text style={featureTitle}>🤖 AI-Powered Prompts</Text>
              <Text style={featureDescription}>
                Generate and refine prompts with Claude AI. Get suggestions, improve structure,
                and add constraints automatically.
              </Text>
            </Row>

            <Hr style={divider} />

            <Row>
              <Text style={featureTitle}>📋 Version Control</Text>
              <Text style={featureDescription}>
                Save versions of your prompts, compare iterations, track improvements, and
                never lose a good idea.
              </Text>
            </Row>

            <Hr style={divider} />

            <Row>
              <Text style={featureTitle}>📥 One-Click Export</Text>
              <Text style={featureDescription}>
                Download prompts as Markdown, copy to clipboard, or share templates with
                your team instantly.
              </Text>
            </Row>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button
              pX={20}
              pY={12}
              style={button}
              href={`${baseUrl}/workspace`}
            >
              Create Your First Prompt
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Questions? Check out our{" "}
              <Link style={link} href={`${baseUrl}/docs`}>
                documentation
              </Link>
            </Text>
            <Text style={footerText}>
              Follow us on{" "}
              <Link style={link} href="https://twitter.com/promptopsai">
                Twitter
              </Link>{" "}
              and{" "}
              <Link style={link} href="https://github.com/promptops">
                GitHub
              </Link>
            </Text>
            <Hr style={divider} />
            <Text style={footerCopy}>
              © 2026 PromptOps. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PromptOpsWelcome;

// Styles
const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  margin: "0 auto",
  padding: "0px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  margin: "16px auto",
  maxWidth: "600px",
  padding: "40px 20px",
};

const header = {
  textAlign: "center" as const,
  paddingBottom: "24px",
  borderBottom: "1px solid #f3f4f6",
};

const logo = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0",
};

const heroSection = {
  padding: "24px 0",
  textAlign: "center" as const,
};

const heading = {
  color: "#1f2937",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 12px 0",
  lineHeight: "1.3",
};

const subheading = {
  color: "#6b7280",
  fontSize: "16px",
  margin: "0",
  lineHeight: "1.5",
};

const featuresSection = {
  padding: "24px 0",
};

const featureTitle = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
  margin: "16px 0 8px 0",
};

const featureDescription = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
  lineHeight: "1.6",
};

const divider = {
  borderColor: "#f3f4f6",
  margin: "24px 0",
};

const ctaSection = {
  padding: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  padding: "12px 20px",
};

const footerSection = {
  padding: "24px 0 0 0",
  borderTop: "1px solid #f3f4f6",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "8px 0",
  lineHeight: "1.5",
};

const link = {
  color: "#3b82f6",
  textDecoration: "underline",
};

const footerCopy = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "16px 0 0 0",
};
```

- [ ] **Step 3: Verify template renders**

```bash
# Just check for syntax errors by running TypeScript check
bun run type-check app/emails/promptops-welcome.tsx
```

Expected: No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add app/emails/promptops-welcome.tsx
git commit -m "feat: create promptops welcome email template"
```

---

## Task 3: Create Send Email API Endpoint

**Files:**

- Create: `app/api/send-welcome-email/route.ts`

- [ ] **Step 1: Create send-welcome-email directory**

```bash
mkdir -p app/api/send-welcome-email
```

- [ ] **Step 2: Write the API endpoint**

Create `app/api/send-welcome-email/route.ts`:

```typescript
import { render } from "@react-email/render";
import { Resend } from "resend";
import { PromptOpsWelcome } from "@/app/emails/promptops-welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName } = body;

    // Validate input
    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Render email template to HTML
    const html = render(PromptOpsWelcome({ fullName: fullName || "there" }));

    // Send via Resend
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Welcome to PromptOps — Start Building Better Prompts",
      html: html,
    });

    // Return success
    return Response.json(
      { success: true, messageId: data.id },
      { status: 200 },
    );
  } catch (error) {
    // Log error but don't expose details to client
    console.error("Welcome email error:", error);

    // Return generic error (don't block signup)
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
bun run type-check app/api/send-welcome-email/route.ts
```

Expected: No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/send-welcome-email/route.ts
git commit -m "feat: create send-welcome-email API endpoint"
```

---

## Task 4: Modify Auth Callback to Trigger Email

**Files:**

- Modify: `app/auth/callback/page.tsx` (lines 26-30)

- [ ] **Step 1: Read current auth callback**

Open `app/auth/callback/page.tsx` and locate the section after the session exchange (around line 26):

```typescript
supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
  if (!error && data.session?.user) {
    const u = data.session.user;
    posthog.identify(u.id, {
      email: u.email,
      provider: u.app_metadata?.provider,
    });
    posthog.capture("sign_in_completed", {
      provider: u.app_metadata?.provider,
      flow: "pkce",
    });
  }
  router.replace(error ? "/auth?error=callback_failed" : "/");
});
```

- [ ] **Step 2: Add email trigger**

Replace the callback logic with:

```typescript
supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
  if (!error && data.session?.user) {
    const u = data.session.user;
    posthog.identify(u.id, {
      email: u.email,
      provider: u.app_metadata?.provider,
    });
    posthog.capture("sign_in_completed", {
      provider: u.app_metadata?.provider,
      flow: "pkce",
    });

    // Send welcome email on first sign-up (non-blocking)
    const isNewUser = u.user_metadata?.is_first_sign_in;
    if (isNewUser) {
      fetch("/api/send-welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: u.email,
          fullName: u.user_metadata?.full_name || "there",
        }),
      }).catch((err) => console.error("Welcome email failed:", err));
    }
  }
  router.replace(error ? "/auth?error=callback_failed" : "/");
});
```

This checks `is_first_sign_in` from Supabase metadata and fires a non-blocking fetch to send the email.

- [ ] **Step 3: Verify TypeScript**

```bash
bun run type-check app/auth/callback/page.tsx
```

Expected: No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add app/auth/callback/page.tsx
git commit -m "feat: trigger welcome email on first sign-up"
```

---

## Task 5: Configure Environment Variables

**Files:**

- Modify: `.env.local`

- [ ] **Step 1: Get Resend API key**

1. Go to [resend.com](https://resend.com) and sign up (free tier)
2. In the dashboard, navigate to **API Keys**
3. Create a new API key
4. Copy the key (looks like `re_xxxxxxxxxxxxx`)

- [ ] **Step 2: Add to .env.local**

Open `.env.local` and add these two lines at the end:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

Replace `re_xxxxxxxxxxxxx` with your actual key from step 1.

**Note:** `onboarding@resend.dev` is Resend's default sender. You can upgrade to a custom domain later (e.g., `onboarding@promptops.app`).

- [ ] **Step 3: Verify env variables are loaded**

Run the dev server to check for errors:

```bash
bun dev
```

Expected: No errors about missing RESEND_API_KEY. If you see "RESEND_API_KEY is required", double-check you added it to `.env.local`.

- [ ] **Step 4: Commit .env.local (if not gitignored)**

Check if `.env.local` is in `.gitignore`:

```bash
cat .gitignore | grep env.local
```

Expected: `.env.local` should be in `.gitignore` (it contains secrets, don't commit).

If `.env.local` is ignored, **do not commit it** and the task is complete.

---

## Task 6: End-to-End Testing

**Files:**

- Test: Manual browser test (no new files)

- [ ] **Step 1: Start dev server**

```bash
bun dev
```

Expected: App runs at http://localhost:3000 with no errors about Resend.

- [ ] **Step 2: Test signup with new user**

1. Open http://localhost:3000/auth
2. Click "Sign in with Google" (or GitHub)
3. Use a test Google account (or create one) you haven't used before
4. Complete OAuth flow
5. You should be redirected to `/` (home)

**Expected behavior:**

- Login succeeds
- User is authenticated (see user menu in top-right)
- No errors in browser console

- [ ] **Step 3: Check for email (Resend dashboard)**

1. Go to https://resend.com/emails
2. You should see 1 email in the "Sent" list
3. Open the email to verify:
   - Subject: "Welcome to PromptOps — Start Building Better Prompts"
   - Body: Features listed, CTA button visible
   - "Create Your First Prompt" button links to `/workspace`

**Expected:** Email arrives within 30 seconds.

- [ ] **Step 4: Verify repeat login doesn't send email**

1. Log out (or open new incognito window)
2. Sign in again with the same account
3. Go to https://resend.com/emails
4. **Should still be 1 email** (not 2) — email only sent on first signup

Expected: No second email sent.

- [ ] **Step 5: Check PostHog tracking still works**

1. Go to PostHog dashboard
2. Find the user you just created
3. Verify `sign_in_completed` event was captured
4. Verify user properties show email and auth provider

Expected: PostHog tracking unaffected.

- [ ] **Step 6: Check browser console for errors**

1. Open DevTools (F12)
2. Go to Console tab
3. Sign up again with a new test account
4. **Should be no errors** related to `/api/send-welcome-email`

Expected: Clean console (info/debug messages OK, errors/exceptions should be none).

---

## Task 7: Final Verification & Commit

**Files:**

- None (verification only)

- [ ] **Step 1: Run type check**

```bash
bun run type-check
```

Expected: No errors in app/ directory.

- [ ] **Step 2: Check git status**

```bash
git status
```

Expected: Should show only modified/new files in:

- `package.json`
- `bun.lock`
- `app/emails/promptops-welcome.tsx` (new)
- `app/api/send-welcome-email/route.ts` (new)
- `app/auth/callback/page.tsx`

(`.env.local` should not appear if properly gitignored)

- [ ] **Step 3: Review all changes**

```bash
git diff HEAD
```

Scan the diff to ensure:

- No accidental deletions
- No debug code left in
- No hardcoded secrets in code (only env vars used)

- [ ] **Step 4: Create PR or finalize**

If on a branch, create a PR:

```bash
git push -u origin your-branch-name
```

Or if working on main, you're done. The feature is complete and tested.

- [ ] **Step 5: Mark as complete**

You've successfully:

- ✅ Installed Resend + React Email
- ✅ Created branded welcome email template
- ✅ Built API endpoint to send emails
- ✅ Wired up auth callback to trigger on first signup
- ✅ Configured environment variables
- ✅ Tested end-to-end (email arrives, repeat login doesn't resend, tracking intact)

---

## Success Criteria

- [x] Welcome email arrives within 1 minute of signup
- [x] Email is branded, readable, has clear CTA to `/workspace`
- [x] No database schema changes needed
- [x] Signup flow unblocked if email fails (non-blocking fetch)
- [x] Repeat sign-ins don't trigger email
- [x] PostHog tracking still works
- [x] Zero cost (under Resend free tier)
