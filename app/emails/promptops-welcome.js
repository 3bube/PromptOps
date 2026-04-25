import { Body, Button, Container, Head, Hr, Html, Link, Preview, Row, Section, Text, } from "react-email";
export const PromptOpsWelcome = ({ fullName = "there" }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://promptops.app";
    return (React.createElement(Html, null,
        React.createElement(Head, null),
        React.createElement(Preview, null, "Welcome to PromptOps \u2014 Start Building Better Prompts"),
        React.createElement(Body, { style: main },
            React.createElement(Container, { style: container },
                React.createElement(Section, { style: header },
                    React.createElement(Text, { style: logo }, "\u2728 PromptOps")),
                React.createElement(Section, { style: heroSection },
                    React.createElement(Text, { style: heading },
                        "Welcome to PromptOps, ",
                        fullName,
                        "!"),
                    React.createElement(Text, { style: subheading }, "Your AI-powered prompt engineering IDE")),
                React.createElement(Section, { style: featuresSection },
                    React.createElement(Row, null,
                        React.createElement(Text, { style: featureTitle }, "\uD83E\uDD16 AI-Powered Prompts"),
                        React.createElement(Text, { style: featureDescription }, "Generate and refine prompts with Claude AI. Get suggestions, improve structure, and add constraints automatically.")),
                    React.createElement(Hr, { style: divider }),
                    React.createElement(Row, null,
                        React.createElement(Text, { style: featureTitle }, "\uD83D\uDCCB Version Control"),
                        React.createElement(Text, { style: featureDescription }, "Save versions of your prompts, compare iterations, track improvements, and never lose a good idea.")),
                    React.createElement(Hr, { style: divider }),
                    React.createElement(Row, null,
                        React.createElement(Text, { style: featureTitle }, "\uD83D\uDCE5 One-Click Export"),
                        React.createElement(Text, { style: featureDescription }, "Download prompts as Markdown, copy to clipboard, or share templates with your team instantly."))),
                React.createElement(Section, { style: ctaSection },
                    React.createElement(Button, { pX: 20, pY: 12, style: button, href: `${baseUrl}/workspace` }, "Create Your First Prompt")),
                React.createElement(Section, { style: footerSection },
                    React.createElement(Text, { style: footerText },
                        "Questions? Check out our",
                        " ",
                        React.createElement(Link, { style: link, href: `${baseUrl}/docs` }, "documentation")),
                    React.createElement(Text, { style: footerText },
                        "Follow us on",
                        " ",
                        React.createElement(Link, { style: link, href: "https://twitter.com/promptopsai" }, "Twitter"),
                        " ",
                        "and",
                        " ",
                        React.createElement(Link, { style: link, href: "https://github.com/promptops" }, "GitHub")),
                    React.createElement(Hr, { style: divider }),
                    React.createElement(Text, { style: footerCopy }, "\u00A9 2026 PromptOps. All rights reserved."))))));
};
export default PromptOpsWelcome;
// Styles
const main = {
    backgroundColor: "#f9fafb",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
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
    textAlign: "center",
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
    textAlign: "center",
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
    textAlign: "center",
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
    textAlign: "center",
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
