import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api-cms.nxin.tech',
                pathname: '**'
            },
            // {
            //     domains: ['localhost'],
            // }
        ],
    },

};

export default nextConfig;
