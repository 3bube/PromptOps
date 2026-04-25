<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your PromptOps Next.js App Router application. Here's a summary of all changes made:

**Infrastructure files created:**
- `instrumentation-client.ts` — Initializes PostHog client-side via Next.js instrumentation, with reverse-proxy support, exception capture, and debug mode in development.
- `lib/posthog-server.ts` — Singleton PostHog Node client for server-side event capture in API routes.
- `next.config.ts` — Updated with `/ingest/*` rewrites to proxy PostHog requests through your own domain (reduces ad-blocker interference).

**Environment variables set** in `.env.local`:
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- `NEXT_PUBLIC_POSTHOG_HOST`

**Packages installed:** `posthog-js`, `posthog-node`

---

## Events instrumented

| Event | Description | File |
|---|---|---|
| `sign_in_clicked` | User clicks Google or GitHub sign-in button | `app/auth/page.tsx` |
| `sign_in_completed` | OAuth callback succeeds; user identified with `posthog.identify` | `app/auth/callback/page.tsx` |
| `prompt_created` | User submits a description and a new workspace prompt is created | `app/workspace/components/WorkspaceClient.tsx` |
| `prompt_deleted` | User deletes a prompt from the workspace dashboard | `app/workspace/components/WorkspaceClient.tsx` |
| `prompt_generation_started` | AI block generation begins for a workspace prompt | `app/workspace/[id]/hooks/useGenerateBlocks.ts` |
| `prompt_generation_completed` | AI block generation finishes successfully | `app/workspace/[id]/hooks/useGenerateBlocks.ts` |
| `version_saved` | User manually saves a version snapshot of their prompt | `app/workspace/[id]/components/WorkspaceSidebar.tsx` |
| `version_restored` | User restores a previous version of their prompt | `app/workspace/[id]/components/WorkspaceSidebar.tsx` |
| `prompt_exported` | User exports the prompt as a Markdown file | `app/workspace/[id]/page.tsx` |
| `assistant_message_sent` | User sends a message to the Prompt Assistant | `app/workspace/[id]/components/AssistantPanel.tsx` |
| `prompt_test_run` | User runs a test against their compiled prompt | `app/workspace/[id]/components/TestPanel.tsx` |
| `upgrade_clicked` | User clicks an upgrade button on the pricing page | `app/pricing/page.tsx` |
| `subscription_activated` | Server-side: Polar webhook confirms a subscription is active | `app/api/polar/webhook/route.ts` |
| `subscription_canceled` | Server-side: Polar webhook confirms a subscription is canceled or revoked | `app/api/polar/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/395794/dashboard/1506548
- **Sign-in to Prompt Creation Funnel:** https://us.posthog.com/project/395794/insights/XWcYw4Sd
- **Daily Prompt Creations:** https://us.posthog.com/project/395794/insights/19CS6JkM
- **Upgrade Funnel:** https://us.posthog.com/project/395794/insights/vAdfm2Or
- **Workspace Engagement Trends:** https://us.posthog.com/project/395794/insights/EhkVtngM
- **Subscriptions Activated vs Canceled:** https://us.posthog.com/project/395794/insights/I57KPVTh

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
