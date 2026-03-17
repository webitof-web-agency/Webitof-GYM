/** @type {import('next').NextConfig} */
const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:8080/';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.SOCKET_URL || backendUrl;
const backendOrigin = new URL(backendUrl);

const remotePatterns = [
    {
        protocol: backendOrigin.protocol.replace(':', ''),
        hostname: backendOrigin.hostname,
        port: backendOrigin.port || '',
        pathname: '/**',
    },
    {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '/**',
    },
    {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
    },
    {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
    },
];

const nextConfig = {
    env: {
        backend_url: backendUrl,
        socket_url: socketUrl,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        optimizePackageImports: ['antd', 'react-icons'],
    },
    images: {
        remotePatterns,
    },
};

module.exports = nextConfig;
