import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "react-email";

interface PromptOpsWelcomeProps {
  fullName?: string;
}

export const PromptOpsWelcome = ({
  fullName = "there",
}: PromptOpsWelcomeProps) => {
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
                Generate and refine prompts with Claude AI. Get suggestions,
                improve structure, and add constraints automatically.
              </Text>
            </Row>

            <Hr style={divider} />

            <Row>
              <Text style={featureTitle}>📋 Version Control</Text>
              <Text style={featureDescription}>
                Save versions of your prompts, compare iterations, track
                improvements, and never lose a good idea.
              </Text>
            </Row>

            <Hr style={divider} />

            <Row>
              <Text style={featureTitle}>📥 One-Click Export</Text>
              <Text style={featureDescription}>
                Download prompts as Markdown, copy to clipboard, or share
                templates with your team instantly.
              </Text>
            </Row>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button style={button} href={`${baseUrl}/workspace`}>
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
