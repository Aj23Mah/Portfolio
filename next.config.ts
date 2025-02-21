// import type { NextConfig } from "next";
//
// const nextConfig: NextConfig = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'api-cms.nxin.tech',
//                 pathname: '**'
//             },
//             // {
//             //     domains: ['localhost'],
//             // }
//         ],
//     },
//
// };
//
// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    trailingSlash: false,
    compress: true,
    images: {
        unoptimized: true,
        domains: ["api-cms.nxin.tech", "localhost", "ajayakumarmaharjan.com.np"], // Add the domain here
    }
};

export default nextConfig;
