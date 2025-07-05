import type {Metadata} from "next";
import {Camera, CheckCircle, Clock, Mail, Package, RefreshCw,} from "lucide-react";

export const metadata: Metadata = {
    title: "Exchanges & Returns - Aira Clothing",
    description:
        "Learn about Aira's return and exchange policy. We accept returns for incorrect orders and defective pieces with our simple 3-step process.",
};

export default function ReturnsAndExchanges() {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Exchanges & Returns
                    </h1>
                    <p className="text-lg text-gray-600">
                        We're here to make things right if something goes wrong.
                    </p>
                </div>
                <div className="space-y-12">
                    {/* Return Policy Overview */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Return Policy
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            At Aira, we strive to ensure that every order is accurate and
                            meets our high standards. If you receive an incorrect order or a
                            defective piece, we want to make it right.
                        </p>
                    </section>

                    {/* Eligibility */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Eligibility for Returns
                        </h2>
                        <p className="text-gray-700 mb-4">Returns are accepted for:</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className=" p-6 rounded-lg shadow-sm border">
                                <div className="flex items-center mb-3">
                                    <Package className="h-6 w-6 text-primary mr-3"/>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Incorrect Orders
                                    </h3>
                                </div>
                                <p className="text-gray-700">Wrong item, size, color, etc.</p>
                            </div>
                            <div className=" p-6 rounded-lg shadow-sm border">
                                <div className="flex items-center mb-3">
                                    <RefreshCw className="h-6 w-6 text-red-600 mr-3"/>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Defective Pieces
                                    </h3>
                                </div>
                                <p className="text-gray-700">
                                    Manufacturing defects, damaged items, etc.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Return Process */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Return Process
                        </h2>
                        <p className="text-gray-700 mb-6">
                            To initiate a return, please follow these steps:
                        </p>

                        <div className="space-y-6">
                            {/* Step 1 */}
                            <div className=" p-6 rounded-lg shadow-sm border">
                                <div className="flex items-start">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center mb-3">
                                            <Camera className="h-5 w-5 text-primary mr-2"/>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Record Unboxing Video
                                            </h3>
                                        </div>
                                        <p className="text-gray-700">
                                            Record a clear unboxing video from the moment you open the
                                            package for the first time, showcasing the issue.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className=" p-6 rounded-lg shadow-sm border">
                                <div className="flex items-start">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center mb-3">
                                            <Mail className="h-5 w-5 text-primary mr-2"/>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Share Video & Details
                                            </h3>
                                        </div>
                                        <p className="text-gray-700">
                                            Share the video with us via email or WhatsApp, along with
                                            your order details and reason for return, within 3 days of
                                            receiving your order.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className=" p-6 rounded-lg shadow-sm border">
                                <div className="flex items-start">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center mb-3">
                                            <CheckCircle className="h-5 w-5 text-primary mr-2"/>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Team Review
                                            </h3>
                                        </div>
                                        <p className="text-gray-700">
                                            Our team will review your request and guide you through
                                            the next steps.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className=" p-6 rounded-lg shadow-sm border">
                                <div className="flex items-start">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                                        4
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center mb-3">
                                            <CheckCircle className="h-5 w-5 text-primary mr-2"/>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Refund
                                            </h3>
                                        </div>
                                        <p className="text-gray-700">
                                            If your return is approved, we will process the refund
                                            within 1 - 2 business days.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Important Notes */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Important Notes
                        </h2>
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                            <ul className="space-y-3 text-amber-800">
                                <li className="flex items-start">
                                    <span className="font-bold mr-2">•</span>
                                    <span>
                    Returns are only accepted for the reasons mentioned above.
                  </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-2">•</span>
                                    <span>
                    The unboxing video is required to process your return
                    request.
                  </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-2">•</span>
                                    <span>
                    A clear unboxing video (e.g., good lighting, showing the
                    packaging and product clearly) to ensure the video clearly
                    shows the issue.
                  </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Process Timeline */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            What Happens Next?
                        </h2>
                        <div className=" p-6 rounded-lg shadow-sm border">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Clock className="h-5 w-5 text-green-600 mr-3 mt-1"/>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Inspection Process (7-10 days)
                                        </p>
                                        <p className="text-gray-700">
                                            Once the item is received by us, a thorough inspection by
                                            our team will be done. Once approved, the return will be
                                            accepted.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <RefreshCw className="h-5 w-5 text-primary mr-3 mt-1"/>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Refund Process
                                        </p>
                                        <p className="text-gray-700">
                                            For prepaid orders, the refund would be done to the
                                            original mode of payment.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Package className="h-5 w-5 text-purple-600 mr-3 mt-1"/>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Product Condition
                                        </p>
                                        <p className="text-gray-700">
                                            All the tags should be intact and the product should be in
                                            its original packaging.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Customer Service */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Customer Service
                        </h2>
                        <div className=" border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center mb-3">
                                <Clock className="h-6 w-6 text-primary mr-3"/>
                                <h3 className="text-lg font-semibold">Support Hours</h3>
                            </div>
                            <p className="mb-4">
                                Our customer service team is available from Monday to Friday
                                between 11 a.m. and 6 p.m.
                            </p>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Email:</span>{" "}
                                    support@airaclothing.in
                                </p>
                                <p>
                                    <span className="font-medium">WhatsApp:</span> Available
                                    during business hours
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            <div className=" p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    What if I don't have an unboxing video?
                                </h3>
                                <p className="text-gray-700">
                                    Unfortunately, the unboxing video is mandatory for processing
                                    return requests. This helps us verify the issue and process
                                    your return quickly.
                                </p>
                            </div>
                            <div className=" p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    How long do I have to report an issue?
                                </h3>
                                <p className="text-gray-700">
                                    You must contact us within 3 days of receiving your order to
                                    initiate a return request.
                                </p>
                            </div>
                            <div className=" p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Can I return items if I simply don't like them?
                                </h3>
                                <p className="text-gray-700">
                                    Returns are only accepted for incorrect orders or defective
                                    pieces. We do not accept returns based on personal preference.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="text-center pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500">Last updated: January 2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
