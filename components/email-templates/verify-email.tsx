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

const EmailVerificationEmail = ({
  verificationLink,
  userEmail,
  name,
}: {
  verificationLink: string;
  userEmail: string;
  name: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Please verify your email address</Preview>
        <Body
          className="font-sans py-[40px]"
          style={{ backgroundColor: "#ffffff" }}
        >
          <Container className="mx-auto px-[20px] py-[40px] bg-[#f6f8fa] rounded-[12px] shadow-lg max-w-[600px]">
            {/* Header Section */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 mb-[8px] leading-tight">
                Verify your email
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Click the button below to confirm your email address
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 mb-[24px] leading-relaxed">
                Hi {name},
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[24px] leading-relaxed">
                Thanks for signing up! We need to verify your email address{" "}
                <strong>{userEmail}</strong> to complete your account setup.
                Click the button below to verify your email.
              </Text>

              {/* Verification Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={verificationLink}
                  className="box-border bg-[#56756e] text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline inline-block"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] leading-relaxed">
                Or copy and paste this link into your browser:
              </Text>
              <Text className="text-[14px] text-[#56756e] mb-[24px] break-all bg-gray-50 p-[12px] rounded-[6px] border border-gray-200">
                {verificationLink}
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[16px] leading-relaxed">
                This verification link will expire in{" "}
                <strong>15 minutes</strong> for your security.
              </Text>

              <Text className="text-[14px] text-gray-600 leading-relaxed">
                If you didn't create an account with us, you can safely ignore
                this email.
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="bg-gray-50 p-[20px] rounded-[8px] mb-[32px]">
              <Text className="text-[14px] text-gray-700 mb-[8px] font-semibold">
                ✉️ Why verify your email?
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 leading-relaxed">
                Email verification helps us ensure account security and allows
                us to send you important updates about your account.
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

export default EmailVerificationEmail;
