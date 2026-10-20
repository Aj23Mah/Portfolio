"use client";
import React, { useState } from "react";
import { IconCheck } from "@tabler/icons-react";

export default function ClassicContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const mailtoUrl = `mailto:ajaymaharjan758@gmail.com?subject=${encodeURIComponent(
      `Project Inquiry from ${formData.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoUrl;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      action="mailto:ajaymaharjan758@gmail.com"
      method="GET"
      className="flex flex-col gap-5"
    >
      <div>
        <label
          htmlFor="classic-name"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
        >
          NAME *
        </label>
        <input
          type="text"
          id="classic-name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm text-gray-900 bg-white"
        />
      </div>

      <div>
        <label
          htmlFor="classic-email"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
        >
          EMAIL *
        </label>
        <input
          type="email"
          id="classic-email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm text-gray-900 bg-white"
        />
      </div>

      <div>
        <label
          htmlFor="classic-message"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
        >
          MESSAGE *
        </label>
        <textarea
          id="classic-message"
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me about your project or idea..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm text-gray-900 bg-white resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-xl bg-orange-600 hover:bg-primary text-white font-bold transition flex items-center justify-center gap-2 shadow-md uppercase text-xs tracking-wider cursor-pointer mt-2"
      >
        {submitted ? (
          <>
            <IconCheck size={18} /> SENT VIA EMAIL CLIENT!
          </>
        ) : (
          <>
            <span>SEND MESSAGE</span>
            <span>→</span>
          </>
        )}
      </button>
    </form>
  );
}
