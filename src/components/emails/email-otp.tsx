import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const EmailVerification = ({
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
        <Body className="py-[40px] font-sans" style={{ backgroundColor: "#f3efec" }}>
          <Container className="mx-auto max-w-[600px] rounded-[12px] bg-white px-[20px] py-[40px] shadow-lg">
            {/* Header Section */}
            <Section className="mb-[32px] text-center">
              <Heading className="mb-[8px] text-[28px] leading-tight font-bold text-gray-900">
                Verify your email
              </Heading>
              <Text className="m-0 text-[16px] text-gray-600">
                Enter the code below to confirm your email address
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="mb-[24px] text-[16px] leading-relaxed text-gray-700">
                Hi there,
              </Text>
              <Text className="mb-[24px] text-[16px] leading-relaxed text-gray-700">
                Thanks for signing up! We need to verify your email address{" "}
                <strong>{userEmail}</strong> to complete your account setup. Enter the
                verification code below in the app.
              </Text>

              {/* OTP Code Display */}
              <Section className="mb-[32px] text-center">
                <Text className="mb-[16px] text-[14px] text-gray-600">
                  Your verification code is:
                </Text>
                <Text className="inline-block rounded-[8px] border border-gray-200 bg-gray-50 px-[24px] py-[16px] text-[36px] font-bold tracking-[8px] text-[#56756e]">
                  {otpCode}
                </Text>
              </Section>

              <Text className="mb-[16px] text-[16px] leading-relaxed text-gray-700">
                This verification code will expire in <strong>10 minutes</strong> for your
                security.
              </Text>

              <Text className="text-[14px] leading-relaxed text-gray-600">
                If you didn&apos;t create an account with us, you can safely ignore this
                email.
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="mb-[32px] rounded-[8px] bg-gray-50 p-[20px]">
              <Text className="mb-[8px] text-[14px] font-semibold text-gray-700">
                🔒 Security Notice
              </Text>
              <Text className="m-0 text-[14px] leading-relaxed text-gray-600">
                Never share this verification code with anyone. Our team will never ask
                you for this code over phone or email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="m-0 mb-[8px] text-center text-[12px] text-gray-500">
                Aira
              </Text>
              <Text className="m-0 text-center text-[12px] text-gray-400">
                <Link
                  href="https://airaclothing.in/privacy"
                  className="text-gray-400 no-underline"
                >
                  Privacy Policy
                </Link>
              </Text>
              <Text className="m-0 text-center text-[12px] text-gray-400">
                © {new Date().getFullYear()} Aira. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailVerification;
