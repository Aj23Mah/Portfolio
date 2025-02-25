

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
