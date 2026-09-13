import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ajay Kumar Maharjan — Full Stack JavaScript Developer",
  description: "Portfolio of Ajay Kumar Maharjan, a full-stack JavaScript developer specializing in Next.js, React, Node.js, and modern web application development.",
  keywords: ["Ajay Kumar Maharjan", "Full Stack Developer", "Next.js Developer", "React Developer", "JavaScript", "Kathmandu", "Nepal"],
  authors: [{ name: "Ajay Kumar Maharjan" }],
  metadataBase: new URL("https://portfolio-2aam.vercel.app/"),
  openGraph: {
    title: "Ajay Kumar Maharjan — Full Stack JavaScript Developer",
    description: "Portfolio of Ajay Kumar Maharjan, a full-stack JavaScript developer specializing in Next.js, React, Node.js, and modern web applications.",
    url: "https://portfolio-2aam.vercel.app/",
    siteName: "Ajay Kumar Maharjan Portfolio",
    images: [
      {
        url: "/image/logo.png",
        width: 1200,
        height: 630,
        alt: "Ajay Kumar Maharjan Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={'bg-paper-texture'} suppressHydrationWarning>
          <main>
              {children}
          </main>
      </body>
    </html>
  );
}
