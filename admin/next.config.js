/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/admin',
    assetPrefix: '/admin',
    images: {
        domains: ['images.unsplash.com', 'res.cloudinary.com', 'localhost'],
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api',
        NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    },
}

module.exports = nextConfig
