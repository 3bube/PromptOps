"use client";

import Link from "next/link";
import { WordmarkIcon } from "@/components/ui/header-2";

const LAST_UPDATED = "April 24, 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#09090b]">
      <main className="max-w-3xl mx-auto px-6 sm:px-8 pt-16 pb-24">
        <div className="mb-12">
          <p className="text-sm text-[#a1a1aa] mb-2">
            Last updated: {LAST_UPDATED}
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#71717a] text-lg leading-relaxed">
            We respect your privacy. This policy explains what data we collect,
            how we use it, and the choices you have.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-[#3f3f46]">
          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-3">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-[#09090b]">Account information</strong>{" "}
                — your email address and name when you sign up
              </li>
              <li>
                <strong className="text-[#09090b]">Usage data</strong> — prompts
                you create, workspaces, blocks, variables, and version history
              </li>
              <li>
                <strong className="text-[#09090b]">Billing data</strong> —
                subscription tier and payment status (payment details are
                handled by Polar and never stored by us)
              </li>
              <li>
                <strong className="text-[#09090b]">Analytics</strong> — product
                usage events (e.g. prompts generated, features used) via PostHog
              </li>
              <li>
                <strong className="text-[#09090b]">Technical data</strong> —
                browser type, device type, IP address, and error logs
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              2. How We Use Your Information
            </h2>
            <p className="mb-3">We use the data we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide, operate, and improve the Service</li>
              <li>Enforce usage limits and manage your subscription plan</li>
              <li>
                Send transactional emails (e.g. account confirmation, billing
                receipts)
              </li>
              <li>
                Analyze product usage to understand how people use PromptOps and
                improve it
              </li>
              <li>
                Detect and prevent abuse, fraud, or violations of our Terms
              </li>
            </ul>
            <p className="mt-3">
              We do not sell your personal data to third parties. We do not use
              your prompts to train AI models.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              3. Third-Party Services
            </h2>
            <p className="mb-3">
              We use the following third-party services to operate PromptOps:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-[#09090b]">Supabase</strong> —
                authentication and database hosting
              </li>
              <li>
                <strong className="text-[#09090b]">OpenAI</strong> — AI model
                provider for prompt generation and testing
              </li>
              <li>
                <strong className="text-[#09090b]">Polar</strong> — subscription
                billing and payment processing
              </li>
              <li>
                <strong className="text-[#09090b]">PostHog</strong> — product
                analytics (self-hosted or cloud)
              </li>
              <li>
                <strong className="text-[#09090b]">Vercel</strong> — application
                hosting and edge infrastructure
              </li>
            </ul>
            <p className="mt-3">
              Each of these providers has their own privacy policy and data
              handling practices. We only share data with them to the extent
              necessary to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              4. Data Retention
            </h2>
            <p>
              We retain your account and prompt data for as long as your account
              is active. If you delete your account, we will delete your
              personal data within 30 days, except where retention is required
              by law or for legitimate business purposes (e.g. billing records).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              5. Cookies and Tracking
            </h2>
            <p>
              We use cookies and local storage to maintain your session and
              authentication state. We also use analytics cookies via PostHog to
              understand product usage. You can opt out of analytics tracking by
              adjusting your browser settings or contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              6. Your Rights
            </h2>
            <p className="mb-3">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data ("right to be forgotten")</li>
              <li>Object to or restrict certain processing of your data</li>
              <li>Export your data in a machine-readable format</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:ugbore2@gmail.com"
                className="text-[#7c5cfc] underline underline-offset-2 hover:opacity-80"
              >
                ugbore2@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              7. Security
            </h2>
            <p>
              We take reasonable technical and organizational measures to
              protect your data, including encrypted connections (HTTPS),
              row-level security in our database, and restricted access to
              production systems. No method of transmission over the internet is
              100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              8. Children's Privacy
            </h2>
            <p>
              PromptOps is not directed to children under the age of 13. We do
              not knowingly collect personal information from children. If you
              believe a child has provided us with personal data, please contact
              us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by updating the "Last updated" date
              at the top of this page. Continued use of the Service after
              changes take effect constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              10. Contact
            </h2>
            <p>
              If you have questions about this Privacy Policy or how we handle
              your data, contact us at{" "}
              <a
                href="mailto:ugbore2@gmail.com"
                className="text-[#7c5cfc] underline underline-offset-2 hover:opacity-80"
              >
                ugbore2@gmail.com
              </a>
              . You can also review our{" "}
              <Link
                href="/terms"
                className="text-[#7c5cfc] underline underline-offset-2 hover:opacity-80"
              >
                Terms of Service
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
