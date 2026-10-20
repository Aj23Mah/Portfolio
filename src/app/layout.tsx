import type { Metadata } from "next";
import { Roboto_Slab, Smooch, Lovers_Quarrel } from "next/font/google";
import { ViewModeProvider } from "@/context/ViewModeContext";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
});

const smooch = Smooch({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-smooch",
  display: "swap",
});

const loversQuarrel = Lovers_Quarrel({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lovers-quarrel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ajay Kumar Maharjan — Full-Stack Developer & Interactive 3D Portfolio",
  description: "Portfolio of Ajay Kumar Maharjan, Full-Stack JavaScript Developer building modern, scalable, user-focused web applications with an interactive 3D Rubik's cube experience.",
  keywords: [
    "Ajay Kumar Maharjan",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "Three.js",
    "Rubik's Cube",
    "Node.js",
    "Web Development",
    "Kathmandu",
    "Nepal",
  ],
  authors: [{ name: "Ajay Kumar Maharjan" }],
  metadataBase: new URL("https://ajayakumarmaharjan.com.np"),
  openGraph: {
    title: "Ajay Kumar Maharjan — Full-Stack Developer & Interactive 3D Portfolio",
    description: "Explore the modern full-stack web portfolio of Ajay Kumar Maharjan, featuring selected projects, engineering skills, and a playable 3D Rubik's cube.",
    url: "https://ajayakumarmaharjan.com.np",
    siteName: "Ajay Kumar Maharjan Portfolio",
    images: [
      {
        url: "/image/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ajay Kumar Maharjan — Full-Stack Developer & Interactive 3D Portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajay Kumar Maharjan — Full-Stack Developer & Interactive 3D Portfolio",
    description: "Full-Stack Developer portfolio featuring selected web applications and an interactive Three.js Rubik's cube hero element.",
    images: ["/image/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Pre-hydration script: set 'js' and detect saved 'classic-mode' before first render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.add('js');
              try {
                if (window.location.search.includes('mode=classic') || localStorage.getItem('portfolio_view_mode') === 'classic') {
                  document.documentElement.classList.add('classic-mode');
                }
              } catch (e) {}
            `,
          }}
        />
        {/* Progressive enhancement fallback: ensure all content is visible if JS is disabled */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: `
                *, *::before, *::after {
                  opacity: 1 !important;
                  transform: none !important;
                  visibility: visible !important;
                }
              `,
            }}
          />
        </noscript>
      </head>
      <body className={`${robotoSlab.variable} ${smooch.variable} ${loversQuarrel.variable} antialiased`} suppressHydrationWarning>
        <main>
          <ViewModeProvider>
            {children}
          </ViewModeProvider>
        </main>
      </body>
    </html>
  );
}
