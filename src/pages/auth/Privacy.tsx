import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import backgroundImage from "../../assets/auth/background.jpg";

export function Privacy() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-8 px-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl md:rounded-[40px] shadow-lg p-6 sm:p-8 md:p-12 lg:p-16">
        <Link
          to="/account/emailsignup"
          className="inline-flex items-center gap-2 text-[#8F00FF] hover:underline mb-6 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter"
        >
          <ArrowLeft size={20} />
          Back to Sign Up
        </Link>

        <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-black mb-6 leading-[120%] tracking-normal font-inter">
          MARQAIT AI Privacy Policy
        </h1>

        <p className="text-sm md:text-[14px] font-normal leading-[150%] tracking-normal font-inter text-[#6B7280] mb-8">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your personal information.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Introduction
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              This Privacy Policy applies to the Marqait AI website located at
              www.marqait.com, and all associated sites linked to www.marqait.com
              by Marqait AI, its subsidiaries, and affiliates (collectively, the
              "Site"). Marqait AI ("Marqait", "we", "our" or "us") is an Indian
              company providing an AI-powered marketing automation platform. We
              value your privacy and comply with applicable laws, including India's
              Digital Personal Data Protection Act, 2023 (DPDPA), the EU General
              Data Protection Regulation (GDPR), and the California Consumer
              Privacy Act (CCPA) as amended by the California Privacy Rights Act
              (CPRA). Marqait is headquartered in India and all data is stored and
              processed in India in accordance with local regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Information We Collect
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              We collect information you provide directly and information
              automatically when you use our services. Personally Identifiable
              Information may include your name, email address, business address,
              phone number and other contact details. We also collect account data
              and profile information (e.g. login credentials, company name,
              communication preferences) and billing information via secure payment
              processors.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              In addition, we collect technical and usage data such as IP address,
              browser type, device identifiers, login history, pages visited,
              session duration, and location or geolocation data. We may also
              collect any content you upload or share (such as marketing materials,
              images, text, files or AI-generated content) and records of your
              communications with us (for example, customer support messages or
              feedback).
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              We classify any data that identifies you, either directly (like name
              or email) or indirectly (like IP address or browsing history) as
              personal information. Under Indian law, certain categories of data
              (such as financial, health or biometric data) may be considered
              sensitive; we handle all personal and sensitive data with strict
              security and confidentiality measures.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              How We Collect Information
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              We receive information directly from you – for example, when you
              register for an account, fill out forms, contact support, or
              participate in surveys. We also collect data automatically when you
              use Marqait's websites and applications: for instance, through
              cookies, web beacons, and analytics tools.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              Cookies are small data files stored on your device to facilitate
              features (e.g. keeping you logged in) and analytics. We use essential
              cookies for core functionality (like authentication and security) and
              non-essential cookies for analytics, personalization, and advertising.
              We obtain explicit consent before using non-essential cookies for
              marketing or tracking purposes.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              You can control or disable cookies via your browser settings (see our
              Cookie Notice or your browser's help). Finally, we may receive
              information about you from third-party sources (for example, public
              business directories or partners) and combine it with the data we
              collect directly.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              How We Use Your Information
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              We use your personal data to provide, operate and improve our
              platform. Specifically, we use your information to set up and maintain
              your account, facilitate logins, and ensure you can access the
              services. We use your contact details to communicate with you – for
              example, to respond to support requests or send service-related
              notices.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              We use usage data for internal record-keeping and analytics to enhance
              features, security and performance. We may analyze aggregated data and
              usage patterns to optimize our platform. With your consent, we may
              also send you marketing messages about Marqait or related products;
              you can unsubscribe at any time by clicking the opt-out link in those
              messages or contacting us.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              Under applicable law, we rely on lawful bases to process your data.
              For example, under the GDPR we process data to perform our contract
              with you, to comply with legal obligations, and for our legitimate
              interests (such as improving our services), and sometimes based on
              your consent. We will use your information as required by law – for
              instance, to detect or prevent fraud, comply with subpoenas or court
              orders, or to enforce our legal rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Data Sharing and Disclosure
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              We will never sell or rent your personal data. We disclose information
              only as necessary to operate our business and provide the Service.
              This includes sharing data with:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-[16px] font-semibold text-black mb-2 leading-[120%] tracking-normal font-inter">
                  Affiliates and Subsidiaries:
                </h3>
                <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
                  We may share information with other Marqait entities, as needed,
                  to provide the Service.
                </p>
              </div>
              <div>
                <h3 className="text-base md:text-[16px] font-semibold text-black mb-2 leading-[120%] tracking-normal font-inter">
                  Service Providers:
                </h3>
                <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
                  We engage third-party vendors (e.g. cloud hosting, IT, email
                  providers, analytics, payment processors) to support our platform.
                  These providers process data on our behalf and are contractually
                  bound to use it only for the purposes we specify.
                </p>
              </div>
              <div>
                <h3 className="text-base md:text-[16px] font-semibold text-black mb-2 leading-[120%] tracking-normal font-inter">
                  Professional Advisors:
                </h3>
                <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
                  We may share information with auditors, lawyers, or accountants
                  when needed for legal or financial advice.
                </p>
              </div>
            </div>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mt-4">
              We also may disclose data if required by law or to protect our rights
              – for example, in response to a lawful order under India's Information
              Technology Act or other regulations, or to prevent fraud.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Your Privacy Rights
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              You have choices regarding our use of your information. You may
              unsubscribe from marketing emails at any time (links are provided in
              each message). Under privacy laws like the GDPR (EU/UK) and the
              CCPA/CPRA (California), you have rights with respect to your personal
              data.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-3">
              Your rights include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              <li>Access the categories of data we hold about you</li>
              <li>Correct or update your personal information</li>
              <li>Request deletion of your personal data</li>
              <li>Data portability and restriction of processing</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              To exercise any rights (access, correction, deletion, objection,
              etc.), or to withdraw consent, please contact us using the information
              below. We will verify your identity and respond in accordance with
              applicable law. We will not discriminate against you for exercising
              any privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Data Security
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              We implement commercially reasonable technical, physical, and
              administrative safeguards to protect your information. These include
              encryption of data in transit and at rest, access controls, firewalls,
              and regular security reviews. We follow industry standards (such as
              using secure cloud hosting and encrypting sensitive fields) to prevent
              unauthorized access or disclosure.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              In India, the Information Technology Act and related rules require
              companies to implement "reasonable security practices" for personal
              data; as a fiduciary we are obligated to maintain security safeguards
              and promptly notify authorities of any data breaches. However, no
              system can be 100% secure. You acknowledge the inherent risk of data
              transmission over the Internet, and you accept that we cannot
              guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Data Retention
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              We retain personal information only as long as needed to fulfill the
              purposes outlined above and to comply with legal obligations. For
              example, we may keep account and transaction records for as long as
              required by financial or tax regulations (such as India's Income Tax
              Act) or corporate laws. Once data is no longer necessary, we will
              securely delete it or anonymize it so it cannot be linked to you.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Policy Updates
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              We may revise this Privacy Policy from time to time (for instance, to
              reflect changes in law or our practices). If we make material changes,
              we will notify you – for example, by updating the "Last Updated" date
              and/or posting a notice on our website. Your continued use of Marqait
              after such changes means you accept the revised policy. We encourage
              you to review this policy periodically.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/account/emailsignup"
            className="inline-flex items-center gap-2 text-[#8F00FF] hover:underline text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter"
          >
            <ArrowLeft size={20} />
            Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
