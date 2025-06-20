import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

const MagicLinkEmail = ({
  magicLink,
  userEmail,
}: {
  magicLink: string;
  userEmail: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Your secure sign-in link is ready</Preview>
        <Body
          className="font-sans py-[40px]"
          style={{ backgroundColor: "#ffffff" }}
        >
          <Container className="mx-auto px-[20px] py-[40px] bg-[#f6f8fa] rounded-[12px] shadow-lg max-w-[600px]">
            {/* Header Section */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 mb-[8px] leading-tight">
                Welcome back!
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Click the button below to securely sign in to your account
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 mb-[24px] leading-relaxed">
                Hi there,
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[24px] leading-relaxed">
                We received a sign-in request for your account associated with{" "}
                <strong>{userEmail}</strong>. Click the secure link below to
                access your account instantly.
              </Text>

              {/* Magic Link Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={magicLink}
                  className="box-border bg-[#56756e] text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline inline-block"
                >
                  Sign In Securely
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] leading-relaxed">
                Or copy and paste this link into your browser:
              </Text>
              <Text className="text-[14px] text-[#56756e] mb-[24px] break-all bg-gray-50 p-[12px] rounded-[6px] border border-gray-200">
                {magicLink}
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[16px] leading-relaxed">
                This link will expire in <strong>15 minutes</strong> for your
                security.
              </Text>

              <Text className="text-[14px] text-gray-600 leading-relaxed">
                If you didn't request this sign-in link, you can safely ignore
                this email. Your account remains secure.
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="bg-gray-50 p-[20px] rounded-[8px] mb-[32px]">
              <Text className="text-[14px] text-gray-700 mb-[8px] font-semibold">
                🔒 Security Notice
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 leading-relaxed">
                This is a secure, one-time sign-in link. Never share this email
                or link with others.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 text-center mb-[8px] m-0">
                Aira
              </Text>
              <Text className="text-[12px] text-gray-400 text-center m-0">
                <Link
                  href="https://airaclothing.in/privacy"
                  className="text-gray-400 no-underline"
                >
                  Privacy Policy
                </Link>
              </Text>
              <Text className="text-[12px] text-gray-400 text-center m-0">
                © {new Date().getFullYear()} Aira. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MagicLinkEmail;
