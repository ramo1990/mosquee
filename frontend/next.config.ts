import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    dangerouslyAllowLocalIP: true,
    
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
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
