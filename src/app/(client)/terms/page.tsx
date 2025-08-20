import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - Aira Clothing",
  description:
    "Read the Terms and Conditions for using Aira Clothing's website and services. These terms govern your use of our website and outline your rights and responsibilities.",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen text-[#202020]">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Terms and Conditions</h1>
          <p className="text-lg">
            Please read these terms carefully before using our services.
          </p>
        </div>

        {/* Notice Banner */}
        <div className="mb-12 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-6">
          <p className="mb-2 text-lg font-medium tracking-wide text-amber-800 uppercase">
            Important Notice
          </p>
          <p className="text-amber-800">
            PLEASE READ THE FOLLOWING TERMS AND CONDITIONS VERY CAREFULLY AS YOUR USE OF
            SERVICE IS SUBJECT TO YOUR ACCEPTANCE OF AND COMPLIANCE WITH THE FOLLOWING
            TERMS AND CONDITIONS.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-[#202020]">
          {/* Introduction */}
          <section className="mb-12">
            <p className="mb-6 leading-relaxed">
              The website owner, including subsidiaries and affiliates
              (&quot;airaclothing.in&quot; or &quot;Aira&quot; or &quot;we&quot; or
              &quot;us&quot; or &quot;our&quot;) provides the information contained on the
              website or any of the pages comprising the website (&quot;website&quot;) to
              visitors (&quot;visitors&quot;) (cumulatively referred to as &quot;you&quot;
              or &quot;your&quot; hereinafter) subject to the terms and conditions set out
              in these terms and conditions, the privacy policy and any other relevant
              terms and conditions, policies and notices which may be applicable to a
              specific section or module of the website.
            </p>
            <p className="mb-6 leading-relaxed">
              By continuing to browse/ subscribing to or using any of our services you
              agree that you have read, understood and are bound by the terms, regardless
              of how you subscribe to or use the services. These terms and various other
              policies are binding as per the provisions of the information technology
              (intermediaries guidelines) rules, 2011 formulated under the information
              technology act of 2000. Any new features or tools which are added to the
              current store/ website shall also be subject to the following terms.
            </p>
            <p className="mb-6 leading-relaxed">
              You can review the most current version of the terms of service at any time
              on this page. Aira reserves the right to update, change or replace any part
              of these terms of service by posting updates and/or changes to our website.
              It is your responsibility to check this page periodically for changes. Your
              continued use of or access to the website following the posting of any
              changes constitutes acceptance of those changes.
            </p>
          </section>

          {/* Terms List */}
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">Terms are as follows:</h2>
            <div className="space-y-6">
              <div className="rounded-lg border p-6 shadow-sm">
                <p className="leading-relaxed">
                  The content of the pages of this website is for your general information
                  and use and it is subject to change without notice.
                </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <p className="leading-relaxed">
                  Neither we nor any third parties provide any warranty or guarantee as to
                  the accuracy, timeliness, performance, completeness or suitability of
                  the information and materials found or offered on this website for any
                  particular purpose. You acknowledge that such information and materials
                  may contain inaccuracies or errors and we expressly exclude liability
                  for any such inaccuracies or errors to the fullest extent permitted by
                  law.
                </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <p className="leading-relaxed">
                  Your use of any information or materials on this website is entirely at
                  your own risk, for which we shall not be liable. It shall be your own
                  responsibility to ensure that any products, services or information
                  available through this website meet your specific requirements.
                </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <p className="leading-relaxed">
                  This website contains material which is owned by or licensed to us. This
                  material includes, but is not limited to, the design, layout, look,
                  appearance and graphics. Reproduction is prohibited other than in
                  accordance with the copyright notice, which forms part of these terms
                  and conditions.
                </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <p className="leading-relaxed">
                  All trademarks reproduced in this website which are not the property of,
                  or licensed to, the operator are acknowledged on the website.
                </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <p className="leading-relaxed">
                  Unauthorised use of this website may give rise to a claim for damages
                  and/or be a criminal offense.
                </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <p className="leading-relaxed">
                  From time to time this website may also include links to other websites
                  or individuals. These links are provided for your convenience to provide
                  further information. They do not signify that we endorse the said party
                  or website(s). We have no responsibility for the content of the linked
                  website(s).
                </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <p className="leading-relaxed">
                  You may not create a link to this website from another website or
                  document without Aira&apos;s prior written consent.
                </p>
              </div>
            </div>
          </section>

          {/* Jurisdiction */}
          <section className="mb-12">
            <div className="bg-background rounded-lg border p-6">
              <p className="leading-relaxed font-medium">
                Your use of this website and any dispute arising out of such use of the
                website is subject to the laws of India or other regulatory authority.
              </p>
            </div>
          </section>

          {/* Additional Information */}
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">Additional Information</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-xl font-semibold">Shipping Policy</h3>
                <p className="mb-4 leading-relaxed">
                  At Aira, we aim to deliver your orders promptly and reliably. All orders
                  are typically processed and shipped within 1-2 business days. Delivery
                  times may vary depending on your location. Customers can expect their
                  orders to arrive within a minimum of
                  <strong> 2 days </strong> and a maximum of <strong> 7 days</strong> from
                  the date of dispatch.
                </p>
                <p className="leading-relaxed">
                  Please note that weekends, public holidays, and unforeseen delays (such
                  as those caused by courier services or extreme weather) may affect
                  delivery timelines. You will receive a confirmation email with tracking
                  details once your order has been shipped.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold">
                  Modifications to the Service
                </h3>
                <p className="leading-relaxed">
                  Aira reserves the right at any time to modify or discontinue,
                  temporarily or permanently, the Service (or any part thereof) with or
                  without notice. You agree that Aira shall not be liable to you or to any
                  third party for any modification, suspension or discontinuance of the
                  Service.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold">Products or Services</h3>
                <p className="leading-relaxed">
                  Certain products or services may be available exclusively online through
                  the website. These products or services may have limited quantities and
                  are subject to return or exchange only according to our Return Policy.
                  We have made every effort to display as accurately as possible the
                  colors and images of our products that appear at the store. We cannot
                  guarantee that your computer monitor&apos;s display of any color will be
                  accurate.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold">Accuracy of Information</h3>
                <p className="leading-relaxed">
                  We reserve the right to refuse any order you place with us. We may, in
                  our sole discretion, limit or cancel quantities purchased per person,
                  per household or per order. These restrictions may include orders placed
                  by or under the same customer account, the same credit card, and/or
                  orders that use the same billing and/or shipping address. In the event
                  that we make a change to or cancel an order, we may attempt to notify
                  you by contacting the e-mail and/or billing address/phone number
                  provided at the time the order was made.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">Contact Us</h2>
            <p className="mb-4 leading-relaxed">
              If you have any questions or concerns regarding these Terms and Conditions,
              please contact us at:
            </p>
            <div className="space-y-4 rounded-lg border p-6 shadow-sm">
              <p className="font-medium">Email: support@airaclothing.in</p>
              <div>
                <p className="font-medium">Operational Address:</p>
                <p>
                  Mahaveer Sitara, 35, 24th Main Rd, Achappa Layout, Puttenahalli,
                  <br />
                  JP Nagar 7th Phase, J. P. Nagar, Bengaluru – 560078, India
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-sm">Last updated: January 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
