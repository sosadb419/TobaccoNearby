/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/shops/esso-leidsche-rein-dirck-hoetweg-2-3541bh",
        destination: "/shops/esso-leidsche-rijn-dirck-hoetweg-2-3541bh",
        permanent: true
      },
      {
        source: "/shops/primera-parkwijk-leidsche-rein-verlengde-houtrakgracht-341-3544eb",
        destination: "/shops/primera-parkwijk-leidsche-rijn-verlengde-houtrakgracht-341-3544eb",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
