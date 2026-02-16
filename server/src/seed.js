const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Program = require('./models/Program');
const { Settings, defaultSettings } = require('./models/Settings');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Program.deleteMany({});
        await Settings.deleteMany({});

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@marscarefoundation.org',
            password: 'admin123',
            role: 'admin'
        });
        console.log('✅ Admin user created:', adminUser.email);

        // Create sample programs
        const programs = await Program.create([
            {
                title: 'Education for All',
                slug: 'education-for-all',
                shortDescription: 'Providing quality education to underprivileged children across India.',
                description: 'Our Education for All program focuses on providing quality education to children from marginalized communities. We run learning centers, provide scholarships, and support schools with necessary resources.',
                category: 'education',
                featuredImage: { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b' },
                targetAmount: 1000000,
                raisedAmount: 450000,
                donorCount: 125,
                beneficiaries: { count: 500, description: 'children enrolled in our learning programs' },
                status: 'active',
                isFeatured: true,
                isAcceptingDonations: true,
                impactMetrics: [
                    { label: 'Children Educated', value: '500+', icon: 'GraduationCap' },
                    { label: 'Schools Supported', value: '15', icon: 'School' },
                    { label: 'Teachers Trained', value: '50', icon: 'Users' }
                ],
                seo: {
                    metaTitle: 'Education for All - Mars Care Foundation',
                    metaDescription: 'Support quality education for underprivileged children. Donate now to help us build a brighter future.'
                }
            },
            {
                title: 'Healthcare Initiative',
                slug: 'healthcare-initiative',
                shortDescription: 'Bringing healthcare services to rural and underserved communities.',
                description: 'Our Healthcare Initiative aims to provide essential medical services to communities with limited access to healthcare. We organize health camps, distribute medicines, and support local healthcare facilities.',
                category: 'health',
                featuredImage: { url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d' },
                targetAmount: 750000,
                raisedAmount: 320000,
                donorCount: 89,
                beneficiaries: { count: 2000, description: 'patients treated through our health camps' },
                status: 'active',
                isFeatured: true,
                isAcceptingDonations: true,
                impactMetrics: [
                    { label: 'Patients Treated', value: '2000+', icon: 'Heart' },
                    { label: 'Health Camps', value: '25', icon: 'Activity' },
                    { label: 'Villages Reached', value: '30', icon: 'MapPin' }
                ]
            },
            {
                title: 'Women Empowerment',
                slug: 'women-empowerment',
                shortDescription: 'Empowering women through skill development and financial independence.',
                description: 'Our Women Empowerment program focuses on providing vocational training, micro-finance support, and entrepreneurship opportunities to women from disadvantaged backgrounds.',
                category: 'women-empowerment',
                featuredImage: { url: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21' },
                targetAmount: 500000,
                raisedAmount: 180000,
                donorCount: 67,
                beneficiaries: { count: 300, description: 'women trained in various skills' },
                status: 'active',
                isFeatured: true,
                isAcceptingDonations: true
            }
        ]);
        console.log('✅ Sample programs created:', programs.length);

        // Initialize settings
        for (const [key, value] of Object.entries(defaultSettings)) {
            await Settings.create({ key, value, category: 'general' });
        }
        console.log('✅ Default settings initialized');

        console.log('\n🎉 Database seeded successfully!\n');
        console.log('Admin Login:');
        console.log('Email: admin@marscarefoundation.org');
        console.log('Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
