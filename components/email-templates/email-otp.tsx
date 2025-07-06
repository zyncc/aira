import * as React from "react";
import {
  Body,
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
  otpCode,
  userEmail,
}: {
  otpCode: string;
  userEmail: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Your verification code is {otpCode}</Preview>
        <Body
          className="font-sans py-[40px]"
          style={{ backgroundColor: "#f3efec" }}
        >
          <Container className="mx-auto px-[20px] py-[40px] bg-white rounded-[12px] shadow-lg max-w-[600px]">
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 mb-[8px] leading-tight">
                Verify your email
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Enter the code below to confirm your email address
              </Text>
            </Section>
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 mb-[24px] leading-relaxed">
                Hi there,
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[24px] leading-relaxed">
                Thanks for signing up! We need to verify your email address{" "}
                <strong>{userEmail}</strong> to complete your account setup.
                Enter the verification code below in the app.
              </Text>

              {/* OTP Code Display */}
              <Section className="text-center mb-[32px]">
                <Text className="text-[14px] text-gray-600 mb-[16px]">
                  Your verification code is:
                </Text>
                <Section className="flex items-center justify-center gap-x-3">
                  {otpCode.split("").map((digit) => (
                    <Text
                      key={digit}
                      className="text-[36px] font-bold text-[#56756e] bg-gray-50 px-[24px] py-[16px] rounded-[8px] border border-gray-200 tracking-[8px] inline-block"
                    >
                      {digit}
                    </Text>
                  ))}
                </Section>
              </Section>
              <Text className="text-[16px] text-gray-700 mb-[16px] leading-relaxed">
                This verification code will expire in{" "}
                <strong>15 minutes</strong> for your security.
              </Text>
              <Text className="text-[14px] text-gray-600 leading-relaxed">
                If you didn't create an account with us, you can safely ignore
                this email.
              </Text>
            </Section>
            <Section className="bg-gray-50 p-[20px] rounded-[8px] mb-[32px]">
              <Text className="text-[14px] text-gray-700 mb-[8px] font-semibold">
                🔒 Security Notice
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 leading-relaxed">
                Never share this verification code with anyone. Our team will
                never ask you for this code over phone or email.
              </Text>
            </Section>
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
