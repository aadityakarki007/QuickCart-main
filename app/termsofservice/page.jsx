'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 bg-white shadow-md rounded-md my-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-green-600 pb-3">
          Terms of Service
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing or using <strong className="text-green-700">Hamro eShop</strong> (the “Service”), you agree to be bound by these Terms of Service (“Terms”) and our Privacy Policy. If you do not agree to these Terms, you must not use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Eligibility</h2>
          <p className="text-gray-600 leading-relaxed">
            You represent and warrant that you are at least eighteen (18) years of age and have full legal capacity to enter into these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Account Security</h2>
          <p className="text-gray-600 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities occurring under your account. You agree to notify us immediately of any unauthorized use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Orders and Payments</h2>
          <p className="text-gray-600 leading-relaxed">
            All orders are subject to acceptance and availability. Prices are subject to change without notice. Payment must be received in full prior to shipment. We reserve the right to refuse or cancel any order at our sole discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Shipping and Delivery</h2>
          <p className="text-gray-600 leading-relaxed">
            We will make reasonable efforts to ship your orders within estimated time frames, but we do not guarantee delivery dates. We are not liable for delays caused by carriers or unforeseen circumstances.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Returns and Refunds</h2>
          <p className="text-gray-600 leading-relaxed">
            Returns and refunds are governed by our <a href="/return-policy" className="text-green-600 underline hover:text-green-800">Return Policy</a>. We reserve the right to reject returns not in compliance with our policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Intellectual Property Rights</h2>
          <p className="text-gray-600 leading-relaxed">
            All content, including but not limited to text, graphics, logos, images, audio clips, and software on this website, is the property of <strong className="text-green-700">Hamro eShop</strong> or its licensors and is protected by applicable intellectual property laws. Unauthorized use is strictly prohibited.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            To the fullest extent permitted by law, <strong className="text-green-700">Hamro eShop</strong> shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to loss of profits, data, or goodwill.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Indemnification</h2>
          <p className="text-gray-600 leading-relaxed">
            You agree to indemnify, defend, and hold harmless <strong className="text-green-700">Hamro eShop</strong>, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of the Service or breach of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Governing Law and Jurisdiction</h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of Nepal. You agree that any disputes arising hereunder shall be resolved exclusively in the courts of Nepal.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Modification of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service following any changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed">
            For any questions or concerns regarding these Terms, please contact us at{' '}
            <a href="mailto:service.eshopnepal@gmail.com" className="text-green-600 underline hover:text-green-800">
              service.eshopnepal@gmail.com
            </a>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;
