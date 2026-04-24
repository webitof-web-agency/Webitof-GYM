import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/user.model';
import Schedule from '../models/schedule.model';
import Group from '../models/group.models';
import Testimonial from '../models/testimonial.model';

async function seed3() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not set in .env');

    console.log('Connecting to MongoDB…');
    await mongoose.connect(dbUrl);
    console.log('Connected to DB.');

    // 1. Users (Trainers and Members)
    console.log('Seeding Users (Trainers and Members)...');
    
    const hashedPassword = await bcrypt.hash('Password@123', 8);

    const trainers = [
        {
            name: 'Marcus Johnson',
            email: 'marcus.trainer@gymstick.com',
            phone: '555-0101',
            role: 'trainer',
            gender: 'Male',
            occupation: 'Fitness Instructor',
            about: 'Specializes in strength and conditioning with over 10 years of experience.',
            experience: '10 Years',
            image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: 'Priya Sharma',
            email: 'priya.yoga@gymstick.com',
            phone: '555-0102',
            role: 'trainer',
            gender: 'Female',
            occupation: 'Yoga Instructor',
            about: 'Certified Vinyasa and Hatha Yoga instructor focusing on mind-body connection.',
            experience: '8 Years',
            image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: 'Alex Rodriguez',
            email: 'alex.crossfit@gymstick.com',
            phone: '555-0103',
            role: 'trainer',
            gender: 'Male',
            occupation: 'CrossFit Coach',
            about: 'Former athlete turned CrossFit expert, helping clients push their limits.',
            experience: '6 Years',
            image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: 'Sophia Chen',
            email: 'sophia.pilates@gymstick.com',
            phone: '555-0104',
            role: 'trainer',
            gender: 'Female',
            occupation: 'Pilates Instructor',
            about: 'Passionate about core strength, posture, and rehabilitation through Pilates.',
            experience: '5 Years',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: 'David Okafor',
            email: 'david.cardio@gymstick.com',
            phone: '555-0105',
            role: 'trainer',
            gender: 'Male',
            occupation: 'HIIT & Cardio Coach',
            about: 'High-energy coach dedicated to maximizing calorie burn and cardiovascular health.',
            experience: '7 Years',
            image: 'https://images.unsplash.com/photo-1526506114636-f0331006eb46?q=80&w=1000&auto=format&fit=crop'
        }
    ];

    const members = [
        { name: 'John Doe', email: 'john.doe@example.com', phone: '555-0201', role: 'user', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-0202', role: 'user', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
        { name: 'Michael Brown', email: 'michael.b@example.com', phone: '555-0203', role: 'user', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { name: 'Emily Davis', email: 'emily.d@example.com', phone: '555-0204', role: 'user', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
        { name: 'Chris Wilson', email: 'chris.w@example.com', phone: '555-0205', role: 'user', image: 'https://randomuser.me/api/portraits/men/5.jpg' },
        { name: 'Sarah Miller', email: 'sarah.m@example.com', phone: '555-0206', role: 'user', image: 'https://randomuser.me/api/portraits/women/6.jpg' }
    ];

    const trainerDocs: any = {};
    const memberDocs: any = {};

    // Create Trainers
    for (const t of trainers) {
        let user = await User.findOne({ email: t.email });
        if (!user) {
            user = await User.create({
                uid: crypto.randomBytes(4).toString('hex'),
                ...t,
                password: hashedPassword
            });
        }
        trainerDocs[t.name] = user._id;
    }

    // Create Members
    for (const m of members) {
        let user = await User.findOne({ email: m.email });
        if (!user) {
            user = await User.create({
                uid: crypto.randomBytes(4).toString('hex'),
                ...m,
                password: hashedPassword
            });
        }
        memberDocs[m.name] = user._id;
    }
    console.log('Users seeded.');

    // 2. Schedules
    console.log('Seeding Schedules...');
    const schedules = [
        { trainer: trainerDocs['Marcus Johnson'], day: 'Monday', time_slots: '9:00 am', event: { en: 'Heavy Lifting 101' }, is_booked: false },
        { trainer: trainerDocs['Priya Sharma'], day: 'Monday', time_slots: '10:00 am', event: { en: 'Morning Vinyasa' }, is_booked: false },
        { trainer: trainerDocs['Alex Rodriguez'], day: 'Tuesday', time_slots: '6:00 pm', event: { en: 'CrossFit WOD' }, is_booked: false },
        { trainer: trainerDocs['Sophia Chen'], day: 'Wednesday', time_slots: '11:00 am', event: { en: 'Core Reformer Pilates' }, is_booked: false },
        { trainer: trainerDocs['David Okafor'], day: 'Thursday', time_slots: '5:00 pm', event: { en: 'HIIT Burn' }, is_booked: false },
        { trainer: trainerDocs['Marcus Johnson'], day: 'Friday', time_slots: '8:00 pm', event: { en: 'Strength & Conditioning' }, is_booked: false },
        { trainer: trainerDocs['Priya Sharma'], day: 'Saturday', time_slots: '9:00 am', event: { en: 'Weekend Hatha Yoga' }, is_booked: false },
        { trainer: trainerDocs['Alex Rodriguez'], day: 'Sunday', time_slots: '10:00 am', event: { en: 'Open Gym / CrossFit' }, is_booked: false },
        { trainer: trainerDocs['David Okafor'], day: 'Monday', time_slots: '7:00 pm', event: { en: 'Cardio Blast' }, is_booked: false },
        { trainer: trainerDocs['Sophia Chen'], day: 'Tuesday', time_slots: '9:00 am', event: { en: 'Morning Mat Pilates' }, is_booked: false }
    ];

    for (const sch of schedules) {
        const exists = await Schedule.findOne({ trainer: sch.trainer, day: sch.day, time_slots: sch.time_slots });
        if (!exists) {
            await Schedule.create(sch);
        }
    }
    console.log('Schedules seeded.');

    // 3. Testimonials
    console.log('Seeding Testimonials...');
    const testimonials = [
        { user: memberDocs['John Doe'], rating: 5, description: 'Absolutely love the environment! The trainers are fantastic and really care about your progress.', active: true },
        { user: memberDocs['Jane Smith'], rating: 5, description: 'Best gym in the city. The equipment is always clean and well-maintained. Highly recommend the yoga classes!', active: true },
        { user: memberDocs['Michael Brown'], rating: 4, description: 'Great facility with flexible timings. I just wish they had a few more squat racks during peak hours.', active: true },
        { user: memberDocs['Emily Davis'], rating: 5, description: 'Joined 6 months ago and I have never felt better. The CrossFit community here is incredibly supportive.', active: true },
        { user: memberDocs['Chris Wilson'], rating: 5, description: 'Excellent personal training. Marcus helped me lose 20 lbs and build muscle safely.', active: true },
        { user: memberDocs['Sarah Miller'], rating: 5, description: 'The Pilates classes with Sophia have completely fixed my posture and back pain. 10/10!', active: true }
    ];

    for (const t of testimonials) {
        const exists = await Testimonial.findOne({ user: t.user });
        if (!exists) {
            await Testimonial.create(t);
        }
    }
    console.log('Testimonials seeded.');

    // 4. Groups
    console.log('Seeding Groups...');
    const groups = [
        {
            name: { en: 'Morning Warriors' },
            facilities: [{ en: 'Access to early classes' }, { en: 'Free locker' }],
            members: [memberDocs['John Doe'], memberDocs['Jane Smith']],
            assign_trainers: [trainerDocs['Priya Sharma']],
            status: true,
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Evening Cardio Crew' },
            facilities: [{ en: 'Group cardio sessions' }, { en: 'Towel service' }],
            members: [memberDocs['Michael Brown'], memberDocs['Emily Davis']],
            assign_trainers: [trainerDocs['David Okafor']],
            status: true,
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Weekend Warriors' },
            facilities: [{ en: 'Weekend special classes' }, { en: 'Guest passes' }],
            members: [memberDocs['Chris Wilson'], memberDocs['Sarah Miller']],
            assign_trainers: [trainerDocs['Marcus Johnson']],
            status: true,
            image: 'https://images.unsplash.com/photo-1526506114636-f0331006eb46?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: { en: 'Elite Strength Team' },
            facilities: [{ en: 'Powerlifting racks access' }, { en: 'Chalk provided' }],
            members: [memberDocs['John Doe'], memberDocs['Michael Brown']],
            assign_trainers: [trainerDocs['Alex Rodriguez']],
            status: true,
            image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop'
        }
    ];

    for (const g of groups) {
        const exists = await Group.findOne({ 'name.en': g.name.en });
        if (!exists) {
            await Group.create(g);
        }
    }
    console.log('Groups seeded.');

    await mongoose.disconnect();
    console.log('Seed 3 complete! Disconnected from DB.');
}

seed3().catch(err => {
    console.error('Seed 3 failed:', err);
    process.exit(1);
});
