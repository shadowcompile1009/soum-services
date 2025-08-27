/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.soum.sa',
      },
      {
        protocol: 'https',
        hostname: 'cdn.staging.soum.sa',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/orders',
        destination: '/orders/new',
        permanent: true,
      },
      {
        source: '/payouts',
        destination: '/payouts/buyer-refund',
        permanent: true,
      },
      {
        source: '/payouts2_0',
        destination: '/payouts2_0/buyer-refund',
        permanent: true,
      },
      {
        source: '/message',
        destination: '/message/processing',
        permanent: true,
      },
      {
        source: '/promocode',
        destination: '/promocode/list',
        permanent: true,
      },
      {
        source: '/settings',
        destination: '/settings/whatsapp',
        permanent: true,
      },
      {
        source: '/wallet',
        destination: '/wallet/withdrawal',
        permanent: true,
      },
      {
        source: '/logistics',
        destination: '/logistics/vendors',
        permanent: true,
      },
      {
        source: '/frontliners',
        destination: '/frontliners/unfiltered',
        permanent: true,
      },
      {
        source: '/listing',
        destination: '/frontliners/unfiltered',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
