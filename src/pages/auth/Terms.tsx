import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import backgroundImage from "../../assets/auth/background.jpg";

export function Terms() {
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
          MARQAIT AI Terms of Service
        </h1>

        <p className="text-sm md:text-[14px] font-normal leading-[150%] tracking-normal font-inter text-[#6B7280] mb-8">
          These terms govern your use of Marqait AI's platform and services.
          Please read them carefully.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Acceptance of Terms
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              These Terms of Service ("Terms") govern your access to and use of
              Marqait's website and services. By registering for or using our
              services, you agree to be bound by these Terms and by our Privacy
              Policy. Marqait is based in India, and these Terms are governed by
              Indian law.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              You must be at least 18 years old to use the Service; if you are
              younger than 18, you may use the Service only with parental consent
              and in compliance with local law. Minors under 18 should not create
              an account. If you do not agree with any part of these Terms or our
              policies, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Account Registration and Security
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              To access certain features, you may need to create an account. You
              agree to provide accurate, current and complete information (such as
              name, email and password) when registering. You are responsible for
              maintaining the confidentiality of your login credentials and for any
              activity under your account.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-3">
              Your account responsibilities:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              <li>Keep your login credentials secure and confidential</li>
              <li>Notify us immediately of any unauthorized account access</li>
              <li>Do not share your password or account with others</li>
              <li>Take responsibility for all actions taken through your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Permitted Uses
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              Subject to these Terms, Marqait grants you a limited, non-exclusive,
              non-transferable license to use the platform and its features for
              your business or personal marketing needs. You agree to use the
              Service only in compliance with applicable laws (including India's
              Information Technology Act and any content regulations) and these
              Terms.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              For example, you may not use Marqait for any unlawful purpose, to
              send spam or unsolicited communications, or to infringe on others'
              rights. Marqait's AI tools are provided for marketing optimization
              and content generation; you agree not to use our Service to create
              competing AI or machine-learning models.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Prohibited Conduct
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              When using our Services you must not:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-[16px] font-semibold text-black mb-2 leading-[120%] tracking-normal font-inter">
                  Infringe Rights:
                </h3>
                <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
                  Violate any intellectual property, privacy, publicity or other
                  legal rights. Do not upload or distribute content that you do not
                  have the right to use.
                </p>
              </div>
              <div>
                <h3 className="text-base md:text-[16px] font-semibold text-black mb-2 leading-[120%] tracking-normal font-inter">
                  Illegal or Harmful Activity:
                </h3>
                <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
                  Use the Service for illegal purposes or in a way that could harm
                  others. This includes sending spam, viruses, malware, or other
                  harmful code.
                </p>
              </div>
              <div>
                <h3 className="text-base md:text-[16px] font-semibold text-black mb-2 leading-[120%] tracking-normal font-inter">
                  Security Violations:
                </h3>
                <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
                  Attempt to bypass, disable or reverse-engineer any security
                  features or technical protections of the Service. Do not
                  interfere with or disrupt the Service.
                </p>
              </div>
              <div>
                <h3 className="text-base md:text-[16px] font-semibold text-black mb-2 leading-[120%] tracking-normal font-inter">
                  Automated Access:
                </h3>
                <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
                  Use bots, scrapers or other automated means beyond our provided
                  interfaces to access or collect data from the Service.
                </p>
              </div>
              <div>
                <h3 className="text-base md:text-[16px] font-semibold text-black mb-2 leading-[120%] tracking-normal font-inter">
                  Misrepresentation:
                </h3>
                <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
                  Do not misrepresent that content from Marqait is human-generated
                  if it was produced by AI. Do not remove any legal or proprietary
                  notices.
                </p>
              </div>
            </div>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mt-4">
              We reserve the right to suspend or terminate accounts that violate
              any of these rules.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              User Content and License
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              If you submit or upload any content to Marqait (such as campaign
              data, images, text, or files), you retain ownership of that content.
              By providing content to our Service, you grant Marqait and its
              affiliates a worldwide, royalty-free, non-exclusive license to use,
              copy, reproduce, process, adapt, publish, transmit and display your
              content as needed to operate and improve the Service.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              This license allows us to store and share your content (for example,
              across your devices or with team members in your organization) and to
              include it in aggregated analytics. You represent and warrant that
              you have all necessary rights to your content and that uploading it
              does not violate any laws or third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Intellectual Property
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              Marqait (and its licensors) exclusively own all rights to the
              Service, including its software, design, text, graphics, logos, and
              trademarks. These materials are protected by copyright, trademark and
              other laws (including Indian copyright and trademark law).
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              Except as expressly provided in these Terms, you may not copy,
              modify, distribute, sell or lease any part of the Service or its
              content. All trademarks and brands displayed on the Service are the
              property of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Third-Party Services and Links
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              Our Service may contain links to third-party websites or integrate
              third-party services (for example, social media platforms, payment
              gateways or analytics tools). We do not control those third parties
              and are not responsible for their content or practices.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              When you access a third-party service, you do so at your own risk and
              should review that service's terms and privacy policy. Marqait is not
              liable for any transactions, damages or disputes arising from use of
              third-party sites or services.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Service Termination
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              We may suspend or terminate your access and/or account at any time,
              without notice or liability, for any reason (such as if you breach
              these Terms). Upon termination, your right to use the Service ceases
              immediately.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              You may also terminate your account at any time by discontinuing use
              of the Service. Upon termination, any licenses granted to you will
              end and you must cease all use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Warranty Disclaimer
            </h2>
            <p className="text-base md:text-[16px] font-semibold leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              Important: The Service is provided "AS IS" and "AS AVAILABLE" without
              any warranty of any kind.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              To the fullest extent permitted by law, Marqait and its affiliates
              disclaim all warranties, whether express or implied, including
              warranties of merchantability, fitness for a particular purpose,
              title, and non-infringement. We do not guarantee that the Service
              will meet your requirements or be uninterrupted, secure, or
              error-free.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              You agree that your use of the Service is at your sole risk and that
              Marqait is not responsible for any third-party content or services
              you access through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Limitation of Liability
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              Except where prohibited by law, in no event will Marqait or its
              suppliers be liable for any indirect, incidental, special,
              consequential or punitive damages arising out of your use of the
              Service. This includes damages for loss of profits, business
              interruption, loss of data, or other intangible losses, even if we
              have been advised of the possibility of such damages.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              Our total aggregate liability for any claim arising from the Service
              will not exceed the amount you have paid us (if any) in the twelve
              months preceding the claim, or $100 if you have not paid us. Some
              jurisdictions do not allow exclusion of certain warranties or
              limitation of liability, so these limitations may not apply to you.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Governing Law and Disputes
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              These Terms are governed by the laws of India (without regard to
              conflict of laws). You agree that any dispute arising out of or
              related to these Terms or your use of the Service will first be
              addressed by contacting us to seek a resolution.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              If we cannot resolve the dispute informally, then both you and
              Marqait agree to binding arbitration in India (or another forum as
              required by applicable law). This section does not limit your right
              to seek injunctive relief in a court of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-[20px] font-semibold text-black mb-4 leading-[120%] tracking-normal font-inter">
              Modifications to Terms
            </h2>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E] mb-4">
              We may update these Terms from time to time at our discretion. If we
              make material changes, we will provide reasonable notice (for
              example, by email or posting a notice at least 30 days before the new
              terms take effect). What constitutes a "material change" is up to us,
              but may include changes to pricing, fees or key features.
            </p>
            <p className="text-sm md:text-[14px] font-normal leading-[160%] tracking-normal font-inter text-[#11001E]">
              Your continued use of the Service after such notice will mean you
              accept the revised Terms. If you do not agree to any changes, you
              must stop using the Service.
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
