import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
  Button,
  Tailwind,
} from '@react-email/components';

type WelcomeEmailProps = {
 firstName: string;
 email: string;
}

const WelcomeEmail = (props: WelcomeEmailProps) => {
  const {
    firstName,
    email,
  } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Welcome to Aira! Let's get you started on your journey.</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto">
            {/* Header */}
            <Section className="bg-[#56756e] rounded-t-[8px] px-[32px] py-[32px]">
              <Heading className="text-white text-[32px] font-bold m-0 text-center">
                Welcome to Aira! 👋
              </Heading>
              <Text className="text-white/90 text-[18px] text-center m-0 mt-[12px]">
                We're thrilled to have you join our community, {firstName}
              </Text>
            </Section>

            {/* Welcome Message */}
            <Section className="px-[32px] py-[32px]">
              <Text className="text-[18px] font-medium text-gray-800 m-0 mb-[16px]">
                Hi {firstName},
              </Text>
              <Text className="text-[16px] text-gray-700 m-0 mb-[16px] leading-[24px]">
                Thank you for creating your account with Aira! We're excited to have you on board and can't wait to help you discover amazing products that you'll love.
              </Text>
              <Text className="text-[16px] text-gray-700 m-0 mb-[24px] leading-[24px]">
                Your account has been successfully created with the email address: <span className="font-medium text-[#56756e]">{email}</span>
              </Text>
              <Section className="text-center mb-[24px]">
                <Button
                  href={"https://airaclothing.in/shop-all"}
                  className="bg-[#56756e] text-white px-[32px] py-[12px] rounded-[8px] text-[16px] font-medium no-underline box-border"
                >
                  Start Shopping Now
                </Button>
              </Section>
            </Section>
            <Hr className="border-gray-200 mx-[32px]" />
            <Section className="px-[32px] py-[24px]">
              <Text className="text-[20px] font-semibold text-gray-800 m-0 mb-[20px]">
                What's Next?
              </Text>
              <Row className="mb-[16px]">
                <Column className="w-[40px]">
                  <Text className="text-[24px] m-0">🛍️</Text>
                </Column>
                <Column>
                  <Text className="text-[16px] font-medium text-gray-800 m-0 mb-[4px]">
                    Explore Our Products
                  </Text>
                  <Text className="text-[14px] text-gray-600 m-0">
                    Browse through our curated collection of premium products
                  </Text>
                </Column>
              </Row>
              <Row className="mb-[16px]">
                <Column className="w-[40px]">
                  <Text className="text-[24px] m-0">❤️</Text>
                </Column>
                <Column>
                  <Text className="text-[16px] font-medium text-gray-800 m-0 mb-[4px]">
                    Create Your Wishlist
                  </Text>
                  <Text className="text-[14px] text-gray-600 m-0">
                    Save your favorite items for later and never miss out
                  </Text>
                </Column>
              </Row>
              <Row className="mb-[16px]">
                <Column className="w-[40px]">
                  <Text className="text-[24px] m-0">🚚</Text>
                </Column>
                <Column>
                  <Text className="text-[16px] font-medium text-gray-800 m-0 mb-[4px]">
                    Fast & Free Shipping
                  </Text>
                  <Text className="text-[14px] text-gray-600 m-0">
                    Enjoy free shipping on orders above ₹999 across India
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="w-[40px]">
                  <Text className="text-[24px] m-0">🎯</Text>
                </Column>
                <Column>
                  <Text className="text-[16px] font-medium text-gray-800 m-0 mb-[4px]">
                    Personalized Recommendations
                  </Text>
                  <Text className="text-[14px] text-gray-600 m-0">
                    Get product suggestions tailored just for you
                  </Text>
                </Column>
              </Row>
            </Section>
            <Hr className="border-gray-200 mx-[32px]" />
            <Section className="px-[32px] py-[24px]">
              <Text className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                Need Help Getting Started?
              </Text>
              <Text className="text-[14px] text-gray-700 m-0 mb-[12px]">
                Our support team is here to help you with any questions you might have:
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                📧 Email: <span className="text-[#56756e] font-medium">support@airaclothing.in</span>
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                📞 Phone: +91 9448093950
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                🕒 Support Hours: Mon-Sat, 9:00 AM - 7:00 PM IST
              </Text>
            </Section>
            <Section className="bg-gray-50 px-[32px] py-[24px] rounded-b-[8px]">
              <Text className="text-[14px] text-gray-600 text-center m-0 mb-[8px]">
                Follow us on social media for updates and exclusive offers!
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                © {new Date().getFullYear()} Aira. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-400 text-center m-0 mt-[12px]">
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