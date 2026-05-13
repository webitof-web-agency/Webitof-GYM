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
        settings.description = 'India\'s premier fitness destination — combining traditional strength training with modern techniques to help you reach your health goals.';
        settings.email = 'contact@webitofgym.in';
        settings.phone = '+91 98765 43210';
        settings.address = 'Plot No. 12, Sector 18, Noida, Uttar Pradesh - 201301';
        settings.facebook = 'https://facebook.com/webitofgym';
        settings.twitter = 'https://twitter.com/webitofgym';
        settings.instagram = 'https://instagram.com/webitofgym';
        settings.youtube = 'https://youtube.com/webitofgym';
        settings.footer_text = '© 2026 Webitof GYM. All rights reserved. Made in India 🇮🇳';
        await settings.save();
        console.log('Settings updated.');
    }

    // 2. Services — delete old, insert new
    console.log('Clearing old Services...');
    await Service.deleteMany({});
    console.log('Seeding Services...');
    const services = [
        {
            name: { en: 'Weight Training' },
            description: { en: 'Build raw strength and muscle mass with barbells, dumbbells, and resistance machines suited for all levels — from beginners to competitive powerlifters.' },
            icon: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=200',
            image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Yoga & Meditation' },
            description: { en: 'Embrace the ancient Indian science of Yoga. Our certified instructors guide sessions in Hatha, Ashtanga, and Pranayama to improve flexibility, focus, and mental peace.' },
            icon: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=200',
            image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Zumba & Dance Fitness' },
            description: { en: 'Enjoy high-energy Zumba and Bollywood dance fitness classes that make workouts feel like a celebration while burning serious calories.' },
            icon: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=200',
            image: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Cardio & Cycling' },
            description: { en: 'Boost cardiovascular endurance with our modern treadmills, stationary bikes, ellipticals, and high-energy indoor cycling classes led by certified coaches.' },
            icon: 'https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=200',
            image: 'https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'HIIT & Functional Training' },
            description: { en: 'Torch fat and build endurance with scientifically designed High-Intensity Interval Training and functional movement workouts tailored for the Indian climate and lifestyle.' },
            icon: 'https://images.pexels.com/photos/2827400/pexels-photo-2827400.jpeg?auto=compress&cs=tinysrgb&w=200',
            image: 'https://images.pexels.com/photos/2827400/pexels-photo-2827400.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Kabaddi & Wrestling Conditioning' },
            description: { en: 'Train like a champion with sport-specific conditioning for Kabaddi, Kushti (wrestling), and other traditional Indian sports under the guidance of experienced coaches.' },
            icon: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=200',
            image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Nutrition & Diet Consultation' },
            description: { en: 'Get personalised Indian diet plans from our certified nutritionists, incorporating traditional foods like dal, millets, and paneer for optimal fitness results.' },
            icon: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200',
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'CrossFit' },
            description: { en: 'Challenge yourself with high-intensity functional movements. Our CrossFit classes are designed to build strength, agility, and endurance through varied daily workouts.' },
            icon: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=200',
            image: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=1000'
        }
    ];
    await Service.insertMany(services);
    console.log('Services seeded.');

    // 3. Features — delete old, insert new
    console.log('Clearing old Features...');
    await Feature.deleteMany({});
    console.log('Seeding Features...');
    const features = [
        {
            name: { en: 'Certified Indian Trainers' },
            description: { en: 'Train with ISSA & Sports Authority of India (SAI) certified coaches who understand Indian body types, dietary habits, and fitness goals.' },
            image: 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'World-Class Equipment' },
            description: { en: 'Access premium imported and Indian-made fitness equipment — updated regularly to ensure you always have the best tools for your training.' },
            image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Flexible Timings' },
            description: { en: 'Open from 5:00 AM to 11:00 PM, 7 days a week, including all national holidays — so you never miss a workout.' },
            image: 'https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Indian Diet & Nutrition Plans' },
            description: { en: 'Customised meal plans based on your goals, using traditional Indian superfoods like turmeric, ashwagandha, ghee, and seasonal vegetables.' },
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Group Batch Classes' },
            description: { en: 'Stay motivated with our community batch classes for Yoga, Zumba, HIIT, and more — specially structured for Indian working professionals.' },
            image: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Progress Tracking & Body Analysis' },
            description: { en: 'Track your fitness journey with monthly body composition analysis, strength assessments, and digital reports powered by modern technology.' },
            image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=1000'
        }
    ];
    await Feature.insertMany(features);
    console.log('Features seeded.');

    // 4. Subscriptions — delete old, insert new
    console.log('Clearing old Subscriptions...');
    await Subscription.deleteMany({});
    console.log('Seeding Subscriptions...');
    const subscriptions = [
        {
            name: { en: 'Sadharan (Basic)' },
            image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1000',
            monthly_price: 999,
            yearly_price: 9999,
            features: [
                { en: 'Access to All Gym Equipment' },
                { en: 'Locker & Changing Room Access' },
                { en: '1 Free Fitness Assessment' },
                { en: 'Free Wi-Fi' },
                { en: 'Standard Customer Support' }
            ],
            is_active: true
        },
        {
            name: { en: 'Shaktiman (Pro)' },
            image: 'https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=1000',
            monthly_price: 1999,
            yearly_price: 19999,
            features: [
                { en: 'All Sadharan (Basic) Features' },
                { en: 'Unlimited Group Batch Classes' },
                { en: 'Monthly Body Composition Analysis' },
                { en: 'Indian Diet Plan (Basic)' },
                { en: '1 Guest Pass per Month' },
                { en: 'Priority Support' }
            ],
            is_active: true
        },
        {
            name: { en: 'Pratham (Elite)' },
            image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1000',
            monthly_price: 3499,
            yearly_price: 34999,
            features: [
                { en: 'All Shaktiman (Pro) Features' },
                { en: 'Unlimited Personal Training Sessions' },
                { en: 'Custom Nutrition Plan with Indian Meals' },
                { en: 'Access to Steam Room & Sauna' },
                { en: 'Priority Batch Booking' },
                { en: '24/7 Dedicated WhatsApp Support' },
                { en: 'Webitof GYM Branded Merchandise Kit' }
            ],
            is_active: true
        }
    ];
    await Subscription.insertMany(subscriptions);
    console.log('Subscriptions seeded.');

    // 5. FAQs — delete old, insert new
    console.log('Clearing old FAQs...');
    await Faq.deleteMany({});
    console.log('Seeding FAQs...');
    const faqs = [
        {
            question: { en: 'What are your gym timings?' },
            answer: { en: 'We are open from 5:00 AM to 11:00 PM, 7 days a week, including all Indian national holidays and festivals, so you can maintain your fitness routine year-round.' }
        },
        {
            question: { en: 'Do you offer personal training?' },
            answer: { en: 'Yes! All our personal trainers are certified by the Sports Authority of India (SAI) or ISSA. Personal training is included in the Pratham (Elite) plan and available as an add-on for other plans.' }
        },
        {
            question: { en: 'Is there a joining or registration fee?' },
            answer: { en: 'No hidden charges! We believe in complete transparency. You only pay the subscription plan amount — no joining fee, no registration fee.' }
        },
        {
            question: { en: 'Can I cancel or pause my membership?' },
            answer: { en: 'Monthly memberships can be cancelled any time with a 15-day notice. We also offer a freeze option for up to 2 months per year for medical, travel, or personal reasons.' }
        },
        {
            question: { en: 'Do you provide vegetarian-friendly diet plans?' },
            answer: { en: 'Absolutely! Our nutritionists specialise in creating high-protein, balanced meal plans using traditional Indian vegetarian foods like paneer, dal, millets, soya, and sprouts.' }
        },
        {
            question: { en: 'Are group classes included in the membership?' },
            answer: { en: 'Group classes like Yoga, Zumba, and HIIT are included in the Shaktiman (Pro) and Pratham (Elite) plans. Sadharan (Basic) members can attend at a nominal fee of ₹99 per class.' }
        },
        {
            question: { en: 'Is parking available at the gym?' },
            answer: { en: 'Yes, we have a spacious parking area for both two-wheelers and four-wheelers, free of charge for all active members.' }
        },
        {
            question: { en: 'What should I carry for my first visit?' },
            answer: { en: 'Please bring a valid government ID, comfortable workout clothes, sports shoes, a reusable water bottle, and a small towel. We provide lockers at no extra cost.' }
        },
        {
            question: { en: 'Do you have separate sections for men and women?' },
            answer: { en: 'Yes, we have a dedicated ladies\' workout zone for privacy and comfort, along with separate changing rooms and shower facilities for men and women.' }
        },
        {
            question: { en: 'Is this gym suitable for senior citizens?' },
            answer: { en: 'Definitely! We have specially designed fitness programs for senior citizens focusing on joint health, flexibility, and balance. Our trainers are experienced in working with elderly members.' }
        }
    ];
    await Faq.insertMany(faqs);
    console.log('FAQs seeded.');

    await mongoose.disconnect();
    console.log('Seed 1 complete! Disconnected from DB.');
}

seed1().catch(err => {
    console.error('Seed 1 failed:', err);
    process.exit(1);
});
