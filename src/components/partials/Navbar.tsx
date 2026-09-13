"use client";
import Logo from "@/components/partials/logo";
import { useEffect, useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { menuData } from "@/utils/constrants/data";

export default function Navbar() {

  const [toggle, setToggle] = useState(false);
  const [active, setActive] = useState("");

  // ✅ Scroll to section
  const handleScroll = (route: string) => {
    const cleanId = route.startsWith("#") ? route.slice(1) : route;
    const el = document.getElementById(cleanId);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setToggle(false);
  };

  // ✅ Scroll spy (active section)
  useEffect(() => {
    const handleScrollSpy = () => {
      menuData?.forEach((item: any) => {
        const route = item.route || item.url || item.path || "";
        const cleanId = route.startsWith("#") ? route.slice(1) : route;
        if (!cleanId) return;

        const section = document.getElementById(cleanId);
        if (!section) return;

        const rect = section.getBoundingClientRect();

        if (rect.top <= 200 && rect.bottom >= 100) {
          setActive(route);
        }
      });
    };

    window.addEventListener("scroll", handleScrollSpy);
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [menuData]);

  return (
    <>
      {/* 🔹 Sidebar */}
      <nav className="fixed left-4 md:left-6 lg:left-8 z-50 min-h-full py-10 flex flex-col justify-between items-center">
        {/* Logo */}
        <div>
          <Logo />
        </div>

        {/* 🔹 Menu */}
        <div className="relative">
          {/* Backdrop (mobile UX) */}
          {toggle && (
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setToggle(false)}
            />
          )}

          {/* Menu Items */}
          <div
            className={`
    fixed inset-0 z-40
    flex items-center justify-center
    bg-black/50 backdrop-blur-lg
    transition-all duration-300 ease-in-out
    ${
      toggle
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95 pointer-events-none"
    }
  `}
          >
            <div className="flex flex-col items-center gap-6">
              {menuData?.map((v: any, key: number) => {
                const route = v.route || v.url || v.path || "";
                return (
                  <button
                    key={key}
                    onClick={() => handleScroll(route)}
                    className={`
            text-3xl md:text-5xl font-bold tracking-wide
            text-white transition-all duration-300
            hover:scale-110 hover:text-orange-500
            ${active === route ? "text-orange-500" : ""}
          `}
                  >
                    {v.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle Button */}
          <div className="relative z-50">
            <div
              onClick={() => setToggle(!toggle)}
              className="text-3xl bg-white rounded-full border shadow-lg cursor-pointer text-center p-2 text-orange-700 hover:text-[#576cbc] transition"
            >
              {toggle ? <IconX /> : <IconMenu2 />}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
