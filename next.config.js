/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure webpack to handle Node.js modules properly
  webpack: (config, { isServer }) => {
    // If client-side bundle
    if (!isServer) {
      // Replace Node.js modules with empty modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
        stream: false,
        os: false,
        path: false,
        child_process: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig 