import type { Metadata } from "next";
import "./globals.css";

// export const metadata: Metadata = {
//     title: 'Ajay Kumar Maharjan',
//     description: 'An portfolio website of Ajay Kumar Maharjan.',
//     metadataBase: new URL('https://portfolio-2aam.vercel.app/'),
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'bg-paper-texture'}>
      <title>{'Ajay Kumar Maharjan'}</title>
      <meta name="description" content={"An Portfolio Webstie"}/>
       <meta property="og:type" content="website"/>
      <meta property="og:title" content={'Ajay Kumar Maharjan'}/>
      <meta property="og:description" content={"An Portfolio Webstie"}/>
      {/*<meta property="og:image" content={((await getValidImageUrl(product.img) as any)) ?? ''}/>*/}
      {/*<meta property="og:image:width" content="1200"/>*/}
      {/*<meta property="og:image:height" content="630"/>*/}
      {/*<meta property="og:image:alt" content={product.label}/>*/}
      <main>
          {children}
      </main>
      </body>
    </html>
  );
}
