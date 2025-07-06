import * as React from "react";
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
  Img,
  Tailwind,
} from "@react-email/components";
import formatCurrency from "@/lib/formatCurrency";
import { address } from "@prisma/client";
import { formatSize } from "@/lib/utils";

type Props = {
  customerName: string;
  orderId: string;
  awbNumber: string;
  paymentId: string;
  orders: any[];
  shippingAddress: address;
  orderDate: string;
  totalAmount: number;
  ttd: Date;
};

const OrderConfirmationEmail = ({
  customerName,
  orderId,
  awbNumber,
  paymentId,
  orders,
  shippingAddress,
  orderDate,
  totalAmount,
  ttd,
}: Props) => {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Order confirmation - Your order #{orderId} has been confirmed!
        </Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto">
            {/* Header */}
            <Section className="bg-[#56756e] rounded-t-[8px] px-[32px] py-[24px]">
              <Heading className="text-white text-[28px] font-bold m-0 text-center">
                Order Confirmed! 🎉
              </Heading>
              <Text className="text-white/90 text-[16px] text-center m-0 mt-[8px]">
                Thank you for your purchase, {customerName}
              </Text>
            </Section>

            {/* Order Summary */}
            <Section className="px-[32px] py-[24px]">
              <Row>
                <Column>
                  <Text className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                    Order Details
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column className="w-1/2">
                  <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                    Order ID
                  </Text>
                  <Text className="text-[16px] font-medium text-gray-800 m-0 mb-[12px]">
                    #{orderId}
                  </Text>
                </Column>
                <Column className="w-1/2">
                  <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                    Order Date
                  </Text>
                  <Text className="text-[16px] font-medium text-gray-800 m-0 mb-[12px]">
                    {formatDate(orderDate)}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="w-1/2">
                  <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                    Payment ID
                  </Text>
                  <Text className="text-[16px] font-medium text-gray-800 m-0 mb-[12px]">
                    {paymentId}
                  </Text>
                </Column>
                <Column className="w-1/2">
                  <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                    AWB Number
                  </Text>
                  <Text className="text-[16px] font-medium text-gray-800 m-0 mb-[12px]">
                    {awbNumber}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Products */}
            <Section className="px-[32px] py-[24px]">
              <Text className="text-[18px] font-semibold text-gray-800 m-0 mb-[20px]">
                Items Ordered ({orders.length}{" "}
                {orders.length === 1 ? "item" : "items"})
              </Text>

              {orders.map((order, index) => (
                <div key={index}>
                  <Row className="mb-[20px]">
                    {/* Product Image */}
                    <Column className="w-[100px] pr-[16px]">
                      <Img
                        src={
                          order.product.images[0] ||
                          "https://new.email/static/app/placeholder.png"
                        }
                        alt={order.product.title}
                        className="w-full h-auto object-cover rounded-[8px] border border-solid border-gray-200"
                        width="84"
                        height="84"
                      />
                    </Column>

                    {/* Product Details */}
                    <Column className="flex-1">
                      <Text className="text-[16px] font-semibold text-gray-800 m-0 mb-[4px]">
                        {order.product.title}
                      </Text>
                      <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                        {order.product.description.length > 80
                          ? `${order.product.description.substring(0, 80)}...`
                          : order.product.description}
                      </Text>
                      <Text className="text-[14px] text-gray-600 m-0 mb-[8px]">
                        Color: {order.product.color} • Size:{" "}
                        {formatSize(order.size)}
                      </Text>
                      <Row>
                        <Column className="w-1/2">
                          <Text className="text-[14px] text-gray-600 m-0">
                            Quantity: {order.quantity}
                          </Text>
                        </Column>
                        <Column className="w-1/2 text-right">
                          <Text className="text-[16px] font-semibold text-[#56756e] m-0">
                            ₹ {formatCurrency(order.price * order.quantity)}
                          </Text>
                          <Text className="text-[12px] text-gray-500 m-0">
                            ₹ {formatCurrency(order.price)} each
                          </Text>
                        </Column>
                      </Row>
                    </Column>
                  </Row>
                  {index < orders.length - 1 && (
                    <Hr className="border-gray-100 my-[16px]" />
                  )}
                </div>
              ))}
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Order Summary */}
            <Section className="px-[32px] py-[20px]">
              <Text className="text-[16px] font-semibold text-gray-800 m-0 mb-[12px]">
                Order Summary
              </Text>

              {/* Subtotal */}
              <Row className="mb-[8px]">
                <Column className="w-3/4">
                  <Text className="text-[14px] text-gray-600 m-0">
                    Subtotal (
                    {orders.reduce((sum, order) => sum + order.quantity, 0)}{" "}
                    items)
                  </Text>
                </Column>
                <Column className="w-1/4 text-right">
                  <Text className="text-[14px] text-gray-600 m-0">
                    ₹{" "}
                    {formatCurrency(
                      orders.reduce(
                        (sum, order) => sum + order.price * order.quantity,
                        0
                      )
                    )}
                  </Text>
                </Column>
              </Row>

              {/* Shipping */}
              <Row className="mb-[8px]">
                <Column className="w-3/4">
                  <Text className="text-[14px] text-gray-600 m-0">
                    Shipping
                  </Text>
                </Column>
                <Column className="w-1/4 text-right">
                  <Text className="text-[14px] text-gray-600 m-0">Free</Text>
                </Column>
              </Row>

              <Hr className="border-gray-100 my-[12px]" />

              {/* Total */}
              <Row>
                <Column className="w-3/4">
                  <Text className="text-[18px] font-bold text-gray-800 m-0">
                    Total Amount
                  </Text>
                </Column>
                <Column className="w-1/4 text-right">
                  <Text className="text-[20px] font-bold text-[#56756e] m-0">
                    {formatCurrency(totalAmount)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Shipping Address */}
            <Section className="px-[32px] py-[24px]">
              <Text className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                Shipping Address
              </Text>
              <Text className="text-[16px] text-gray-700 m-0 mb-[4px]">
                {shippingAddress.firstName + " " + shippingAddress.lastName}
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 mb-[2px]">
                {shippingAddress.address1}
              </Text>
              {shippingAddress.address2 && (
                <Text className="text-[14px] text-gray-600 m-0 mb-[2px]">
                  {shippingAddress.address2}
                </Text>
              )}
              <Text className="text-[14px] text-gray-600 m-0 mb-[2px]">
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.zipcode}
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                Phone: {shippingAddress.phone}
              </Text>
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Next Steps */}
            <Section className="px-[32px] py-[24px]">
              <Text className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                What's Next?
              </Text>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                • We're preparing your order for shipment
              </Text>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                • You'll receive a tracking number once your order ships
              </Text>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                • Estimated delivery: {ttd.toDateString()}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-[32px] py-[24px] rounded-b-[8px]">
              <Text className="text-[14px] text-gray-600 text-center m-0 mb-[8px]">
                Questions about your order? Contact us at
                support@airaclothing.in
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                © {new Date().getFullYear()} Aira. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderConfirmationEmail;
