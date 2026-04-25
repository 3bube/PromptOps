"use client";

import Link from "next/link";
import { WordmarkIcon } from "@/components/ui/header-2";

const LAST_UPDATED = "April 24, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#09090b]">
      <main className="max-w-3xl mx-auto px-6 sm:px-8 pt-16 pb-24">
        <div className="mb-12">
          <p className="text-sm text-[#a1a1aa] mb-2">
            Last updated: {LAST_UPDATED}
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-[#71717a] text-lg leading-relaxed">
            By using PromptOps, you agree to these terms. Please read them
            carefully.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-[#3f3f46]">
          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using PromptOps ("the Service"), you agree to be
              bound by these Terms of Service. If you do not agree, do not use
              the Service. We may update these terms at any time — continued use
              after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              2. Description of Service
            </h2>
            <p>
              PromptOps is an AI prompt engineering platform that helps users
              create, structure, test, and manage prompts for large language
              models. The Service includes a workspace, template library,
              version history, and prompt testing tools.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              3. Account Registration
            </h2>
            <p>
              You must create an account to use most features of the Service.
              You are responsible for maintaining the confidentiality of your
              credentials and for all activity that occurs under your account.
              You must provide accurate and complete information during
              registration.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              4. Acceptable Use
            </h2>
            <p className="mb-3">You agree not to use the Service to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Generate content that is illegal, harmful, abusive, or violates
                the rights of others
              </li>
              <li>
                Attempt to reverse-engineer, scrape, or extract data from the
                Service in an unauthorized manner
              </li>
              <li>
                Circumvent usage limits or access controls through technical
                means
              </li>
              <li>
                Resell or redistribute access to the Service without written
                permission
              </li>
              <li>Use the Service to train competing AI models or products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              5. Subscriptions and Billing
            </h2>
            <p className="mb-3">
              PromptOps offers a free tier and paid subscription plans (Pro and
              Unlimited). Paid plans are billed monthly through our payment
              processor, Polar. By subscribing, you authorize us to charge your
              payment method on a recurring basis.
            </p>
            <p>
              You may cancel your subscription at any time. Cancellation takes
              effect at the end of your current billing period — no partial
              refunds are issued. We reserve the right to modify pricing with
              reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              6. Usage Limits
            </h2>
            <p>
              Each plan includes a monthly generation limit (Free: 5, Pro: 500,
              Unlimited: no limit). Limits reset at the start of each calendar
              month. Unused generations do not carry over. If you exceed your
              plan's limit, you will be prompted to upgrade.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              7. Intellectual Property
            </h2>
            <p className="mb-3">
              You retain ownership of the prompts and content you create using
              the Service. By using the Service, you grant us a limited,
              non-exclusive license to process your content solely to provide
              the Service to you.
            </p>
            <p>
              The PromptOps platform, including its design, code, and branding,
              is owned by us and protected by intellectual property laws. You
              may not copy or reproduce any part of the Service without
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              8. AI-Generated Content
            </h2>
            <p>
              The Service uses third-party AI models (including OpenAI) to
              generate content. AI output is provided "as is." We do not
              guarantee accuracy, completeness, or fitness for any particular
              purpose. You are solely responsible for reviewing and using
              AI-generated content appropriately.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              9. Privacy
            </h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <Link
                href="/privacy"
                className="text-[#7c5cfc] underline underline-offset-2 hover:opacity-80"
              >
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              10. Disclaimers
            </h2>
            <p>
              The Service is provided "as is" and "as available" without
              warranties of any kind. We do not warrant that the Service will be
              uninterrupted, error-free, or free from harmful components. To the
              fullest extent permitted by law, we disclaim all implied
              warranties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              11. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, PromptOps shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the Service, even if we
              have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              12. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account at any
              time for violation of these Terms or for any other reason at our
              discretion. You may also delete your account at any time. Upon
              termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#09090b] mb-3">
              13. Contact
            </h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a
                href="mailto:ugbore2@gmail.com"
                className="text-[#7c5cfc] underline underline-offset-2 hover:opacity-80"
              >
                ugbore2@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
