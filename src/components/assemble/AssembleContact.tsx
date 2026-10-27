"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import * as THREE from "three";
import SectionShell from "./SectionShell";
import TiltCard from "./TiltCard";
import { ASSEMBLE_SECTIONS } from "./config";
import { socialLinks } from "@/utils/constrants/data";
import {
  IconMail,
  IconMapPin,
  IconSend,
  IconCheck,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { CUBE_PALETTE } from "@/components/cube/palette";

// 6 Cube sticker colors for confetti burst
const CONFETTI_COLORS = [
  CUBE_PALETTE.F.hex, // Green
  CUBE_PALETTE.L.hex, // Orange
  CUBE_PALETTE.U.hex, // Slate White
  CUBE_PALETTE.R.hex, // Red
  CUBE_PALETTE.D.hex, // Yellow
  CUBE_PALETTE.B.hex, // Blue
];

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  alpha: number;
}

function ContactFinaleCube() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDisposed = false;
    let animId: number | null = null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 6.6);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
      renderer.setSize(260, 260, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    } catch {
      return;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.0);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7590b8, 0.9);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    const { createCube, disposeCube } = require("@/components/cube/cube");
    const cubeInstance = createCube(4);
    scene.add(cubeInstance.cubeGroup);

    // Initial orientation: Face B (Contact)
    cubeInstance.cubeGroup.rotation.set(0.18, 3.34, 0);

    const render = (time: number) => {
      if (isDisposed) return;
      // Gentle subtle wobble
      cubeInstance.cubeGroup.rotation.y = 3.34 + Math.sin(time * 0.001) * 0.15;
      cubeInstance.cubeGroup.rotation.x = 0.18 + Math.cos(time * 0.0008) * 0.08;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isDisposed = true;
      if (animId !== null) cancelAnimationFrame(animId);
      disposeCube(cubeInstance);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center mb-2">
      {/* Subtle Glow Backdrop */}
      <div
        className="absolute inset-0 rounded-full blur-2xl bg-blue-500/25 pointer-events-none"
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full block filter drop-shadow-xl"
      />
    </div>
  );
}

export default function AssembleContact() {
  const section = ASSEMBLE_SECTIONS[5]; // Face B · Cobalt Blue · Contact

  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // 6-Color Confetti Burst Animation
  const triggerConfetti = () => {
    if (reducedMotion) return;
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 500;

    const particles: ConfettiParticle[] = [];
    const count = 48;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 4 + Math.random() * 7;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 6 + Math.random() * 6,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        alpha: 1.0,
      });
    }

    const startTime = performance.now();
    const duration = 950; // Under 1s

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = elapsed / duration;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (progress < 1) {
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18; // gravity
          p.rotation += p.rotSpeed;
          p.alpha = Math.max(0, 1 - progress * 1.1);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        });

        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(frame);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Please enter your name";
    if (!formData.email.trim()) {
      errs.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) errs.subject = "Please enter a subject";
    if (!formData.message.trim()) errs.message = "Please enter your message";
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    // Simulate fast dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      triggerConfetti();
    }, 600);
  };

  const getSocialIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("github")) return <IconBrandGithub size={20} />;
    if (n.includes("linkedin")) return <IconBrandLinkedin size={20} />;
    if (n.includes("twitter") || n.includes("x")) return <IconBrandTwitter size={20} />;
    return <IconBrandInstagram size={20} />;
  };

  return (
    <SectionShell section={section} hideDefaultHeader>
      <div className="flex flex-col items-center">
        {/* 🔹 Contact Finale Eyebrow & Solved Heading */}
        <header className="mb-10 sm:mb-14 flex flex-col items-center text-center">
          {/* Centered Solved 3D Cube */}
          <ContactFinaleCube />

          {/* Eyebrow Line */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/90 shadow-2xs mb-3">
            <span className="w-2 h-2 rounded-[2px] bg-blue-600 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-blue-700 uppercase">
              Solved.
            </span>
            <span className="text-xs text-gray-400 font-mono">• Face B</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-3">
            LET&apos;S BUILD SOMETHING
          </h2>

          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
            Have an idea, a project, or an engineering challenge that needs solving?
            I&apos;d love to connect and build something impactful together.
          </p>
        </header>

        {/* 🔹 Single Wide Card Layout */}
        <div className="w-full max-w-5xl relative">
          <TiltCard className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-blue-200/90 shadow-xl overflow-hidden">
            {/* Confetti Overlay Canvas */}
            <canvas
              ref={confettiCanvasRef}
              className="absolute inset-0 pointer-events-none z-30 w-full h-full"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Contact Details & Social Row */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full gap-8 border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8">
                <div>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-blue-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-[2px] bg-blue-600" />
                    <span>Direct Inquiries</span>
                  </h3>

                  {/* Email */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0 border border-blue-100 shadow-2xs">
                      <IconMail size={22} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">
                        EMAIL
                      </h4>
                      <a
                        href="mailto:ajaymaharjan758@gmail.com"
                        className="text-base sm:text-lg font-bold text-gray-900 hover:text-blue-600 transition break-all"
                      >
                        ajaymaharjan758@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0 border border-blue-100 shadow-2xs">
                      <IconMapPin size={22} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">
                        LOCATION
                      </h4>
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        Kathmandu, Nepal
                      </p>
                      <span className="text-xs text-gray-500 font-mono">
                        Available for remote worldwide
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Icons Row */}
                <div>
                  <h4 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-3">
                    CONNECT SOCIALLY
                  </h4>
                  <div className="flex items-center gap-2.5">
                    {socialLinks?.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.route}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl bg-gray-50 hover:bg-blue-600 text-gray-700 hover:text-white border border-gray-200/90 flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-md hover:scale-105 cursor-pointer"
                        aria-label={`Visit my ${item.name}`}
                      >
                        {getSocialIcon(item.name)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Form */}
              <div className="lg:col-span-7">
                {isSuccess ? (
                  <div className="py-12 px-6 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md animate-bounce">
                      <IconCheck size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 max-w-md text-sm leading-relaxed">
                      Thank you for reaching out. I&apos;ve received your message and will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="mt-4 px-6 py-2.5 rounded-xl border border-blue-300 text-blue-700 hover:bg-blue-50 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-mono font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ajay Maharjan"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.name ? "border-red-500 bg-red-50/30" : "border-gray-200 bg-white"
                          } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900 transition`}
                        />
                        {errors.name && (
                          <span className="text-[11px] text-red-600 mt-1 block font-mono">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-mono font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ajay@example.com"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.email ? "border-red-500 bg-red-50/30" : "border-gray-200 bg-white"
                          } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900 transition`}
                        />
                        {errors.email && (
                          <span className="text-[11px] text-red-600 mt-1 block font-mono">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Project Discussion / Full-Stack Role"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.subject ? "border-red-500 bg-red-50/30" : "border-gray-200 bg-white"
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900 transition`}
                      />
                      {errors.subject && (
                        <span className="text-[11px] text-red-600 mt-1 block font-mono">
                          {errors.subject}
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Message *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project, timeline, or engineering goals..."
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.message ? "border-red-500 bg-red-50/30" : "border-gray-200 bg-white"
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900 transition resize-none`}
                      />
                      {errors.message && (
                        <span className="text-[11px] text-red-600 mt-1 block font-mono">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Submit Button (Orange Primary) */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 py-3.5 px-8 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm tracking-wider uppercase transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-orange-500"
                    >
                      {isSubmitting ? (
                        <span>SENDING MESSAGE...</span>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <IconSend size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </SectionShell>
  );
}
