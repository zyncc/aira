import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - Aira Clothing",
  description:
    "Read the Terms and Conditions for using Aira Clothing's website and services. These terms govern your use of our website and outline your rights and responsibilities.",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Please read these terms carefully before using our services.
          </p>
        </div>

        {/* Notice Banner */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-12 rounded-r-lg">
          <p className="text-amber-800 font-medium text-lg uppercase tracking-wide mb-2">
            Important Notice
          </p>
          <p className="text-amber-800">
            PLEASE READ THE FOLLOWING TERMS AND CONDITIONS VERY CAREFULLY AS
            YOUR USE OF SERVICE IS SUBJECT TO YOUR ACCEPTANCE OF AND COMPLIANCE
            WITH THE FOLLOWING TERMS AND CONDITIONS.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-gray-700 leading-relaxed mb-6">
              The website owner, including subsidiaries and affiliates
              ("airaclothing.in" or "Aira" or "we" or "us" or "our") provides
              the information contained on the website or any of the pages
              comprising the website ("website") to visitors ("visitors")
              (cumulatively referred to as "you" or "your" hereinafter) subject
              to the terms and conditions set out in these terms and conditions,
              the privacy policy and any other relevant terms and conditions,
              policies and notices which may be applicable to a specific section
              or module of the website.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              By continuing to browse/ subscribing to or using any of our
              services you agree that you have read, understood and are bound by
              the terms, regardless of how you subscribe to or use the services.
              These terms and various other policies are binding as per the
              provisions of the information technology (intermediaries
              guidelines) rules, 2011 formulated under the information
              technology act of 2000. Any new features or tools which are added
              to the current store/ website shall also be subject to the
              following terms.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              You can review the most current version of the terms of service at
              any time on this page. Aira reserves the right to update, change
              or replace any part of these terms of service by posting updates
              and/or changes to our website. It is your responsibility to check
              this page periodically for changes. Your continued use of or
              access to the website following the posting of any changes
              constitutes acceptance of those changes.
            </p>
          </section>

          {/* Terms List */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Terms are as follows:
            </h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg shadow-sm border">
                <p className="text-gray-700 leading-relaxed">
                  The content of the pages of this website is for your general
                  information and use and it is subject to change without
                  notice.
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-sm border">
                <p className="text-gray-700 leading-relaxed">
                  Neither we nor any third parties provide any warranty or
                  guarantee as to the accuracy, timeliness, performance,
                  completeness or suitability of the information and materials
                  found or offered on this website for any particular purpose.
                  You acknowledge that such information and materials may
                  contain inaccuracies or errors and we expressly exclude
                  liability for any such inaccuracies or errors to the fullest
                  extent permitted by law.
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-sm border">
                <p className="text-gray-700 leading-relaxed">
                  Your use of any information or materials on this website is
                  entirely at your own risk, for which we shall not be liable.
                  It shall be your own responsibility to ensure that any
                  products, services or information available through this
                  website meet your specific requirements.
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-sm border">
                <p className="text-gray-700 leading-relaxed">
                  This website contains material which is owned by or licensed
                  to us. This material includes, but is not limited to, the
                  design, layout, look, appearance and graphics. Reproduction is
                  prohibited other than in accordance with the copyright notice,
                  which forms part of these terms and conditions.
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-sm border">
                <p className="text-gray-700 leading-relaxed">
                  All trademarks reproduced in this website which are not the
                  property of, or licensed to, the operator are acknowledged on
                  the website.
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-sm border">
                <p className="text-gray-700 leading-relaxed">
                  Unauthorised use of this website may give rise to a claim for
                  damages and/or be a criminal offense.
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-sm border">
                <p className="text-gray-700 leading-relaxed">
                  From time to time this website may also include links to other
                  websites or individuals. These links are provided for your
                  convenience to provide further information. They do not
                  signify that we endorse the said party or website(s). We have
                  no responsibility for the content of the linked website(s).
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-sm border">
                <p className="text-gray-700 leading-relaxed">
                  You may not create a link to this website from another website
                  or document without Aira's prior written consent.
                </p>
              </div>
            </div>
          </section>

          {/* Jurisdiction */}
          <section className="mb-12">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 leading-relaxed font-medium">
                Your use of this website and any dispute arising out of such use
                of the website is subject to the laws of India or other
                regulatory authority.
              </p>
            </div>
          </section>

          {/* Additional Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Additional Information
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Shipping Policy
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  At Aira, we aim to deliver your orders promptly and reliably.
                  All orders are typically processed and shipped within 1-2
                  business days. Delivery times may vary depending on your
                  location. Customers can expect their orders to arrive within a
                  minimum of
                  <strong> 2 days </strong> and a maximum of{" "}
                  <strong> 7 days</strong> from the date of dispatch.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Please note that weekends, public holidays, and unforeseen
                  delays (such as those caused by courier services or extreme
                  weather) may affect delivery timelines. You will receive a
                  confirmation email with tracking details once your order has
                  been shipped.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Modifications to the Service
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Aira reserves the right at any time to modify or discontinue,
                  temporarily or permanently, the Service (or any part thereof)
                  with or without notice. You agree that Aira shall not be
                  liable to you or to any third party for any modification,
                  suspension or discontinuance of the Service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Products or Services
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Certain products or services may be available exclusively
                  online through the website. These products or services may
                  have limited quantities and are subject to return or exchange
                  only according to our Return Policy. We have made every effort
                  to display as accurately as possible the colors and images of
                  our products that appear at the store. We cannot guarantee
                  that your computer monitor's display of any color will be
                  accurate.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Accuracy of Information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to refuse any order you place with us. We
                  may, in our sole discretion, limit or cancel quantities
                  purchased per person, per household or per order. These
                  restrictions may include orders placed by or under the same
                  customer account, the same credit card, and/or orders that use
                  the same billing and/or shipping address. In the event that we
                  make a change to or cancel an order, we may attempt to notify
                  you by contacting the e-mail and/or billing address/phone
                  number provided at the time the order was made.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions or concerns regarding these Terms and
              Conditions, please contact us at:
            </p>
            <div className="p-6 rounded-lg shadow-sm border space-y-4">
              <p className="text-gray-700 font-medium">
                Email: support@airaclothing.in
              </p>
              <div>
                <p className="text-gray-700 font-medium">
                  Operational Address:
                </p>
                <p className="text-gray-700">
                  Mahaveer Sitara, 35, 24th Main Rd, Achappa Layout,
                  Puttenahalli,
                  <br />
                  JP Nagar 7th Phase, J. P. Nagar, Bengaluru – 560078, India
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
