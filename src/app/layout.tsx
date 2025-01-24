import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: 'Ajay Kumar Maharjan',
    description: 'An portfolio website of Ajay Kumar Maharjan.',
    metadataBase: new URL('https://portfolio-2aam.vercel.app/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'bg-paper-texture'}>
      <main>{children}</main>
      </body>
    </html>
  );
}
