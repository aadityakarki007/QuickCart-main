'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ReturnPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 bg-white shadow-md rounded-md my-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-green-600 pb-3">
          Return & Refund Policy
        </h1>

        <p className="text-gray-700 leading-relaxed mb-8 text-lg">
          At <strong className="text-green-700">Hamro eShop</strong>, customer satisfaction is our top priority. If you are not completely satisfied with your purchase, please review our return and refund policy below.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            1. Eligibility for Returns
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Returns are accepted only if the product you received is damaged, defective, or incorrect. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            2. Non-Returnable Items
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The following items are <strong>not eligible</strong> for return or refund:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
            <li>Products returned due to change of mind</li>
            <li>Used, opened, or damaged products (not due to transit or manufacturing defect)</li>
            <li>Products without original packaging, tags, or accessories</li>
            <li>Perishable goods or hygiene-related items</li>
            <li>Items marked as "Final Sale" or "Non-Returnable"</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            3. Return Request Procedure
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To initiate a return, please contact our support team within <strong>7 days</strong> of delivery. Email us at{' '}
            <a href="mailto:service.eshopnepal@gmail.com" className="text-green-600 underline hover:text-green-800">
              service.eshopnepal@gmail.com
            </a>{' '}
            with your order number, a description of the issue, and clear photos of the product and packaging.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            4. Return Approval & Shipping
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Once your return request is reviewed and approved, we will provide instructions for returning the item. Please ensure the product is securely packaged to prevent damage during transit. Return shipping costs may be covered by Hamro eShop if the error is on our part (damaged, defective, or incorrect item).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            5. Refund Process
          </h2>
          <p className="text-gray-600 leading-relaxed">
            After receiving and inspecting your returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed within 3–7 business days via the original payment method, or via bank transfer/store credit for Cash on Delivery orders.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            6. Exchanges
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Exchanges are offered only for damaged, defective, or incorrect products, subject to stock availability. If an exchange is not possible, a refund will be issued.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            7. Contact Us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            For any questions or concerns regarding returns, refunds, or exchanges, please contact our support team at{' '}
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

export default ReturnPolicy;
