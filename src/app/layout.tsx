import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ajay Kumar Maharjan — Full-Stack Developer",
  description: "Portfolio of Ajay Kumar Maharjan, a Full-Stack Developer building modern, scalable, and user-focused web applications.",
  keywords: ["Ajay Kumar Maharjan", "Full-Stack Developer", "Next.js", "React", "Node.js", "Web Development", "Kathmandu", "Nepal"],
  authors: [{ name: "Ajay Kumar Maharjan" }],
  metadataBase: new URL("https://ajayakumarmaharjan.com.np/"),
  openGraph: {
    title: "Ajay Kumar Maharjan — Full-Stack Developer",
    description: "Portfolio of Ajay Kumar Maharjan, a Full-Stack Developer building modern, scalable, and user-focused web applications.",
    url: "https://ajayakumarmaharjan.com.np/",
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
