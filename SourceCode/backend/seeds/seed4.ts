import 'dotenv/config';
import mongoose from 'mongoose';
import BlogCategory from '../models/blog/category.model';
import BlogTag from '../models/blog/tag.model';
import Blog from '../models/blog/blog.model';
import Event from '../models/event.model';
import Gallery from '../models/gallery.model';
import User from '../models/user.model';

async function seed4() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not set in .env');

    console.log('Connecting to MongoDB…');
    await mongoose.connect(dbUrl);
    console.log('Connected to DB.');

    // Get an admin user for blog authorship
    const adminUser = await User.findOne({ role: 'admin' });
    const authorId = adminUser ? adminUser._id : null;

    // 1. Blog Categories
    console.log('Seeding Blog Categories...');
    const categories = ['Fitness Tips', 'Nutrition', 'Workout Plans', 'Success Stories', 'Gym News'];
    const categoryDocs: any = {};
    for (const cat of categories) {
        let doc = await BlogCategory.findOne({ 'name.en': cat });
        if (!doc) {
            doc = await BlogCategory.create({ name: { en: cat } });
        }
        categoryDocs[cat] = doc._id;
    }

    // 2. Blog Tags
    console.log('Seeding Blog Tags...');
    const tags = ['HIIT', 'Weight Loss', 'Muscle Building', 'Yoga', 'Cardio', 'Supplements', 'Motivation', 'Beginner', 'Advanced', 'Recovery'];
    const tagDocs: any = {};
    for (const tag of tags) {
        let doc = await BlogTag.findOne({ 'name.en': tag });
        if (!doc) {
            doc = await BlogTag.create({ name: { en: tag } });
        }
        tagDocs[tag] = doc._id;
    }

    // 3. Blogs
    console.log('Seeding Blogs...');
    const blogs = [
        {
            title: { en: '10 Best HIIT Workouts for Rapid Fat Loss' },
            short_description: { en: 'Discover the most effective High-Intensity Interval Training routines to burn fat quickly.' },
            details: { en: '<p>High-Intensity Interval Training (HIIT) is one of the most effective ways to burn fat and improve cardiovascular health in a short amount of time. In this post, we cover 10 routines you can do anywhere...</p>' },
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
            category: categoryDocs['Fitness Tips'],
            tags: [tagDocs['HIIT'], tagDocs['Weight Loss'], tagDocs['Cardio']],
            published: true,
            add_to_popular: true,
            user: authorId
        },
        {
            title: { en: 'The Ultimate Beginner\'s Guide to Weight Training' },
            short_description: { en: 'Starting out with weights? Here is everything you need to know to build a solid foundation.' },
            details: { en: '<p>Weight training can be intimidating for beginners. From choosing the right weights to perfecting your form, this guide will walk you through the essentials of starting your strength training journey safely.</p>' },
            image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
            category: categoryDocs['Workout Plans'],
            tags: [tagDocs['Beginner'], tagDocs['Muscle Building']],
            published: true,
            add_to_popular: true,
            user: authorId
        },
        {
            title: { en: 'Top 5 Pre-Workout Nutrition Tips' },
            short_description: { en: 'Fuel your body right before hitting the gym for maximum performance.' },
            details: { en: '<p>What you eat before a workout can make or break your performance. Learn about the best sources of carbohydrates, proteins, and timing strategies to ensure you have the energy to crush your goals.</p>' },
            image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop',
            category: categoryDocs['Nutrition'],
            tags: [tagDocs['Nutrition'], tagDocs['Supplements']],
            published: true,
            add_to_popular: false,
            user: authorId
        },
        {
            title: { en: 'How CrossFit Changed My Life' },
            short_description: { en: 'A member shares their incredible journey from couch potato to CrossFit athlete.' },
            details: { en: '<p>Read the inspiring story of Sarah, who transformed her health and confidence through our CrossFit community. From struggling to lift a barbell to competing in local events, her journey will motivate you.</p>' },
            image: 'https://images.unsplash.com/photo-1526506114636-f0331006eb46?q=80&w=1000&auto=format&fit=crop',
            category: categoryDocs['Success Stories'],
            tags: [tagDocs['Motivation'], tagDocs['Advanced']],
            published: true,
            add_to_popular: true,
            user: authorId
        },
        {
            title: { en: 'Yoga for Muscle Recovery: A Complete Guide' },
            short_description: { en: 'Why lifters and athletes should incorporate yoga into their recovery routines.' },
            details: { en: '<p>Overtraining can lead to injuries and plateaus. Discover how adding just 20 minutes of specific yoga poses can drastically improve your flexibility, reduce soreness, and speed up muscle recovery.</p>' },
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
            category: categoryDocs['Fitness Tips'],
            tags: [tagDocs['Yoga'], tagDocs['Recovery']],
            published: true,
            add_to_popular: false,
            user: authorId
        },
        {
            title: { en: 'Building Your First 12-Week Workout Plan' },
            short_description: { en: 'A step-by-step framework to design a workout program that guarantees results.' },
            details: { en: '<p>Consistency is key to seeing changes in the gym. This article breaks down how to structure a 12-week macrocycle, including progressive overload, deload weeks, and tracking metrics.</p>' },
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
            category: categoryDocs['Workout Plans'],
            tags: [tagDocs['Muscle Building'], tagDocs['Beginner']],
            published: true,
            add_to_popular: false,
            user: authorId
        }
    ];

    for (const b of blogs) {
        const exists = await Blog.findOne({ 'title.en': b.title.en });
        if (!exists) {
            await Blog.create(b);
        }
    }
    console.log('Blogs seeded.');

    // 4. Events
    console.log('Seeding Events...');
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const twoMonths = new Date();
    twoMonths.setMonth(twoMonths.getMonth() + 2);

    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);

    const events = [
        {
            name: { en: 'Summer Fitness Challenge 2026' },
            description: { en: 'Join our 30-day intensive summer fitness challenge. Prizes for the top transformations!' },
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
            start_date: nextMonth,
            end_date: new Date(nextMonth.getTime() + (30 * 24 * 60 * 60 * 1000)), // +30 days
            location: 'Main Gym Area',
            is_active: true
        },
        {
            name: { en: 'Annual Yoga Retreat' },
            description: { en: 'A weekend getaway focused on mindfulness, meditation, and advanced yoga practices.' },
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
            start_date: twoMonths,
            end_date: new Date(twoMonths.getTime() + (2 * 24 * 60 * 60 * 1000)), // +2 days
            location: 'Mountain View Resort',
            is_active: true
        },
        {
            name: { en: 'CrossFit Open 2026 Qualifier' },
            description: { en: 'Test your fitness against the best in our local CrossFit Open qualifying event.' },
            image: 'https://images.unsplash.com/photo-1526506114636-f0331006eb46?q=80&w=1000&auto=format&fit=crop',
            start_date: threeMonths,
            end_date: new Date(threeMonths.getTime() + (1 * 24 * 60 * 60 * 1000)), // +1 day
            location: 'CrossFit Arena',
            is_active: true
        },
        {
            name: { en: 'Nutrition Masterclass' },
            description: { en: 'Learn the secrets of meal prep and macro tracking with our certified nutritionists.' },
            image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop',
            start_date: new Date(nextMonth.getTime() + (15 * 24 * 60 * 60 * 1000)), // +15 days
            end_date: new Date(nextMonth.getTime() + (15 * 24 * 60 * 60 * 1000) + (4 * 60 * 60 * 1000)), // +4 hours
            location: 'Conference Room B',
            is_active: true
        },
        {
            name: { en: 'Amateur Boxing Tournament' },
            description: { en: 'Watch our members compete or sign up to spar in our annual amateur boxing event.' },
            image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1000&auto=format&fit=crop',
            start_date: new Date(twoMonths.getTime() + (10 * 24 * 60 * 60 * 1000)),
            end_date: new Date(twoMonths.getTime() + (12 * 24 * 60 * 60 * 1000)), // 2 days later
            location: 'Boxing Ring',
            is_active: true
        }
    ];

    for (const e of events) {
        const exists = await Event.findOne({ 'name.en': e.name.en });
        if (!exists) {
            await Event.create(e);
        }
    }
    console.log('Events seeded.');

    // 5. Gallery
    console.log('Seeding Gallery...');
    const galleryImages = [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526506114636-f0331006eb46?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop'
    ];

    for (const imgUrl of galleryImages) {
        const exists = await Gallery.findOne({ image: imgUrl });
        if (!exists) {
            await Gallery.create({ image: imgUrl });
        }
    }
    console.log('Gallery seeded.');

    await mongoose.disconnect();
    console.log('Seed 4 complete! Disconnected from DB.');
}

seed4().catch(err => {
    console.error('Seed 4 failed:', err);
    process.exit(1);
});
