import { render } from "@react-email/render";
import { Resend } from "resend";
import { PromptOpsWelcome } from "@/app/emails/promptops-welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName } = body;

    // Validate input (email required)
    if (!email || typeof email !== "string") {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Render email template to HTML
    const html = await render(
      PromptOpsWelcome({ fullName: fullName || "there" })
    );

    // Send via Resend
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Welcome to PromptOps — Start Building Better Prompts",
      html: html,
    });

    // Return success
    return Response.json(
      { success: true, messageId: data.data?.id },
      { status: 200 }
    );
  } catch (error) {
    // Log error but don't expose details to client
    console.error("Welcome email error:", error);

    // Return generic error (don't block signup)
    return Response.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
