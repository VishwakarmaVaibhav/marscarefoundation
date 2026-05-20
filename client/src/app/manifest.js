export default function manifest() {
    return {
        name: 'Mars Care Foundation',
        short_name: 'Mars Care',
        description: 'Mars Care Foundation — NGO dedicated to Education, Healthcare & Community Development in India.',
        start_url: '/',
        display: 'standalone',
        background_color: '#F9F7F4',
        theme_color: '#1A3C5A',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        categories: ['education', 'health', 'social'],
        lang: 'en-IN',
    };
}
