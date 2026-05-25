/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "*.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "drive.google.com", pathname: "/**" },
      { protocol: "https", hostname: "docs.google.com", pathname: "/**" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;