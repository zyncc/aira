import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Aira Clothing",
  description:
    "Learn about how Aira protects and uses your personal information. Our comprehensive privacy policy outlines our data collection, usage, and protection practices.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Your privacy is important to us. Learn how we collect, use, and
            protect your information.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-gray-700 leading-relaxed mb-6">
              This Privacy Policy is intended for all users of airaclothing.in.
              Aira is dedicated to respecting and protecting the privacy of our
              users. All information provided by users, such as phone numbers,
              home addresses, current locations, email addresses, or any
              additional personal information found on the site, will be used
              solely to support the user's relationship with Aira.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Aira strives to develop innovative methods to serve users even
              better. The platform is designed to operate efficiently while
              keeping users' privacy in mind. This Privacy Policy outlines the
              types of personal information that the website gathers from its
              users and the steps taken to safeguard it.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              To provide a personalized browsing experience, Aira may collect
              information from you, which may include technical or other related
              information from the device used to access Aira platforms,
              including, without limitation, your current location. By
              registering, using, or visiting our platforms, you explicitly
              accept, without limitation or qualification, the collection, use,
              and transfer of the personal information provided by you in the
              manner described in the Terms & Conditions and Privacy Policy.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6">
              <p className="text-amber-800 font-medium">
                Kindly read the Terms & Conditions and the Privacy Policy
                carefully as they affect your rights and liabilities under law.
                If you do not accept the Terms and Conditions and this Privacy
                Policy, please do not use Aira services.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              When you visit the site, we collect certain information about your
              device, your interaction with the site, and information necessary
              to process your purchases. We may also collect additional
              information if you contact us for customer support. In this
              Privacy Policy, we refer to any information that can uniquely
              identify an individual (including the information below) as
              "personal information."
            </p>

            {/* Device Information */}
            <div className="rounded-lg p-6 mb-6 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Device Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900">
                    Examples of Personal Information Collected:
                  </span>
                  <span className="text-gray-700">
                    {" "}
                    Version of web browser, IP address, time zone, cookie
                    information, what sites or products you view, search terms,
                    and how you interact with the site.
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Purpose of Collection:
                  </span>
                  <span className="text-gray-700">
                    {" "}
                    To load the site accurately for you and to perform analytics
                    on site usage to optimize our site.
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Source of Collection:
                  </span>
                  <span className="text-gray-700">
                    {" "}
                    Collected automatically when you access our site using
                    cookies, log files, web beacons, tags, or pixels.
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Disclosure for a Business Purpose:
                  </span>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="rounded-lg p-6 mb-6 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Order Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900">
                    Examples of Personal Information Collected:
                  </span>
                  <span className="text-gray-700">
                    {" "}
                    Name, billing address, shipping address, payment information
                    (including credit card numbers), email address, and phone
                    number.
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Purpose of Collection:
                  </span>
                  <span className="text-gray-700">
                    {" "}
                    To provide products or services to you to fulfill our
                    contract, to process your payment information, arrange for
                    shipping, and provide you with invoices and/or order
                    confirmations, communicate with you, screen our orders for
                    potential risk or fraud, and, when in line with the
                    preferences you have shared with us, provide you with
                    information or advertising relating to our products or
                    services.
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Source of Collection:
                  </span>
                  <span className="text-gray-700"> Collected from you.</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Disclosure for a Business Purpose:
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Support Information */}
            <div className="rounded-lg p-6 mb-6 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Customer Support Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900">
                    Examples of Personal Information Collected:
                  </span>
                  <span className="text-gray-700">
                    {" "}
                    Name, billing address, shipping address, payment information
                    (including credit card numbers), email address, and phone
                    number.
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Purpose of Collection:
                  </span>
                  <span className="text-gray-700">
                    {" "}
                    To provide customer support.
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Source of Collection:
                  </span>
                  <span className="text-gray-700"> Collected from you.</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Disclosure for a Business Purpose:
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Sharing Personal Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Sharing Personal Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We share your personal information with service providers to help
              us provide our services and fulfil our contracts with you, as
              described above.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">For example:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>
                We may share your personal information to comply with applicable
                laws and regulations, respond to a subpoena, search warrant, or
                other lawful requests for information we receive, or otherwise
                protect our rights.
              </li>
            </ul>
          </section>

          {/* Behavioural Advertising */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Behavioural Advertising
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As described above, we use your personal information to provide
              you with targeted advertisements or marketing communications we
              believe may be of interest to you.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">For example:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>
                We use Google Analytics to help us understand how our customers
                use the site. You can read more about how Google uses your
                personal information here. You can also opt-out of Google
                Analytics here.
              </li>
              <li>
                We share information about your use of the site, your purchases,
                and your interaction with our ads on other websites with our
                advertising partners. We collect and share some of this
                information directly with our advertising partners, and in some
                cases, through the use of cookies or other similar technologies
                (which you may consent to, depending on your location).
              </li>
            </ul>
          </section>

          {/* Using Personal Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Using Personal Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use your personal information to provide our services to you,
              which includes offering products for sale, processing payments,
              shipping and fulfillment of your order, and keeping you up to date
              on new products, services, and offers.
            </p>
          </section>

          {/* Do Not Track */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Do Not Track
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Please note that because there is no consistent industry
              understanding of how to respond to "Do Not Track" signals, we do
              not alter our data collection and usage practices when we detect
              such a signal from your browser.
            </p>
          </section>

          {/* Changes */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect,
              for example, changes to our practices or for other operational,
              legal, or regulatory reasons.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              For more information about our privacy practices, if you have
              questions, or if you would like to make a complaint, please
              contact us by email at support@airaclothing.in or by mail using
              the details provided.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Disclaimer
            </h2>
            <div className="rounded-lg space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to change the Terms and Privacy Policy from
                time to time as we deem fit, without any prior intimation to
                you. Your continued use of the website signifies your acceptance
                of any amendment to these terms. You are therefore advised to
                read the Privacy Policy on a regular basis. In case you disagree
                with any of the Terms and Privacy Policies or any amendments
                thereafter, you may terminate your use of this website
                immediately.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We follow generally accepted standards to protect the personal
                information submitted to us, including using services from
                third-party service providers. Therefore, while we strive to use
                commercially acceptable means to protect your personal
                information, we cannot guarantee absolute security and thereby
                usage in a manner inconsistent with this Privacy Policy. We
                assume no liability or responsibility for the disclosure of your
                information due to errors in transmission, unauthorized
                third-party access, or other causes beyond our control.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The onus of protecting the classified/personal information
                details of every user solely depends on them, and we shall take
                no liability in case of any breach thereupon. We recommend you
                protect your personal information by never providing your credit
                card, debit card, or any other bank account details to anyone.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Aira provides maximum care possible to ensure that all or any
                data/information concerning electronic transfer of money remains
                secure. For completing online transactions involving payments, a
                user is directed to a secured payment gateway. Aira does not
                store or keep financial data such as credit card
                numbers/passwords/PINs, etc., or any "personal account-related
                information" for its own use.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Since the transaction happens on a third-party network not
                controlled by Aira, once an online transaction has been
                completed, the personal account-related information is not
                accessible to anyone at Aira or at the payment gateway, ensuring
                maximum security. Aira shall not be liable for any loss or
                damage sustained by reason of any disclosure (inadvertent or
                otherwise) of any information concerning the user's account
                and/or information relating to or regarding online transactions
                using credit cards/debit cards and/or their verification process
                and particulars, nor for any error, omission, or inaccuracy with
                respect to any information so disclosed and used, whether or not
                in pursuance of a legal process or otherwise.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You play an important role in keeping your personal information
                secure. You should not share your username, password, or other
                security information of Aira with anyone. If we receive
                instructions using your username and password, we will consider
                that you have authorized the instructions.
              </p>
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
