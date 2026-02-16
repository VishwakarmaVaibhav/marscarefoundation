const mongoose = require('mongoose');
require('dotenv').config();
const Blog = require('./src/models/Blog');
const User = require('./src/models/User');

async function seedBlogs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('No admin user found to attribute blogs to.');
            process.exit(1);
        }

        const blogs = [
            {
                title: 'Nurturing Potential through Education',
                slug: 'nurturing-potential-through-education',
                content: '<p>Education is the most powerful weapon which you can use to change the world. At Mars Care Foundation, we believe every child deserves the chance to learn and grow. Our recent initiatives in rural Bihar have brought digital classrooms to over 15 villages, impacting 2,000+ students.</p><p>Through our community-led approach, we not only provide infrastructure but also train local teachers to ensure sustainability. The results are heartwarming: school attendance has increased by 40% in just six months.</p>',
                excerpt: 'How we are transforming lives through education in remote areas.',
                author: admin._id,
                category: 'Education',
                status: 'published',
                isFeatured: true,
                featuredImage: {
                    url: 'https://images.unsplash.com/photo-1503676260728-1c00da0702e8?q=80&w=2070',
                    publicId: 'education_1'
                },
                tags: ['Education', 'Rural Support', 'Impact']
            },
            {
                title: 'Healthcare for the Unreached',
                slug: 'healthcare-for-the-unreached',
                content: '<p>Quality healthcare should not be a privilege. Our mobile health clinics are reaching the most remote corners of the Sundarbans, providing essential medical services to those who have never seen a doctor before.</p><p>We focus on maternal health, child nutrition, and preventative care. Our last camp treated over 500 patients in just three days, identifying critical cases that required immediate tertiary care.</p>',
                excerpt: 'Bringing specialized medical camps to the heart of rural India.',
                author: admin._id,
                category: 'Healthcare',
                status: 'published',
                isFeatured: true,
                featuredImage: {
                    url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2070',
                    publicId: 'healthcare_1'
                },
                tags: ['Healthcare', 'Sundarbans', 'Medical Camp']
            },
            {
                title: 'Empowering Women, Transforming Unions',
                slug: 'empowering-women-transforming-unions',
                content: '<p>When you empower a woman, you empower a whole family. Our vocational training centers for women in Uttar Pradesh are teaching skills like tailoring, digital literacy, and sustainable farming.</p><p>Meet Radha, a mother of three who started her own micro-business after completing our 3-month course. She now earns a steady income and has become an inspiration for other women in her village.</p>',
                excerpt: 'Skill development programs creating financial independence for rural women.',
                author: admin._id,
                category: 'Empowerment',
                status: 'published',
                isFeatured: true,
                featuredImage: {
                    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070',
                    publicId: 'empowerment_1'
                },
                tags: ['Empowerment', 'Women', 'Skills']
            }
        ];

        await Blog.deleteMany({});
        await Blog.insertMany(blogs);
        console.log('Successfully seeded 3 test blogs!');

    } catch (error) {
        console.error('Error seeding blogs:', error);
    } finally {
        await mongoose.connection.close();
    }
}

seedBlogs();
