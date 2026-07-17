"use client";

import { useState } from "react";
import contactMessageService from "@/app/store/services/contactMessageService";

const initialFormState = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const response = await contactMessageService.createMessage(formData);
      setSubmitSuccess(
        response.message || "Your message has been sent successfully."
      );
      setFormData(initialFormState);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "We could not send your message right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="layout-pt-lg layout-pb-lg">
      <div className="container">
        <div className="row justify-center">
          <div className="col-lg-8">
            <h2 className="text-30 fw-700 text-center mb-30">
              Leave us your info
            </h2>

            <div className="contactForm">
              <form onSubmit={handleSubmit} className="row y-gap-30">
                <div className="col-md-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                {(submitError || submitSuccess) && (
                  <div className="col-12">
                    <div
                      className={`rounded-12 px-20 py-15 text-14 ${
                        submitError
                          ? "bg-red-1 text-red-2"
                          : "bg-green-1 text-green-2"
                      }`}
                    >
                      {submitError || submitSuccess}
                    </div>
                  </div>
                )}
                <div className="col-12">
                  <p className="text-14 text-center text-light-1 mb-0">
                    Messages sent here will appear in your dashboard inbox.
                  </p>
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button -md -dark-1 bg-accent-1 text-white col-12"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
