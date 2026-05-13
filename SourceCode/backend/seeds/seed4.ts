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

    // Get admin user for blog authorship
    const adminUser = await User.findOne({ role: 'admin' });
    const authorId = adminUser ? adminUser._id : null;

    // Clear old data
    console.log('Clearing old Blogs, Blog Categories, Blog Tags, Events, Gallery...');
    await Blog.deleteMany({});
    await BlogCategory.deleteMany({});
    await BlogTag.deleteMany({});
    await Event.deleteMany({});
    await Gallery.deleteMany({});

    // 1. Blog Categories
    console.log('Seeding Blog Categories...');
    const categories = ['Fitness Tips', 'Indian Nutrition', 'Workout Plans', 'Success Stories', 'Gym News'];
    const categoryDocs: any = {};
    for (const cat of categories) {
        const doc = await BlogCategory.create({ name: { en: cat } });
        categoryDocs[cat] = doc._id;
    }

    // 2. Blog Tags
    console.log('Seeding Blog Tags...');
    const tags = ['HIIT', 'Weight Loss', 'Muscle Building', 'Yoga', 'Cardio', 'Desi Diet', 'Motivation', 'Beginner', 'Advanced', 'Recovery'];
    const tagDocs: any = {};
    for (const tag of tags) {
        const doc = await BlogTag.create({ name: { en: tag } });
        tagDocs[tag] = doc._id;
    }

    // 3. Blogs — Indian gym content
    console.log('Seeding Blogs...');
    const blogs = [
        {
            title: { en: '10 Best HIIT Workouts for Fat Loss in Indian Summer Heat' },
            short_description: { en: 'Discover effective HIIT routines specially adapted for the hot and humid Indian climate to maximise fat burning.' },
            details: { en: '<p>High-Intensity Interval Training (HIIT) is one of the most effective ways to burn fat in minimal time. For Indians training through summer, timing and hydration are crucial. We recommend morning sessions before 8 AM or evening sessions after 6 PM. Include coconut water or nimbu pani for electrolyte replenishment. Incorporate exercises like jump squats, burpees, mountain climbers, and high knees in 40:20 work-to-rest intervals for best results...</p>' },
            image: 'https://images.pexels.com/photos/2827400/pexels-photo-2827400.jpeg?auto=compress&cs=tinysrgb&w=1000',
            category: categoryDocs['Fitness Tips'],
            tags: [tagDocs['HIIT'], tagDocs['Weight Loss'], tagDocs['Cardio']],
            published: true,
            add_to_popular: true,
            user: authorId
        },
        {
            title: { en: "The Indian Gym-Goer's Guide to Vegetarian Muscle Building" },
            short_description: { en: 'Think you cannot build muscle on a vegetarian Indian diet? Think again. Here is the complete guide.' },
            details: { en: '<p>India has a majority vegetarian population, yet many believe muscle building requires non-veg food. That is a myth! High-protein Indian foods like paneer (cottage cheese), soya chunks, dal, rajma, chana, sprouts, and Greek yogurt can fuel serious muscle growth. A typical Indian bodybuilder can hit 1.6–2.2g of protein per kg bodyweight through smart meal planning. Pair this with progressive overload in the gym and you will see incredible results...</p>' },
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1000',
            category: categoryDocs['Indian Nutrition'],
            tags: [tagDocs['Desi Diet'], tagDocs['Muscle Building']],
            published: true,
            add_to_popular: true,
            user: authorId
        },
        {
            title: { en: 'Yoga for Muscle Recovery: Ancient Indian Wisdom Meets Modern Fitness' },
            short_description: { en: 'How incorporating traditional yoga asanas into your routine can accelerate recovery and prevent injury.' },
            details: { en: '<p>Yoga is India\'s gift to the world of wellness. For athletes and gym enthusiasts, specific asanas like Balasana (Child\'s Pose), Supta Baddha Konasana, Viparita Karani, and Pavanamuktasana are highly effective for muscle recovery. Just 20–30 minutes of post-workout yoga can reduce DOMS (Delayed Onset Muscle Soreness), improve joint mobility, and enhance sleep quality — all of which are critical for muscle growth...</p>' },
            image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1000',
            category: categoryDocs['Fitness Tips'],
            tags: [tagDocs['Yoga'], tagDocs['Recovery']],
            published: true,
            add_to_popular: false,
            user: authorId
        },
        {
            title: { en: 'How Kavya Lost 20 KG and Found Her Confidence at Webitof GYM' },
            short_description: { en: 'An inspiring transformation story from one of our Noida members — from struggling with PCOD to becoming a fitness enthusiast.' },
            details: { en: '<p>Kavya Reddy, a 28-year-old IT professional from Noida, was struggling with PCOD, weight gain, and low energy. Six months after joining Webitof GYM, she has lost 20 kg, her PCOD symptoms have improved dramatically, and she now mentors other women in our Shakti Yoga Circle. "Priya ma\'am\'s yoga sessions and the Indian diet plan provided by the nutritionist changed everything for me," says Kavya. Her story is proof that with the right guidance, transformation is possible for anyone...</p>' },
            image: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=1000',
            category: categoryDocs['Success Stories'],
            tags: [tagDocs['Motivation'], tagDocs['Weight Loss']],
            published: true,
            add_to_popular: true,
            user: authorId
        },
        {
            title: { en: 'Beginner\'s Guide to Weight Training for Indians' },
            short_description: { en: 'Everything you need to know to start strength training safely and effectively, tailored for the Indian lifestyle.' },
            details: { en: '<p>Starting your weight training journey can feel intimidating, especially with so much conflicting information online. For Indian beginners, we recommend starting with a 3-day full-body routine focusing on compound movements like squats, deadlifts, bench press, and overhead press. Do not skip the warm-up — 5–10 minutes of dynamic stretching is essential. Indian joints tend to be more flexible due to cultural sitting habits (sitting cross-legged), which is an advantage in achieving full range of motion. Always prioritise form over weight...</p>' },
            image: 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=1000',
            category: categoryDocs['Workout Plans'],
            tags: [tagDocs['Beginner'], tagDocs['Muscle Building']],
            published: true,
            add_to_popular: false,
            user: authorId
        },
        {
            title: { en: 'Webitof GYM Now Offers Kabaddi & Wrestling Conditioning Classes' },
            short_description: { en: 'We are proud to announce sport-specific training for traditional Indian sports — Kabaddi and Kushti wrestling.' },
            details: { en: '<p>Webitof GYM is thrilled to be one of the first fitness centres in Noida to offer dedicated conditioning programmes for Kabaddi and Kushti (traditional Indian wrestling). Led by Coach Arjun Sharma, who has trained national-level athletes, these classes focus on explosive power, agility, grip strength, and sport-specific endurance. Whether you are a competitive player or simply passionate about our indigenous sports, these classes are open to all...</p>' },
            image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=1000',
            category: categoryDocs['Gym News'],
            tags: [tagDocs['Advanced'], tagDocs['Motivation']],
            published: true,
            add_to_popular: false,
            user: authorId
        }
    ];
    await Blog.insertMany(blogs);
    console.log('Blogs seeded.');

    // 4. Events — India-themed
    console.log('Seeding Events...');
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const twoMonths = new Date();
    twoMonths.setMonth(twoMonths.getMonth() + 2);
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);

    const events = [
        {
            name: { en: 'Monsoon Fitness Challenge 2026' },
            description: { en: 'Join our 30-day intensive monsoon fitness challenge! Track your progress, win exciting prizes, and transform your body before the festive season. Open to all Webitof GYM members.' },
            image: 'https://images.pexels.com/photos/2827400/pexels-photo-2827400.jpeg?auto=compress&cs=tinysrgb&w=1000',
            start_date: nextMonth,
            end_date: new Date(nextMonth.getTime() + (30 * 24 * 60 * 60 * 1000)),
            location: 'Webitof GYM Main Floor, Sector 18, Noida',
            is_active: true
        },
        {
            name: { en: 'International Yoga Day Celebration' },
            description: { en: 'Celebrate International Yoga Day (21st June) with a 3-hour outdoor yoga session led by Priya Iyer. Open to members and non-members. Registration required.' },
            image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1000',
            start_date: twoMonths,
            end_date: new Date(twoMonths.getTime() + (3 * 60 * 60 * 1000)),
            location: 'City Park, Sector 21, Noida',
            is_active: true
        },
        {
            name: { en: 'North India Powerlifting Open 2026' },
            description: { en: 'Compete in our annual powerlifting open meet featuring squat, bench press, and deadlift categories. Cash prizes for top finishers across all weight categories.' },
            image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1000',
            start_date: threeMonths,
            end_date: new Date(threeMonths.getTime() + (1 * 24 * 60 * 60 * 1000)),
            location: 'Webitof GYM Powerlifting Arena, Noida',
            is_active: true
        },
        {
            name: { en: 'Navratri Zumba Night' },
            description: { en: 'A special 2-hour Navratri-themed Zumba and Garba dance fitness party. Wear traditional attire and enjoy a festive workout like never before!' },
            image: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=1000',
            start_date: new Date(nextMonth.getTime() + (15 * 24 * 60 * 60 * 1000)),
            end_date: new Date(nextMonth.getTime() + (15 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000)),
            location: 'Webitof GYM Dance Studio, Noida',
            is_active: true
        },
        {
            name: { en: 'Indian Diet & Sports Nutrition Masterclass' },
            description: { en: 'Learn how to use traditional Indian foods — dal, millets, ghee, turmeric, and paneer — to power your fitness goals. Session by our certified sports nutritionist.' },
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1000',
            start_date: new Date(twoMonths.getTime() + (10 * 24 * 60 * 60 * 1000)),
            end_date: new Date(twoMonths.getTime() + (10 * 24 * 60 * 60 * 1000) + (3 * 60 * 60 * 1000)),
            location: 'Webitof GYM Conference Room, Noida',
            is_active: true
        }
    ];
    await Event.insertMany(events);
    console.log('Events seeded.');

    // 5. Gallery — Indian gym photos using pexels
    console.log('Seeding Gallery...');
    const galleryImages = [
        'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/2827400/pexels-photo-2827400.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/4720354/pexels-photo-4720354.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1000',
        'https://images.pexels.com/photos/3621184/pexels-photo-3621184.jpeg?auto=compress&cs=tinysrgb&w=1000'
    ];
    const galleryDocs = galleryImages.map(imgUrl => ({ image: imgUrl }));
    await Gallery.insertMany(galleryDocs);
    console.log('Gallery seeded.');

    await mongoose.disconnect();
    console.log('Seed 4 complete! Disconnected from DB.');
}

seed4().catch(err => {
    console.error('Seed 4 failed:', err);
    process.exit(1);
});
