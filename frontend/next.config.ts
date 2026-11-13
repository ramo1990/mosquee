import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: false,

  images: {
    dangerouslyAllowLocalIP: true,
    
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8004",
        pathname: "/media/**",
      },
    ],
  },
  
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
