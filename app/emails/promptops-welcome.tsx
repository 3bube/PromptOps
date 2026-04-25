import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";
import { PromptOpsFonts } from "./fonts";
import { promptOpsTailwindConfig } from "./theme";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://promptops.tech";

interface PromptOpsWelcomeProps {
  fullName?: string;
}

export const PromptOpsWelcome = ({
  fullName = "there",
}: PromptOpsWelcomeProps) => {
  return (
    <Tailwind config={promptOpsTailwindConfig}>
      <Html>
        <Head>
          <PromptOpsFonts />
        </Head>
        <Body className="bg-canvas font-14 font-inter text-fg m-0 p-0">
          <Preview>
            Welcome to PromptOps — Start Building Better Prompts
          </Preview>
          <Container className="mx-auto max-w-[640px] px-4 pt-16 pb-6">
            <Section className="rounded-[8px] shadow-collage-card">
              <Section className="bg-bg border-stroke rounded-[8px] border">
                <Section className="mobile:px-6! px-10 pb-14 pt-16">
                  <Img
                    src={
                      "https://ik.imagekit.io/ju9lgpv3q/image%201%20(Traced)%20(1).svg"
                    }
                    alt="PromptOps"
                    width={40}
                    height={40}
                    className="block border-none mb-4"
                  />
                  <Text className="font-48 text-fg m-0 font-inter">
                    Welcome to PromptOps
                  </Text>
                  <Section
                    align="left"
                    className="mt-[18px] w-full max-w-[480px] text-left"
                  >
                    <Text className="font-14 font-inter text-fg-2 m-0">
                      Hi {fullName},
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      We're building the prompt engineering IDE that your team
                      deserves. With PromptOps, you get AI-powered prompt
                      generation, version control for your prompts, and
                      one-click exports—all in one intuitive workspace.
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      Whether you're iterating on a single prompt or managing
                      dozens across your team, PromptOps makes it frictionless.
                      Generate prompts with Claude AI, save unlimited versions,
                      compare iterations, and share templates instantly.
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      Get started now and build better prompts, faster.
                    </Text>
                    <Text className="font-14 font-inter text-fg m-0 mt-[18px]">
                      <Link
                        href={`${baseUrl}/workspace`}
                        className="text-fg underline"
                      >
                        Create your first prompt
                      </Link>
                    </Text>
                  </Section>
                </Section>

                <Section className="border-stroke border-t px-10 py-16">
                  <Text className="font-13 font-inter text-fg-3 m-0 max-w-[320px]">
                    PromptOps is the workspace where your team keeps prompts,
                    versions, and exports together—from first draft to
                    production.
                  </Text>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

PromptOpsWelcome.PreviewProps = {
  fullName: "there",
} satisfies PromptOpsWelcomeProps;

export default PromptOpsWelcome;
