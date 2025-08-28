import { convertImage } from "@/lib/convert-image";
import { OrderWithProduct } from "@/lib/types";
import { formatCurrency, formatSize } from "@/lib/utils";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type Props = {
  customerName: string;
  orderId: string;
  awbNumber: string;
  paymentId: string;
  orders: OrderWithProduct[];
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
        <Preview>Order confirmation - Your order #{orderId} has been confirmed!</Preview>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white shadow-lg">
            {/* Header */}
            <Section className="rounded-t-[8px] bg-[#56756e] px-[32px] py-[24px]">
              <Heading className="m-0 text-center text-[28px] font-bold text-white">
                Order Confirmed! 🎉
              </Heading>
              <Text className="m-0 mt-[8px] text-center text-[16px] text-white/90">
                Thank you for your purchase, {customerName}
              </Text>
            </Section>

            {/* Order Summary */}
            <Section className="px-[32px] py-[24px]">
              <Row>
                <Column>
                  <Text className="m-0 mb-[16px] text-[18px] font-semibold text-gray-800">
                    Order Details
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="w-1/2">
                  <Text className="m-0 mb-[4px] text-[14px] text-gray-600">Order ID</Text>
                  <Text className="m-0 mb-[12px] text-[16px] font-medium text-gray-800">
                    #{orderId}
                  </Text>
                </Column>
                <Column className="w-1/2">
                  <Text className="m-0 mb-[4px] text-[14px] text-gray-600">
                    Order Date
                  </Text>
                  <Text className="m-0 mb-[12px] text-[16px] font-medium text-gray-800">
                    {formatDate(orderDate)}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="w-1/2">
                  <Text className="m-0 mb-[4px] text-[14px] text-gray-600">
                    Payment ID
                  </Text>
                  <Text className="m-0 mb-[12px] text-[16px] font-medium text-gray-800">
                    {paymentId}
                  </Text>
                </Column>
                <Column className="w-1/2">
                  <Text className="m-0 mb-[4px] text-[14px] text-gray-600">
                    AWB Number
                  </Text>
                  <Text className="m-0 mb-[12px] text-[16px] font-medium text-gray-800">
                    {awbNumber}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="mx-[32px] border-gray-200" />

            {/* Products */}
            <Section className="px-[32px] py-[24px]">
              <Text className="m-0 mb-[20px] text-[18px] font-semibold text-gray-800">
                Items Ordered ({orders.length} {orders.length === 1 ? "item" : "items"})
              </Text>

              {orders.map((order, index) => (
                <div key={index}>
                  <Row className="mb-[20px]">
                    {/* Product Image */}
                    <Column className="w-[100px] pr-[16px]">
                      <Img
                        src={convertImage(order.product.images[0], 200)}
                        alt={order.product.title}
                        className="h-auto w-full rounded-[8px] border border-solid border-gray-200 object-cover"
                        width="84"
                        height="84"
                      />
                    </Column>

                    {/* Product Details */}
                    <Column className="flex-1">
                      <Text className="m-0 mb-[4px] text-[16px] font-semibold text-gray-800">
                        {order.product.title}
                      </Text>
                      <Text className="m-0 mb-[8px] text-[14px] text-gray-600">
                        Color: {order.product.color} • Size: {formatSize(order.size)}
                      </Text>
                      <Row>
                        <Column className="w-1/2">
                          <Text className="m-0 text-[14px] text-gray-600">
                            Quantity: {order.quantity}
                          </Text>
                        </Column>
                        <Column className="w-1/2 text-right">
                          <Text className="m-0 text-[16px] font-semibold text-[#56756e]">
                            ₹ {formatCurrency(order.product.price * order.quantity)}
                          </Text>
                          <Text className="m-0 text-[12px] text-gray-500">
                            ₹ {formatCurrency(order.product.price)} each
                          </Text>
                        </Column>
                      </Row>
                    </Column>
                  </Row>
                  {index < orders.length - 1 && (
                    <Hr className="my-[16px] border-gray-100" />
                  )}
                </div>
              ))}
            </Section>

            <Hr className="mx-[32px] border-gray-200" />

            {/* Order Summary */}
            <Section className="px-[32px] py-[20px]">
              <Text className="m-0 mb-[12px] text-[16px] font-semibold text-gray-800">
                Order Summary
              </Text>

              {/* Subtotal */}
              <Row className="mb-[8px]">
                <Column className="w-3/4">
                  <Text className="m-0 text-[14px] text-gray-600">
                    Subtotal ({orders.reduce((sum, order) => sum + order.quantity, 0)}{" "}
                    items)
                  </Text>
                </Column>
                <Column className="w-1/4 text-right">
                  <Text className="m-0 text-[14px] text-gray-600">
                    ₹{" "}
                    {formatCurrency(
                      orders.reduce(
                        (sum, order) => sum + order.product.price * order.quantity,
                        0,
                      ),
                    )}
                  </Text>
                </Column>
              </Row>

              {/* Shipping */}
              <Row className="mb-[8px]">
                <Column className="w-3/4">
                  <Text className="m-0 text-[14px] text-gray-600">Shipping</Text>
                </Column>
                <Column className="w-1/4 text-right">
                  <Text className="m-0 text-[14px] text-gray-600">Free</Text>
                </Column>
              </Row>

              <Hr className="my-[12px] border-gray-100" />

              {/* Total */}
              <Row>
                <Column className="w-3/4">
                  <Text className="m-0 text-[18px] font-bold text-gray-800">
                    Total Amount
                  </Text>
                </Column>
                <Column className="w-1/4 text-right">
                  <Text className="m-0 line-clamp-1 text-[20px] font-bold text-[#56756e]">
                    ₹{formatCurrency(totalAmount)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="mx-[32px] border-gray-200" />

            {/* Shipping Address */}
            <Section className="px-[32px] py-[24px]">
              <Text className="m-0 mb-[16px] text-[18px] font-semibold text-gray-800">
                Shipping Address
              </Text>
              <Text className="m-0 mb-[4px] text-[16px] text-gray-700">
                {orders[0].firstName + " " + orders[0].lastName}
              </Text>
              <Text className="m-0 mb-[2px] text-[14px] text-gray-600">
                {orders[0].address1}
              </Text>
              {orders[0].address2 && (
                <Text className="m-0 mb-[2px] text-[14px] text-gray-600">
                  {orders[0].address2}
                </Text>
              )}
              <Text className="m-0 mb-[2px] text-[14px] text-gray-600">
                {orders[0].city}, {orders[0].state} {orders[0].zipcode}
              </Text>
              <Text className="m-0 text-[14px] text-gray-600">
                Phone: {orders[0].phone}
              </Text>
            </Section>

            <Hr className="mx-[32px] border-gray-200" />

            {/* Next Steps */}
            <Section className="px-[32px] py-[24px]">
              <Text className="m-0 mb-[16px] text-[18px] font-semibold text-gray-800">
                What&apos;s Next?
              </Text>
              <Text className="m-0 mb-[8px] text-[14px] text-gray-700">
                • We&apos;re preparing your order for shipment
              </Text>
              <Text className="m-0 mb-[8px] text-[14px] text-gray-700">
                • Estimated delivery:{" "}
                {ttd?.toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                })}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="rounded-b-[8px] bg-gray-50 px-[32px] py-[24px]">
              <Text className="m-0 mb-[8px] text-center text-[14px] text-gray-600">
                Questions about your order? Contact us at support@airaclothing.in
              </Text>
              <Text className="m-0 text-center text-[12px] text-gray-500">
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
