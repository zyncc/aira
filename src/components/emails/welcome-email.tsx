import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type WelcomeEmailProps = {
  firstName: string;
  email: string;
};

const WelcomeEmail = (props: WelcomeEmailProps) => {
  const { firstName, email } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Welcome to Aira! Let&apos;s get you started on your journey.</Preview>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white shadow-lg">
            {/* Header */}
            <Section className="rounded-t-[8px] bg-[#56756e] px-[32px] py-[32px]">
              <Heading className="m-0 text-center text-[32px] font-bold text-white">
                Welcome to Aira! 👋
              </Heading>
              <Text className="m-0 mt-[12px] text-center text-[18px] text-white/90">
                We&apos;re thrilled to have you join our community, {firstName}
              </Text>
            </Section>

            {/* Welcome Message */}
            <Section className="px-[32px] py-[32px]">
              <Text className="m-0 mb-[16px] text-[18px] font-medium text-gray-800">
                Hi {firstName},
              </Text>
              <Text className="m-0 mb-[16px] text-[16px] leading-[24px] text-gray-700">
                Thank you for creating your account with Aira! We&apos;re excited to have
                you on board and can&apos;t wait to help you discover amazing products
                that you&apos;ll love.
              </Text>
              <Text className="m-0 mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Your account has been successfully created with the email address:{" "}
                <span className="font-medium text-[#56756e]">{email}</span>
              </Text>
              <Section className="mb-[24px] text-center">
                <Button
                  href={"https://airaclothing.in/shop-all"}
                  className="box-border rounded-[8px] bg-[#56756e] px-[32px] py-[12px] text-[16px] font-medium text-white no-underline"
                >
                  Start Shopping Now
                </Button>
              </Section>
            </Section>
            <Hr className="mx-[32px] border-gray-200" />
            <Section className="px-[32px] py-[24px]">
              <Text className="m-0 mb-[20px] text-[20px] font-semibold text-gray-800">
                What&apos;s Next?
              </Text>
              <Row className="mb-[16px]">
                <Column className="w-[40px]">
                  <Text className="m-0 text-[24px]">🛍️</Text>
                </Column>
                <Column>
                  <Text className="m-0 mb-[4px] text-[16px] font-medium text-gray-800">
                    Explore Our Products
                  </Text>
                  <Text className="m-0 text-[14px] text-gray-600">
                    Browse through our curated collection of premium products
                  </Text>
                </Column>
              </Row>
              <Row className="mb-[16px]">
                <Column className="w-[40px]">
                  <Text className="m-0 text-[24px]">❤️</Text>
                </Column>
                <Column>
                  <Text className="m-0 mb-[4px] text-[16px] font-medium text-gray-800">
                    Create Your Wishlist
                  </Text>
                  <Text className="m-0 text-[14px] text-gray-600">
                    Save your favorite items for later and never miss out
                  </Text>
                </Column>
              </Row>
              <Row className="mb-[16px]">
                <Column className="w-[40px]">
                  <Text className="m-0 text-[24px]">🚚</Text>
                </Column>
                <Column>
                  <Text className="m-0 mb-[4px] text-[16px] font-medium text-gray-800">
                    Fast & Free Shipping
                  </Text>
                  <Text className="m-0 text-[14px] text-gray-600">
                    Enjoy free shipping on orders above ₹999 across India
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="w-[40px]">
                  <Text className="m-0 text-[24px]">🎯</Text>
                </Column>
                <Column>
                  <Text className="m-0 mb-[4px] text-[16px] font-medium text-gray-800">
                    Personalized Recommendations
                  </Text>
                  <Text className="m-0 text-[14px] text-gray-600">
                    Get product suggestions tailored just for you
                  </Text>
                </Column>
              </Row>
            </Section>
            <Hr className="mx-[32px] border-gray-200" />
            <Section className="px-[32px] py-[24px]">
              <Text className="m-0 mb-[16px] text-[18px] font-semibold text-gray-800">
                Need Help Getting Started?
              </Text>
              <Text className="m-0 mb-[12px] text-[14px] text-gray-700">
                Our support team is here to help you with any questions you might have:
              </Text>
              <Text className="m-0 mb-[4px] text-[14px] text-gray-600">
                📧 Email:{" "}
                <span className="font-medium text-[#56756e]">
                  support@airaclothing.in
                </span>
              </Text>
              <Text className="m-0 mb-[4px] text-[14px] text-gray-600">
                📞 Phone: +91 9448093950
              </Text>
              <Text className="m-0 text-[14px] text-gray-600">
                🕒 Support Hours: Mon-Sat, 9:00 AM - 7:00 PM IST
              </Text>
            </Section>
            <Section className="rounded-b-[8px] bg-gray-50 px-[32px] py-[24px]">
              <Text className="m-0 mb-[8px] text-center text-[14px] text-gray-600">
                Follow us on social media for updates and exclusive offers!
              </Text>
              <Text className="m-0 text-center text-[12px] text-gray-500">
                © {new Date().getFullYear()} Aira. All rights reserved.
              </Text>
              <Text className="m-0 mt-[12px] text-center text-[12px] text-gray-400">
                You received this email because you created an account with Aira.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

WelcomeEmail.PreviewProps = {
  companyName: "Aira",
  websiteUrl: "https://airaclothing.in",
  supportEmail: "support@airaclothing.in",
};

export default WelcomeEmail;
