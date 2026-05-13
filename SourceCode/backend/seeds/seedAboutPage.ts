import 'dotenv/config';
import mongoose from 'mongoose';
import Page from '../models/page.model';

async function seedAboutPage() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not set in .env');

    console.log('Connecting to MongoDB…');
    await mongoose.connect(dbUrl);
    console.log('Connected to DB.');

    // High-quality Indian gym Pexels images (no tracking params needed)
    const IMG = {
        // Strength training / weight room — for Mission
        missionImg1: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
        missionImg2: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800',
        // Yoga / wellness — for Vision
        visionImg1: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
        visionImg2: 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=800',
        // Group / community training — for Values
        valuesImg1: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=800',
        valuesImg2: 'https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=800',
    };

    const aboutContent = {
        about_page: {
            heading: {
                en: 'India\'s Most Trusted Fitness Community'
            },
            description: {
                en: 'At Webitof GYM, we believe fitness is not a privilege — it is a right. Born in India, built for Indians, our gym is a place where tradition meets science, where ancient practices like Yoga meet modern strength training, and where every member — from school students to senior citizens — finds a programme designed just for them.'
            },
            mission: {
                text: {
                    en: 'Our mission is to make world-class fitness accessible to every Indian. We are committed to providing certified coaching, science-backed training programmes, and personalised Indian diet plans that are affordable and effective for people of all ages, backgrounds, and fitness levels. We believe that a healthier India starts with one gym, one trainer, and one life-changing workout at a time.'
                },
                mission_image1: IMG.missionImg1,
                mission_image2: IMG.missionImg2,
            },
            vision: {
                text: {
                    en: 'Our vision is to become India\'s most impactful fitness brand by building a nationwide network of gyms that celebrate Indian culture, promote indigenous sports like Kabaddi and Kushti, and integrate ancient wellness systems like Yoga and Ayurveda with cutting-edge fitness technology. We envision a future where every Indian city and town has a Webitof GYM — a second home for health, strength, and community.'
                },
                vision_image1: IMG.visionImg1,
                vision_image2: IMG.visionImg2,
            },
            values: {
                text: {
                    en: 'We are guided by four core values: Inclusivity — our doors are open to everyone, regardless of age, gender, or ability; Authenticity — we celebrate Indian identity in everything we do, from our diet plans to our training programmes; Excellence — we hold ourselves and our coaches to the highest standards of professional certification and member satisfaction; and Community — we believe the real transformation happens not just in the body, but in the bonds formed between members who push each other to be their best.'
                },
                values_image1: IMG.valuesImg1,
                values_image2: IMG.valuesImg2,
            }
        }
    };

    console.log('Upserting About page content...');
    await Page.findOneAndUpdate(
        { slug: 'about' },
        {
            $set: {
                title: 'About Us',
                slug: 'about',
                content_type: 'json',
                content: aboutContent
            }
        },
        { upsert: true, new: true }
    );
    console.log('About page seeded successfully!');

    await mongoose.disconnect();
    console.log('Disconnected from DB.');
}

seedAboutPage().catch(err => {
    console.error('About page seed failed:', err);
    process.exit(1);
});
