/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/admin/:path*',
                destination: process.env.ADMIN_URL ? `${process.env.ADMIN_URL}/admin/:path*` : 'http://localhost:3001/admin/:path*',
            },
            {
                source: '/api/:path*',
                destination: process.env.SERVER_URL ? `${process.env.SERVER_URL}/api/:path*` : 'http://localhost:5003/api/:path*',
            },
        ]
    },
    images: {
        domains: ['images.unsplash.com', 'res.cloudinary.com', 'localhost'],
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api',
        NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    },
}

module.exports = nextConfig
