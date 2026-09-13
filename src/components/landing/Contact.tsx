"use client";
import React, { useState } from "react";
import { IconMail, IconMapPin, IconSend, IconCheck } from "@tabler/icons-react";
import { socialLinks } from "@/utils/constrants/data";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Create mailto link for direct client fallback
    const mailtoUrl = `mailto:ajaymaharjan758@gmail.com?subject=${encodeURIComponent(
      formData.subject || "Contact from Portfolio"
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoUrl;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="container mx-auto py-16 px-5 md:px-10">
      <div className="text-center mb-12">
        <h2 className="md:text-[2.5rem] text-3xl font-bold mb-2">Get in Touch</h2>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Have a project in mind, a question, or just want to connect? Drop a message below or email me directly!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Info Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Details</h3>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <IconMail size={28} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email</h4>
                <a
                  href="mailto:ajaymaharjan758@gmail.com"
                  className="text-lg font-bold text-black hover:text-orange-600 transition"
                >
                  ajaymaharjan758@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <IconMapPin size={28} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Location</h4>
                <p className="text-lg font-bold text-black">Kathmandu, Nepal</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Connect Socially</h4>
            <div className="flex gap-3">
              {socialLinks.map((item: any, key: number) => (
                <a
                  key={key}
                  href={item.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredSocial(key)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    backgroundColor: hoveredSocial === key ? item.color : "#f3f4f6",
                  }}
                  className={`p-3 rounded-2xl transition duration-300 w-12 h-12 flex items-center justify-center ${
                    hoveredSocial === key ? "text-white" : "text-gray-700"
                  }`}
                  title={item.name}
                >
                  {item.icons}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Your Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Project Inquiry / Hello"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="How can I help you?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {submitted ? (
                <>
                  <IconCheck size={20} /> Sent via Email Client!
                </>
              ) : (
                <>
                  <IconSend size={20} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
