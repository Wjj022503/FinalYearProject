/** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'appfood-back-gxd7g3hacpacf7ha.canadacentral-01.azurewebsites.net',
//           pathname: '/images/**',
//         },
//       ],
//     },
//   };

const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3001',
          pathname: '/images/**',
        },
      ],
    },
  };

  export default nextConfig;
  