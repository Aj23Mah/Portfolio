import React from "react";
import Image from "next/image";
import { IconCheck, IconBriefcase2, IconSchool, IconMail, IconMapPin } from "@tabler/icons-react";
import {
  projectData,
  serviceData,
  socialLinks,
  whatIDo,
  experiencesList,
  educationList,
  toolsList,
} from "@/utils/constrants/data";
import ClassicContactForm from "./ClassicContactForm";

/**
 * Pure Server-Rendered Classic Sections for SEO & Progressive Enhancement.
 * 
 * Converted to a React Server Component (no 'use client') to completely eliminate
 * client hydration cost in Cube mode while ensuring 100% of the content is in static HTML
 * without initial opacity:0.
 * 
 * In Cube mode with JS enabled, CSS (html.js:not(.classic-mode) #classic-sections) hides
 * this container without requiring React hydration or runtime unmounting.
 * In Classic mode or when JS is disabled, this container is rendered as block.
 */
export default function ClassicSections() {

  return (
    <div id="classic-sections" className="classic-sections-container bg-paper-texture">
      {/* 1. ABOUT SECTION */}
      <section id="about" className="container mx-auto py-16 md:px-0 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="roboto-slab-semibold">
            <div className="md:text-[2.5rem] sm:text-[2rem] text-[1.5rem] text-gray-700/50 font-bold sticky top-28">
              Besides, considering your <span className="text-primary">duty</span>, as a warrior you
              should not waver. Indeed, for a <span className="text-primary">warrior</span>, there is
              no better engagement than fighting for{" "}
              <span className="text-primary">upholding of righteousness</span>.
              <p className="text-2xl font-bold text-gray-700/50 mt-2">— BG 2.31</p>
            </div>
          </div>

          <div>
            <h2 className="md:text-[2.5rem] text-3xl font-bold mb-4 text-gray-900">
              About Me
            </h2>
            <div className="md:text-2xl text-xl text-gray-800 leading-relaxed">
              <p className="mb-4">
                Bringing life to code and building bridges between technology and user comfort! Hi,
                I&apos;m Ajay Kumar Maharjan, a full-stack JavaScript developer targeting the essence
                of innovation through my skills in MERN Stack. Born and raised in the tech heartbeat
                of Kathmandu, I currently enhance web applications with a flair for dynamic,
                user-centric solutions.
              </p>
              <p className="mb-6">
                Since commencing my educational journey in Information Management, I&apos;ve embraced
                every learning opportunity and technological challenge, turning them into stepping
                stones toward becoming an expert in my field. Throughout my career, my projects have
                not just been tasks, but adventures in creating impactful tech that addresses real-world
                needs.
              </p>
            </div>

            <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-6 sm:p-8 mt-6">
              <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-gray-900 border-b border-orange-200/60 pb-3">
                Core Capabilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whatIDo.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-800">
                    <span className="p-1 bg-orange-500 text-white rounded-full shrink-0">
                      <IconCheck size={14} stroke={3} />
                    </span>
                    <span>{capability}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPERIENCE SECTION */}
      <section id="experience" className="container mx-auto py-16 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-bold text-primary uppercase tracking-widest text-xs sm:text-sm mb-2">
              CAREER PATH
            </div>
            <h2 className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-wider text-gray-900">
              Work Experience &amp; Certifications
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
              Practical development background, professional roles, and verified technical credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="text-2xl font-bold flex gap-3 items-center text-gray-900 border-b border-gray-200 pb-3">
                <span className="p-2 bg-orange-100 text-primary rounded-xl">
                  <IconBriefcase2 size={24} />
                </span>
                <span>Work Experience</span>
              </div>
              <div className="flex flex-col gap-4">
                {experiencesList.map((exp, index) => (
                  <div key={index} className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      {exp.duration}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.label}</h3>
                    <div className="text-sm text-gray-600 font-medium mb-2">
                      {exp.company} • {exp.location}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="text-2xl font-bold flex gap-3 items-center text-gray-900 border-b border-gray-200 pb-3">
                <span className="p-2 bg-orange-100 text-primary rounded-xl">
                  <IconSchool size={24} />
                </span>
                <span>Certifications</span>
              </div>
              <div className="flex flex-col gap-4">
                {educationList.map((edu, index) => (
                  <div key={index} className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      {edu.year}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.course}</h3>
                    <div className="text-sm text-gray-600 font-medium">
                      {edu.studyAt} • {edu.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INFINITE MARQUEE */}
      <section className="w-full container mx-auto py-10">
        <div className="scroller" data-direction="left">
          <ul className="tag-list scroller__inner">
            {["HTML", "CSS", "JS", "webdev", "React", "Next", "Node", "Express", "Nest", "scss", "animation", "Tailwind", "Bootstrap", "Mantine UI", "Material UI"].map((tag, i) => (
              <li key={i}>{tag}</li>
            ))}
          </ul>
        </div>
        <div className="scroller" data-direction="right">
          <ul className="tag-list scroller__inner">
            {["HTML", "CSS", "JS", "webdev", "React", "Next", "Node", "Express", "Nest", "scss", "animation", "Tailwind", "Bootstrap", "Mantine UI", "Material UI"].map((tag, i) => (
              <li key={i}>{tag}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. PROJECTS / SELECTED WORK */}
      <section id="projects" className="py-20 px-5 md:px-[8vw] lg:px-[10vw] xl:px-[12vw] bg-gray-950 text-white dark project-bg">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-widest text-primary mb-3">
            SELECTED WORK
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            A selection of projects where I&apos;ve combined development, problem-solving, and thoughtful user experience to build useful digital products.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {projectData?.map((v: any, key: number) => (
            <div
              key={key}
              className="sticky top-28 grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-3xl p-6 sm:p-8 lg:p-10 project-card bg-gray-900 border border-gray-800 shadow-2xl transition duration-300 group"
            >
              <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-xl border border-gray-800 flex items-center justify-center bg-gray-950 order-1 lg:order-2">
                <div className="w-full h-full">
                  <Image
                    src={v.image}
                    alt={v.title}
                    width={800}
                    height={500}
                    className="w-full h-auto max-h-[360px] object-cover rounded-2xl"
                    priority={key === 0}
                  />
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between order-2 lg:order-1">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{v.title}</h3>
                  {(v.category || v.badge) && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-950/80 border border-orange-800/60 px-3 py-1 rounded-full">
                        {v.category || v.badge}
                      </span>
                    </div>
                  )}
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">{v.description}</p>

                  {v.role && (
                    <div className="mb-4 bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/80 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ROLE</span>
                      <span className="text-xs sm:text-sm font-bold text-orange-300">{v.role}</span>
                    </div>
                  )}

                  {v.technologies && (
                    <div className="mb-6">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">TECHNOLOGIES</span>
                      <div className="flex flex-wrap gap-2">
                        {v.technologies.map((t: string, i: number) => (
                          <span key={i} className="text-xs font-semibold px-3 py-1 bg-gray-800 border border-gray-700 text-orange-300 rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {v.link && (
                    <a
                      href={v.link}
                      className="inline-flex items-center gap-2 bg-orange-600 hover:bg-primary text-white py-2.5 px-5 rounded-xl font-bold transition shadow-md text-xs sm:text-sm uppercase tracking-wider group/btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>LIVE DEMO</span>
                      <span>→</span>
                    </a>
                  )}
                  {v.github && (
                    <a
                      href={v.github}
                      className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-5 rounded-xl font-bold transition border border-gray-700 text-xs sm:text-sm uppercase tracking-wider group/btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>VIEW CODE</span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white rounded-3xl p-8 sm:p-10 text-center shadow-2xl border border-gray-800">
          <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider mb-3 text-primary">
            HAVE A PROJECT IN MIND?
          </h3>
          <p className="text-gray-300 text-base sm:text-lg mb-6 max-w-xl mx-auto">
            Let&apos;s create something useful, reliable, and worth using.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-primary text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition duration-200 uppercase text-xs sm:text-sm tracking-wider cursor-pointer"
          >
            GET IN TOUCH →
          </a>
        </div>
      </section>

      {/* 5. SERVICES / WHAT I CAN DO */}
      <section id="services" className="container mx-auto py-16 px-5">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-wider text-gray-900 mb-3">
            WHAT I CAN DO
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            From frontend interfaces to backend systems, I build the pieces that turn an idea into a working digital product.
          </p>
        </div>

        <div className="parallex_setupItems">
          {serviceData?.map((v: any, key: number) => (
            <div key={key} className="setUp_items relative group cursor-pointer">
              {v.number && (
                <span className="absolute top-4 right-4 text-sm font-extrabold text-orange-600/70 tracking-widest">
                  {v.number}
                </span>
              )}
              {v.img && (
                <Image
                  src={v.img}
                  alt={v.title}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              )}
              <h3 className="mt-4 font-bold text-xl text-gray-900">{v.title}</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TOOLS & TECHNOLOGIES */}
      <section id="tools" className="container mx-auto py-16 sm:px-0 px-5">
        <div id="skills" className="sr-only" aria-hidden="true" />
        <div className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-wider text-center mb-8 text-gray-900">
          TOOLS &amp; TECHNOLOGIES
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 justify-center gap-5">
          {toolsList.map((v, key) => (
            <div
              key={key}
              className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-3 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center transition group-hover:scale-105">
                <Image
                  src={v.img}
                  alt={v.name}
                  width={64}
                  height={64}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-600 transition">
                {v.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section id="contact" className="container mx-auto py-16 px-5 md:px-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-wider text-gray-900 mb-3">
            LET&apos;S BUILD SOMETHING
          </h2>
          <p className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed">
            Have an idea, a project, or a problem that needs solving? I’d love to hear about it.
          </p>
          <p className="text-primary font-semibold text-sm sm:text-base mt-1">
            Let’s turn your idea into something useful.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col justify-between">
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
                  <a href="mailto:ajaymaharjan758@gmail.com" className="text-base sm:text-lg font-bold text-gray-900 hover:text-orange-600 transition">
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
                {socialLinks.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl transition duration-200 w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-orange-500 hover:text-white bg-gray-100"
                    title={s.name}
                  >
                    {s.icons}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-gray-200">
            <ClassicContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
