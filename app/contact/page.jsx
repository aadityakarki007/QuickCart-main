'use client'

import React, { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    emailjs.sendForm(
      'service_tnbvvb6',               // ✅ updated service ID
      'template_axr0n9t',              // ✅ updated template ID
      form.current,
      'DFAbCJPUHm3j6PS8y'              // ✅ updated public key
    )
      .then(() => {
        setSuccess("✅ Message sent successfully!");
        setLoading(false);
        e.target.reset();
      })
      .catch((err) => {
        console.error("❌ EmailJS Error:", err);
        setError("❌ Failed to send message. Please try again.");
        setLoading(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-10">
        <div className="mb-6">
          <p className="text-2xl font-medium">Contact Us</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full mt-1 ml-16"></div>
        </div>

        {/* Flex container for form and contact info */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
          
          {/* Contact Form - Left Side */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-lg p-8">
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div>
                <label htmlFor="user_name" className="block mb-2">Name</label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="user_email" className="block mb-2">Email</label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Your email"
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 resize-none"
                  placeholder="Your message"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {success && <p className="text-green-600 mt-4">{success}</p>}
              {error && <p className="text-red-600 mt-4">{error}</p>}
            </form>
          </div>

          {/* Contact Info - Right Side */}
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl shadow-lg p-8 space-y-6">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>

            <div>
              <p className="font-medium text-gray-700 mb-1">📞 Phone:</p>
              <p className="text-gray-600">+977 9828086387</p>
              <p className="text-gray-600">+977 9840186285</p>
            </div>

            <div>
              <p className="font-medium text-gray-700 mb-1">📧 Email:</p>
              <p className="text-gray-600">service.ehopnepal@gmail.com</p>
              
            </div>

            <div>
              <p className="font-medium text-gray-700 mb-1">🏠 Address:</p>
              <p className="text-gray-600">Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
