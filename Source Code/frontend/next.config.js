/** @type {import('next').NextConfig} */
const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:8080/';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.SOCKET_URL || backendUrl;

const nextConfig = {
    env: {
        backend_url: backendUrl,
        socket_url: socketUrl,
    },
    images: {
        domains: [''], //use here you domain url for image
    },
};

module.exports = nextConfig;
