"use client";
import Logo from "@/components/partials/logo";
import { useEffect, useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { menuData } from "@/utils/constrants/data";
import { useViewMode } from "@/context/ViewModeContext";

export default function Navbar() {
  const [toggle, setToggle] = useState(false);
  const [active, setActive] = useState("");
  const { mode, toggleMode } = useViewMode();

  // ✅ Navigate to section: in cube mode opens 3D overlay; in classic mode scrolls to section anchor
  const handleScroll = (route: string) => {
    const cleanId = route.startsWith("#") ? route.slice(1) : route;

    if (mode === "cube") {
      // 3D Cube exploration mode: dispatch focus event to stage
      if (typeof window !== "undefined") {
        if (cleanId === "home") {
          window.dispatchEvent(new CustomEvent("cube:close-overlay"));
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.dispatchEvent(
            new CustomEvent("cube:focus-section", {
              detail: { sectionId: cleanId },
            })
          );
        }
      }
    } else {
      // Classic mode: smooth scroll to element on page
      if (cleanId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(cleanId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }

    setToggle(false);
  };

  // ✅ Scroll spy (active section in classic mode)
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
  }, []);

  return (
    <>
      {/* 🔹 Sidebar Navigation */}
      <nav
        id="navbar-container"
        className="fixed left-4 md:left-6 lg:left-8 z-40 min-h-full py-10 flex flex-col justify-between items-center pointer-events-auto"
      >
        {/* Logo */}
        <div>
          <Logo />
        </div>

        {/* 🔹 Menu */}
        <div className="relative">
          {/* Backdrop (mobile UX) */}
          {toggle && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setToggle(false)}
            />
          )}

          {/* Menu Items Full-Screen Drawer */}
          <div
            className={`
              fixed inset-0 z-40
              flex items-center justify-center
              bg-black/80 backdrop-blur-xl
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
                const isActive = active === route;
                return (
                  <button
                    key={key}
                    onClick={() => handleScroll(route)}
                    className={`
                      relative text-3xl md:text-5xl font-bold tracking-wide flex items-center gap-3
                      text-white transition-all duration-300
                      hover:scale-105 hover:text-orange-500 cursor-pointer
                      ${isActive ? "text-orange-500 font-extrabold" : "opacity-80"}
                    `}
                  >
                    {isActive && (
                      <span className="text-orange-500 text-2xl md:text-3xl animate-pulse">
                        ●
                      </span>
                    )}
                    <span>{v.title}</span>
                  </button>
                );
              })}

              {/* View Mode Switcher in Menu Drawer */}
              <div className="pt-6 border-t border-gray-800 flex flex-col items-center">
                <button
                  onClick={() => {
                    toggleMode();
                    setToggle(false);
                  }}
                  className="px-5 py-2.5 rounded-full border border-orange-500/60 bg-orange-950/40 text-orange-400 hover:text-white hover:bg-orange-600 transition text-sm font-mono font-bold flex items-center gap-2 cursor-pointer shadow-lg"
                  aria-label={
                    mode === "cube"
                      ? "Switch to traditional scrollable portfolio"
                      : "Switch to 3D Rubik's cube exploration stage"
                  }
                >
                  {mode === "cube" ? (
                    <>
                      <span>📄</span>
                      <span>Switch to Classic View</span>
                    </>
                  ) : (
                    <>
                      <span>🌐</span>
                      <span>Switch to 3D Explore</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="relative z-50">
            <button
              onClick={() => setToggle(!toggle)}
              aria-label={toggle ? "Close navigation menu" : "Open navigation menu"}
              className="text-3xl bg-primary rounded-full border border-white/20 shadow-lg cursor-pointer text-center p-2 text-gray-100 hover:text-white transition"
            >
              {toggle ? <IconX /> : <IconMenu2 />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
