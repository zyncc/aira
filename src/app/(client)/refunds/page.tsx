import { Container } from "@/components/container";
import { Camera, CheckCircle, Clock, Mail, Package, RefreshCw } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exchanges & Returns - Aira Clothing",
  description:
    "Learn about Aira's return and exchange policy. We accept returns for incorrect orders and defective pieces with our simple 3-step process.",
};

export default function ReturnsAndExchanges() {
  return (
    <div className="min-h-screen text-[#202020]">
      <Container className="max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Exchanges & Returns</h1>
          <p className="text-lg">
            We&apos;re here to make things right if something goes wrong.
          </p>
        </div>
        <div className="space-y-12">
          {/* Return Policy Overview */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">Return Policy</h2>
            <p className="text-lg leading-relaxed">
              At Aira, we strive to ensure that every order is accurate and meets our high
              standards. If you receive an incorrect order or a defective piece, we want
              to make it right.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">Eligibility for Returns</h2>
            <p className="mb-4">Returns are accepted for:</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-6 shadow-sm">
                <div className="mb-3 flex items-center">
                  <Package className="text-primary mr-3 h-6 w-6" />
                  <h3 className="text-lg font-semibold">Incorrect Orders</h3>
                </div>
                <p>Wrong item, size, color, etc.</p>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <div className="mb-3 flex items-center">
                  <RefreshCw className="mr-3 h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold">Defective Pieces</h3>
                </div>
                <p>Manufacturing defects, damaged items, etc.</p>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">Return Process</h2>
            <p className="mb-6">To initiate a return, please follow these steps:</p>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="rounded-lg border p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-primary mt-1 mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="mb-3 flex items-center">
                      <Camera className="text-primary mr-2 h-5 w-5" />
                      <h3 className="text-lg font-semibold">Record Unboxing Video</h3>
                    </div>
                    <p>
                      Record a clear unboxing video from the moment you open the package
                      for the first time, showcasing the issue.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-lg border p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-primary mt-1 mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="mb-3 flex items-center">
                      <Mail className="text-primary mr-2 h-5 w-5" />
                      <h3 className="text-lg font-semibold">Share Video & Details</h3>
                    </div>
                    <p>
                      Share the video with us via email or WhatsApp, along with your order
                      details and reason for return, within 3 days of receiving your
                      order.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-lg border p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-primary mt-1 mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="mb-3 flex items-center">
                      <CheckCircle className="text-primary mr-2 h-5 w-5" />
                      <h3 className="text-lg font-semibold">Team Review</h3>
                    </div>
                    <p>
                      Our team will review your request and guide you through the next
                      steps.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-primary mt-1 mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="mb-3 flex items-center">
                      <CheckCircle className="text-primary mr-2 h-5 w-5" />
                      <h3 className="text-lg font-semibold">Refund</h3>
                    </div>
                    <p>
                      If your return is approved, we will process the refund within 1 - 2
                      business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">Important Notes</h2>
            <div className="rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-6">
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <span>Returns are only accepted for the reasons mentioned above.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <span>
                    The unboxing video is required to process your return request.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <span>
                    A clear unboxing video (e.g., good lighting, showing the packaging and
                    product clearly) to ensure the video clearly shows the issue.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Process Timeline */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">What Happens Next?</h2>
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="mt-1 mr-3 h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">Inspection Process (7-10 days)</p>
                    <p>
                      Once the item is received by us, a thorough inspection by our team
                      will be done. Once approved, the return will be accepted.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="text-primary mt-1 mr-3 h-5 w-5" />
                  <div>
                    <p className="font-semibold">Refund Process</p>
                    <p>
                      For prepaid orders, the refund would be done to the original mode of
                      payment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Package className="mt-1 mr-3 h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-semibold">Product Condition</p>
                    <p>
                      All the tags should be intact and the product should be in its
                      original packaging.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Service */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">Customer Service</h2>
            <div className="rounded-lg border border-blue-200 p-6">
              <div className="mb-3 flex items-center">
                <Clock className="text-primary mr-3 h-6 w-6" />
                <h3 className="text-lg font-semibold">Support Hours</h3>
              </div>
              <p className="mb-4">
                Our customer service team is available from Monday to Friday between 11
                a.m. and 6 p.m.
              </p>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Email:</span> support@airaclothing.in
                </p>
                <p>
                  <span className="font-medium">WhatsApp:</span> Available during business
                  hours
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">
                  What if I don&apos;t have an unboxing video?
                </h3>
                <p>
                  Unfortunately, the unboxing video is mandatory for processing return
                  requests. This helps us verify the issue and process your return
                  quickly.
                </p>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">
                  How long do I have to report an issue?
                </h3>
                <p>
                  You must contact us within 3 days of receiving your order to initiate a
                  return request.
                </p>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">
                  Can I return items if I simply don&apos;t like them?
                </h3>
                <p>
                  Returns are only accepted for incorrect orders or defective pieces. We
                  do not accept returns based on personal preference.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-sm">Last updated: January 2025</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
