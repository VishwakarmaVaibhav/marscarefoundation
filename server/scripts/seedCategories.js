const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ProgramCategory = require('../src/models/ProgramCategory');
const Program = require('../src/models/Program');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const categories = [
    {
        title: 'Education',
        description: 'Empowering children and adults through quality education and skill development.',
        isActive: true,
        order: 1,
        slug: 'education'
    },
    {
        title: 'Healthcare',
        description: 'Providing essential medical care and health awareness to underserved communities.',
        isActive: true,
        order: 2,
        slug: 'healthcare'
    },
    {
        title: 'Women Empowerment',
        description: 'Supporting women through vocational training, self-help groups, and rights awareness.',
        isActive: true,
        order: 3,
        slug: 'women-empowerment'
    },
    {
        title: 'Environment',
        description: 'Promoting sustainable practices, tree plantation, and waste management.',
        isActive: true,
        order: 4,
        slug: 'environment'
    },
    {
        title: 'Rural Development',
        description: 'Holistic development of rural areas through infrastructure and livelihood support.',
        isActive: true,
        order: 5,
        slug: 'rural-development'
    }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // 1. Create Categories
        console.log('Seeding Categories...');
        const createdCats = [];

        for (const cat of categories) {
            let category = await ProgramCategory.findOne({ title: cat.title });
            if (!category) {
                category = await ProgramCategory.create(cat);
                console.log(`Created category: ${category.title}`);
            } else {
                console.log(`Category exists: ${category.title}`);
            }
            createdCats.push(category);
        }

        // 2. Migrate Programs
        console.log('Migrating Programs...');
        const programs = await Program.find({});

        for (const program of programs) {
            // Check if category needs update
            let shouldSave = false;

            // If category is missing or not an ObjectId (basic check)
            if (!program.category || !mongoose.Types.ObjectId.isValid(program.category)) {
                // Assign to a category based on title similarity or default to first one
                const defaultCat = createdCats[0];
                const matchedCat = createdCats.find(c =>
                    program.title.toLowerCase().includes(c.title.toLowerCase())
                ) || defaultCat;

                program.category = matchedCat._id;
                shouldSave = true;
                console.log(`Assigned program "${program.title}" to category "${matchedCat.title}"`);
            }

            if (shouldSave) {
                await program.save();
            }
        }

        console.log('Seeding and Migration Complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedCategories();
