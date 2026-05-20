export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/success'],
            },
        ],
        sitemap: 'https://marscarefoundation.in/sitemap.xml',
        host: 'https://marscarefoundation.in',
    };
}
