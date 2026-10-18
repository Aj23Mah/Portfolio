"use client";
import React, { useState } from "react";
import { IconMail, IconMapPin, IconSend, IconCheck } from "@tabler/icons-react";
import { socialLinks } from "@/utils/constrants/data";
import { motion, useReducedMotion } from "motion/react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/utils/motion";

export interface ContactProps {
  idPrefix?: string;
}

export default function Contact({ idPrefix }: ContactProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const sectionId = idPrefix ? `${idPrefix}-contact` : "contact";
  const nameId = idPrefix ? `${idPrefix}-name` : "name";
  const emailId = idPrefix ? `${idPrefix}-email` : "email";
  const messageId = idPrefix ? `${idPrefix}-message` : "message";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

    const mailtoUrl = `mailto:ajaymaharjan758@gmail.com?subject=${encodeURIComponent(
      `Project Inquiry from ${formData.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoUrl;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const isOverlay = Boolean(idPrefix);

  return (
    <section id={sectionId} className="container mx-auto py-16 px-5 md:px-10">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerItemVariants}
      >
        <h2 className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-wider text-gray-900 mb-3">
          LET'S BUILD SOMETHING
        </h2>
        <p className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed">
          Have an idea, a project, or a problem that needs solving? I’d love to hear about it.
        </p>
        <p className="text-primary font-semibold text-sm sm:text-base mt-1">
          Let’s turn your idea into something useful.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainerVariants}
      >
        {/* Contact Info Card */}
        <motion.div
          variants={staggerItemVariants}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-900 mb-6 border-b pb-3">
              CONTACT DETAILS
            </h3>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shrink-0">
                <IconMail size={26} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">EMAIL</h4>
                <a
                  href="mailto:ajaymaharjan758@gmail.com"
                  className="text-base sm:text-lg font-bold text-gray-900 hover:text-orange-600 transition"
                >
                  ajaymaharjan758@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shrink-0">
                <IconMapPin size={26} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">LOCATION</h4>
                <p className="text-base sm:text-lg font-bold text-gray-900">Kathmandu, Nepal</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">CONNECT SOCIALLY</h4>
            <div className="flex gap-3">
              {socialLinks.map((item: any, key: number) => (
                <motion.a
                  key={key}
                  href={item.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  onMouseEnter={() => setHoveredSocial(key)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    backgroundColor: hoveredSocial === key ? item.color : "#f3f4f6",
                  }}
                  className={`p-3 rounded-2xl transition duration-200 w-12 h-12 flex items-center justify-center ${
                    hoveredSocial === key ? "text-white" : "text-gray-700"
                  }`}
                  title={item.name}
                >
                  {item.icons}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={staggerItemVariants}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-gray-200"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor={nameId} className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                NAME *
              </label>
              <input
                type="text"
                id={nameId}
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor={emailId} className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                EMAIL *
              </label>
              <input
                type="email"
                id={emailId}
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor={messageId} className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                MESSAGE *
              </label>
              <textarea
                id={messageId}
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project or idea..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm text-gray-900 bg-white resize-none"
              />
            </div>

            <motion.button
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              type="submit"
              className="mt-2 w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-primary text-white font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg uppercase text-xs tracking-wider cursor-pointer"
            >
              {submitted ? (
                <>
                  <IconCheck size={18} /> SENT VIA EMAIL CLIENT!
                </>
              ) : (
                <>
                  SEND MESSAGE →
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
}
