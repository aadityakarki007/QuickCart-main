'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 bg-white shadow-md rounded-md my-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-green-600 pb-3">
          Terms & Conditions
        </h1>

        <p className="text-gray-700 leading-relaxed mb-8 text-lg">
          Welcome to <strong className="text-green-700">Hamro eShop</strong>. By using our website and services, you agree to the following terms and conditions. Please read them carefully.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Use of the Website</h2>
          <p className="text-gray-600 leading-relaxed">
            You must be at least 18 years old or under the supervision of a parent or legal guardian to use this site. You agree not to misuse the website or its services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Product Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We strive to display accurate product details, but we do not guarantee that descriptions, pricing, or availability are always accurate. Errors may occur and we reserve the right to correct them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Orders and Payments</h2>
          <p className="text-gray-600 leading-relaxed">
            Placing an order means you agree to purchase products under these terms. We reserve the right to cancel or refuse any order. All prices are in NPR and include applicable taxes unless stated otherwise.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Shipping and Delivery</h2>
          <p className="text-gray-600 leading-relaxed">
            Delivery timelines may vary depending on location and product availability. We are not liable for delays caused by courier services or unforeseen events.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Returns and Refunds</h2>
          <p className="text-gray-600 leading-relaxed">
            Please refer to our{' '}
            <a
              href="/return-policy"
              className="text-green-600 underline hover:text-green-800 transition"
            >
              Return Policy
            </a>{' '}
            for detailed information. We process refunds within a reasonable timeframe upon product return or issue resolution.
          </p>
        </section>

        <section className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
  <p className="text-gray-600 leading-relaxed">
    All original content on this website — including our logos, written descriptions, and store-brand product images — is the property of <strong className="text-green-700">Hamro eShop</strong> and protected by copyright laws.
    <br /><br />
    Some product images or descriptions may be sourced from trusted platforms such as Daraz or supplier catalogs, and are used solely for reference, promotion, or product display. We do not claim ownership over such third-party content.
    <br /><br />
    If you are a content owner and believe your rights have been infringed, please contact us at{' '}
    <a href="mailto:service.eshopnepal@gmail.com" className="text-green-600 underline hover:text-green-800 transition">
      service.eshopnepal@gmail.com
    </a> for prompt resolution.
  </p>
</section>


        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            Hamro eShop is not liable for any indirect, incidental, or consequential damages resulting from your use of our site or products.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Modifications</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update or change these Terms at any time. It is your responsibility to review them periodically. Continued use of our services indicates acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Contact Information</h2>
  <p className="text-gray-600 leading-relaxed">
    If you have questions or concerns about these Terms, contact us at{' '}
    <a href="mailto:service.eshopnepal@gmail.com" className="text-green-600 underline hover:text-green-800 transition">
      service.eshopnepal@gmail.com
    </a>.
  </p>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. User Accounts & Security</h2>
  <p className="text-gray-600 leading-relaxed">
    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use or security breach.
  </p>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Prohibited Activities</h2>
  <p className="text-gray-600 leading-relaxed">
    You agree not to use our website for any unlawful purpose, including but not limited to fraud, spamming, hacking, or distributing malware. We reserve the right to suspend or terminate accounts involved in prohibited activities.
  </p>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Third-Party Links</h2>
  <p className="text-gray-600 leading-relaxed">
    Our website may include links to third-party websites or services for your convenience or reference. Please note that we do not control these external sites and are not responsible for their content, privacy policies, or business practices. Accessing such links is at your own risk.
  </p>
</section>


<section className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Privacy Policy</h2>
  <p className="text-gray-600 leading-relaxed">
    Your use of our website is also governed by our <a href="/privacy-policy" className="text-green-600 underline hover:text-green-800 transition">Privacy Policy</a>. Please review it to understand how we collect, use, and protect your information.
  </p>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-900 mb-3">14. Governing Law & Jurisdiction</h2>
  <p className="text-gray-600 leading-relaxed">
    These Terms & Conditions are governed by the laws of Nepal. Any disputes arising from your use of our services will be subject to the exclusive jurisdiction of the courts of Nepal.
  </p>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-900 mb-3">14. Governing Law</h2>
  <p className="text-gray-600 leading-relaxed">
    These Terms and Conditions shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising out of or related to the use of this website shall be subject to the exclusive jurisdiction of the courts of Nepal.
  </p>
</section>

      </main>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
