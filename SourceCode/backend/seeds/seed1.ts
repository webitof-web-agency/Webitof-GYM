import 'dotenv/config';
import mongoose from 'mongoose';
import Settings from '../models/settings.model';
import Service from '../models/service.model';
import Feature from '../models/feature.model';
import Subscription from '../models/subscription.model';
import Faq from '../models/faq.model';

async function seed1() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not set in .env');

    console.log('Connecting to MongoDB…');
    await mongoose.connect(dbUrl);
    console.log('Connected to DB.');

    // 1. Settings Update
    console.log('Updating Settings...');
    const settings = await Settings.findOne();
    if (settings) {
        settings.title = 'Webitof GYM';
        settings.description = 'The ultimate fitness destination for achieving your health goals with state-of-the-art equipment and expert trainers.';
        settings.email = 'contact@webitofgym.com';
        settings.phone = '+1 (555) 123-4567';
        settings.address = '123 Fitness Street, Gym City, NY 10001';
        settings.facebook = 'https://facebook.com/webitofgym';
        settings.twitter = 'https://twitter.com/webitofgym';
        settings.instagram = 'https://instagram.com/webitofgym';
        settings.youtube = 'https://youtube.com/webitofgym';
        settings.footer_text = '© 2026 Webitof GYM. All rights reserved.';
        await settings.save();
        console.log('Settings updated.');
    }

    // 2. Services
    console.log('Seeding Services...');
    const services = [
        {
            name: { en: 'Weight Training' },
            description: { en: 'Build strength and muscle mass with our extensive range of free weights and resistance machines.' },
            icon: 'flaticon-weightlifting',
            image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Cardio Fitness' },
            description: { en: 'Boost your endurance and burn calories with our top-of-the-line treadmills, ellipticals, and bikes.' },
            icon: 'flaticon-treadmill',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Yoga & Meditation' },
            description: { en: 'Improve flexibility, balance, and mental clarity through our expert-led yoga and meditation classes.' },
            icon: 'flaticon-yoga',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'CrossFit' },
            description: { en: 'Challenge yourself with high-intensity interval training designed to push your limits.' },
            icon: 'flaticon-fitness',
            image: 'https://images.unsplash.com/photo-1526506114636-f0331006eb46?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Swimming' },
            description: { en: 'Enjoy a full-body workout in our Olympic-sized indoor swimming pool.' },
            icon: 'flaticon-swimming',
            image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Cycling' },
            description: { en: 'Join our high-energy indoor cycling classes for an intense cardio session.' },
            icon: 'flaticon-stationary-bike',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Boxing & MMA' },
            description: { en: 'Learn self-defense and get fit with our professional boxing and MMA training.' },
            icon: 'flaticon-boxing-gloves',
            image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Pilates' },
            description: { en: 'Strengthen your core and improve posture with our dedicated Pilates classes.' },
            icon: 'flaticon-gym',
            image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop'
        }
    ];
    for (const service of services) {
        const exists = await Service.findOne({ 'name.en': service.name.en });
        if (!exists) {
            await Service.create(service);
        }
    }
    console.log('Services seeded.');

    // 3. Features
    console.log('Seeding Features...');
    const features = [
        {
            name: { en: 'Expert Trainers' },
            description: { en: 'Train with certified professionals who are dedicated to helping you achieve your fitness goals.' },
            image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'State-of-the-art Equipment' },
            description: { en: 'Access the latest and most advanced fitness equipment to maximize your workout efficiency.' },
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Flexible Timings' },
            description: { en: 'Work out on your own schedule with our 24/7 access and wide range of class timings.' },
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Nutrition Guidance' },
            description: { en: 'Get personalized meal plans and nutrition advice to complement your training routine.' },
            image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Group Classes' },
            description: { en: 'Stay motivated and make friends in our energetic and fun-filled group fitness classes.' },
            image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Progress Tracking' },
            description: { en: 'Monitor your fitness journey with our advanced progress tracking tools and regular assessments.' },
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'
        }
    ];
    for (const feature of features) {
        const exists = await Feature.findOne({ 'name.en': feature.name.en });
        if (!exists) {
            await Feature.create(feature);
        }
    }
    console.log('Features seeded.');

    // 4. Subscriptions
    console.log('Seeding Subscriptions...');
    const subscriptions = [
        {
            name: { en: 'Starter' },
            image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
            monthly_price: 29,
            yearly_price: 290,
            features: [
                { en: 'Access to Gym Equipment' },
                { en: 'Locker Room Access' },
                { en: '1 Free Fitness Assessment' },
                { en: 'Free Wi-Fi' },
                { en: 'Standard Support' }
            ],
            is_active: true
        },
        {
            name: { en: 'Pro' },
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
            monthly_price: 59,
            yearly_price: 590,
            features: [
                { en: 'All Starter Features' },
                { en: 'Access to Group Classes' },
                { en: 'Monthly Fitness Assessment' },
                { en: 'Free Guest Pass (1/month)' },
                { en: 'Priority Support' }
            ],
            is_active: true
        },
        {
            name: { en: 'Elite' },
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
            monthly_price: 99,
            yearly_price: 990,
            features: [
                { en: 'All Pro Features' },
                { en: 'Unlimited Personal Training' },
                { en: 'Custom Nutrition Plan' },
                { en: 'Access to Spa & Sauna' },
                { en: '24/7 Dedicated Support' },
                { en: 'Free Merchandise' }
            ],
            is_active: true
        }
    ];
    for (const sub of subscriptions) {
        const exists = await Subscription.findOne({ 'name.en': sub.name.en });
        if (!exists) {
            await Subscription.create(sub);
        }
    }
    console.log('Subscriptions seeded.');

    // 5. FAQs
    console.log('Seeding FAQs...');
    const faqs = [
        {
            question: { en: 'What are your gym timings?' },
            answer: { en: 'We are open 24/7 for our Elite members. For Starter and Pro members, the gym is accessible from 5:00 AM to 11:00 PM every day.' }
        },
        {
            question: { en: 'Do you offer personal training?' },
            answer: { en: 'Yes, we have certified personal trainers available. Personal training is included in the Elite plan and can be purchased as an add-on for other plans.' }
        },
        {
            question: { en: 'Is there a joining fee?' },
            answer: { en: 'No, we do not charge any hidden joining or initiation fees. You only pay for your selected subscription plan.' }
        },
        {
            question: { en: 'Can I cancel my membership at any time?' },
            answer: { en: 'Yes, monthly memberships can be canceled at any time with a 30-day notice. Yearly memberships are non-refundable.' }
        },
        {
            question: { en: 'Do you provide diet plans?' },
            answer: { en: 'Nutrition guidance is included in our Pro and Elite plans. Our experts will create a custom meal plan tailored to your goals.' }
        },
        {
            question: { en: 'Are group classes included in the membership?' },
            answer: { en: 'Group classes are included in the Pro and Elite memberships. Starter members can pay a small fee per class.' }
        },
        {
            question: { en: 'Is there parking available?' },
            answer: { en: 'Yes, we have a large, secure parking lot available free of charge for all our members.' }
        },
        {
            question: { en: 'What should I bring for my first workout?' },
            answer: { en: 'Please bring comfortable workout clothes, sports shoes, a water bottle, and a towel. A lock for the locker room is also recommended.' }
        },
        {
            question: { en: 'Can I freeze my membership if I travel?' },
            answer: { en: 'Yes, you can freeze your membership for up to 3 months per year if you are traveling or have a medical reason.' }
        },
        {
            question: { en: 'Do you have locker rooms and showers?' },
            answer: { en: 'Yes, we have fully equipped locker rooms with clean showers, complimentary toiletries, and hair dryers for all members.' }
        }
    ];
    for (const faq of faqs) {
        const exists = await Faq.findOne({ 'question.en': faq.question.en });
        if (!exists) {
            await Faq.create(faq);
        }
    }
    console.log('FAQs seeded.');

    await mongoose.disconnect();
    console.log('Seed 1 complete! Disconnected from DB.');
}

seed1().catch(err => {
    console.error('Seed 1 failed:', err);
    process.exit(1);
});
