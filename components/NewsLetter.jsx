import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";

const NewsLetter = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs
      .sendForm(
        "service_tnbvvb6",
        "template_axr0n9t",
        form.current,
        "DFAbCJPUHm3j6PS8y"
      )
      .then(
        (result) => {
          setSent(true);
          setLoading(false);
        },
        (error) => {
          alert("Failed to send. Please try again.");
          setLoading(false);
        }
      );
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-semibold text-gray-800">
        Feedback / Suggestion / Help
      </h1>
      <p className="md:text-base text-sm text-gray-500/80 pb-8 max-w-xl">
        Have feedback, suggestions, or need help? Send us your message below and
        our team will get back to you as soon as possible.
      </p>
      {sent ? (
        <div className="text-green-600 text-center font-semibold mt-4">
          Thank you for your feedback!
        </div>
      ) : (
        <form
          ref={form}
          onSubmit={sendEmail}
          className="flex flex-col md:flex-row items-center justify-between max-w-2xl w-full gap-2 md:gap-0 md:h-14 h-auto px-4"
        >
          <input
            className="border border-gray-300 rounded-md h-12 md:h-full border-r-0 outline-none w-full md:rounded-r-none px-3 text-gray-600 mb-2 md:mb-0"
            type="email"
            name="user_email"
            placeholder="Your email address"
            required
          />
          <textarea
            className="border border-gray-300 rounded-md h-20 md:h-full outline-none w-full md:w-2/3 px-3 text-gray-600 mb-2 md:mb-0 md:mx-2"
            name="message"
            placeholder="Your feedback, suggestion, or help request..."
            required
          />
          <button
            type="submit"
            className="md:px-10 px-6 h-12 md:h-full text-white bg-orange-600 rounded-md md:rounded-l-none hover:bg-orange-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsLetter;
