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

    const hashedPassword = await bcrypt.hash('Password@123', 8);

    // 1. Delete old trainer/member/schedule/testimonial/group data
    console.log('Clearing old Schedules, Testimonials, Groups...');
    await Schedule.deleteMany({});
    await Testimonial.deleteMany({});
    await Group.deleteMany({});

    // Delete only trainer and user role accounts (keep admin)
    console.log('Clearing old Trainer and Member accounts...');
    await User.deleteMany({ role: { $in: ['trainer', 'user'] } });

    // 2. Indian Trainers
    console.log('Seeding Indian Trainers...');
    const trainers = [
        {
            name: 'Arjun Sharma',
            email: 'arjun.trainer@webitofgym.in',
            phone: '9876500101',
            role: 'trainer',
            gender: 'Male',
            occupation: 'Strength & Conditioning Coach',
            about: 'Arjun is a SAI-certified coach from Delhi with over 12 years of experience in powerlifting and functional strength training for Indian athletes.',
            experience: '12 Years',
            image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
            name: 'Priya Iyer',
            email: 'priya.yoga@webitofgym.in',
            phone: '9876500102',
            role: 'trainer',
            gender: 'Female',
            occupation: 'Yoga & Meditation Instructor',
            about: 'Priya is a Sivananda Yoga certified instructor from Chennai who specialises in Hatha, Ashtanga, and therapeutic yoga for stress relief and flexibility.',
            experience: '9 Years',
            image: 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
            name: 'Rahul Verma',
            email: 'rahul.hiit@webitofgym.in',
            phone: '9876500103',
            role: 'trainer',
            gender: 'Male',
            occupation: 'HIIT & CrossFit Coach',
            about: 'Rahul is a CrossFit Level 2 trainer from Mumbai who trains competitive athletes and working professionals to achieve peak functional fitness.',
            experience: '7 Years',
            image: 'https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
            name: 'Sneha Kulkarni',
            email: 'sneha.zumba@webitofgym.in',
            phone: '9876500104',
            role: 'trainer',
            gender: 'Female',
            occupation: 'Zumba & Dance Fitness Instructor',
            about: 'Sneha is a licensed Zumba instructor from Pune who combines Bollywood, folk, and Latin rhythms to make fitness an absolute joy for all age groups.',
            experience: '6 Years',
            image: 'https://images.pexels.com/photos/3621184/pexels-photo-3621184.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
            name: 'Vikram Nair',
            email: 'vikram.cardio@webitofgym.in',
            phone: '9876500105',
            role: 'trainer',
            gender: 'Male',
            occupation: 'Cardio & Sports Conditioning Coach',
            about: 'Vikram is a former national-level swimmer from Kochi, now a certified sports conditioning coach specialising in cardiovascular fitness and swimming drills.',
            experience: '8 Years',
            image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
    ];

    // 3. Indian Members
    console.log('Seeding Indian Members...');
    const members = [
        { name: 'Amit Gupta', email: 'amit.gupta@gmail.com', phone: '9812340001', role: 'user', image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { name: 'Kavya Reddy', email: 'kavya.reddy@gmail.com', phone: '9812340002', role: 'user', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { name: 'Rohit Mishra', email: 'rohit.mishra@gmail.com', phone: '9812340003', role: 'user', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { name: 'Anjali Singh', email: 'anjali.singh@gmail.com', phone: '9812340004', role: 'user', image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { name: 'Suresh Yadav', email: 'suresh.yadav@gmail.com', phone: '9812340005', role: 'user', image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { name: 'Meena Joshi', email: 'meena.joshi@gmail.com', phone: '9812340006', role: 'user', image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600' }
    ];

    const trainerDocs: any = {};
    const memberDocs: any = {};

    for (const t of trainers) {
        const user = await User.create({
            uid: crypto.randomBytes(4).toString('hex'),
            ...t,
            password: hashedPassword
        });
        trainerDocs[t.name] = user._id;
    }
    console.log('Trainers seeded.');

    for (const m of members) {
        const user = await User.create({
            uid: crypto.randomBytes(4).toString('hex'),
            ...m,
            password: hashedPassword
        });
        memberDocs[m.name] = user._id;
    }
    console.log('Members seeded.');

    // 4. Schedules
    console.log('Seeding Schedules...');
    const schedules = [
        { trainer: trainerDocs['Arjun Sharma'], day: 'Monday', time_slots: '9:00 am', event: { en: 'Morning Powerlifting Session' }, is_booked: false },
        { trainer: trainerDocs['Priya Iyer'], day: 'Monday', time_slots: '10:00 am', event: { en: 'Hatha Yoga & Pranayama' }, is_booked: false },
        { trainer: trainerDocs['Rahul Verma'], day: 'Tuesday', time_slots: '7:00 pm', event: { en: 'CrossFit WOD' }, is_booked: false },
        { trainer: trainerDocs['Sneha Kulkarni'], day: 'Wednesday', time_slots: '10:00 am', event: { en: 'Bollywood Zumba Blast' }, is_booked: false },
        { trainer: trainerDocs['Vikram Nair'], day: 'Thursday', time_slots: '6:00 pm', event: { en: 'Cardio Endurance Circuit' }, is_booked: false },
        { trainer: trainerDocs['Arjun Sharma'], day: 'Friday', time_slots: '7:00 pm', event: { en: 'Strength & Conditioning' }, is_booked: false },
        { trainer: trainerDocs['Priya Iyer'], day: 'Saturday', time_slots: '9:00 am', event: { en: 'Weekend Ashtanga Yoga' }, is_booked: false },
        { trainer: trainerDocs['Rahul Verma'], day: 'Sunday', time_slots: '10:00 am', event: { en: 'HIIT & Functional Training' }, is_booked: false },
        { trainer: trainerDocs['Vikram Nair'], day: 'Monday', time_slots: '8:00 pm', event: { en: 'Swimming Drills & Laps' }, is_booked: false },
        { trainer: trainerDocs['Sneha Kulkarni'], day: 'Tuesday', time_slots: '9:00 am', event: { en: 'Morning Dance Fitness' }, is_booked: false }
    ];
    await Schedule.insertMany(schedules);
    console.log('Schedules seeded.');

    // 5. Testimonials
    console.log('Seeding Testimonials...');
    const testimonials = [
        { user: memberDocs['Amit Gupta'], rating: 5, description: 'This gym completely changed my life! Arjun sir\'s powerlifting program helped me gain 8 kg of muscle in just 4 months. Best gym in Noida!', active: true },
        { user: memberDocs['Kavya Reddy'], rating: 5, description: 'Priya ma\'am\'s yoga sessions are absolutely brilliant. I\'ve lost 12 kg and my back pain has completely gone. The ladies\' zone is very comfortable.', active: true },
        { user: memberDocs['Rohit Mishra'], rating: 4, description: 'Rahul bhai\'s CrossFit classes are intense but incredibly rewarding. The community here is super motivating. Just wish the parking was a bit bigger!', active: true },
        { user: memberDocs['Anjali Singh'], rating: 5, description: 'Sneha ma\'am\'s Zumba classes are a highlight of my week! I never thought working out could be this much fun. Lost 7 kg in 3 months!', active: true },
        { user: memberDocs['Suresh Yadav'], rating: 5, description: 'The Pratham Elite plan is worth every rupee. Personal training with Arjun sir, custom Indian diet plan, steam room — it\'s a complete package!', active: true },
        { user: memberDocs['Meena Joshi'], rating: 5, description: 'As a senior citizen, I was hesitant to join a gym. But the trainers here are so patient and supportive. The senior wellness program is excellent!', active: true }
    ];
    await Testimonial.insertMany(testimonials);
    console.log('Testimonials seeded.');

    // 6. Groups
    console.log('Seeding Groups...');
    const groups = [
        {
            name: { en: 'Brahmastra Strength Squad' },
            facilities: [{ en: 'Priority access to powerlifting racks' }, { en: 'Free chalk & straps' }, { en: 'Monthly strength test' }],
            members: [memberDocs['Amit Gupta'], memberDocs['Rohit Mishra']],
            assign_trainers: [trainerDocs['Arjun Sharma']],
            status: true,
            image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Shakti Yoga Circle' },
            facilities: [{ en: 'Dedicated yoga studio access' }, { en: 'Free yoga mat' }, { en: 'Meditation sessions' }],
            members: [memberDocs['Kavya Reddy'], memberDocs['Anjali Singh'], memberDocs['Meena Joshi']],
            assign_trainers: [trainerDocs['Priya Iyer']],
            status: true,
            image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Desi Zumba Tribe' },
            facilities: [{ en: 'Group dance fitness sessions' }, { en: 'Towel service' }, { en: 'Monthly dance-off event' }],
            members: [memberDocs['Anjali Singh'], memberDocs['Meena Joshi']],
            assign_trainers: [trainerDocs['Sneha Kulkarni']],
            status: true,
            image: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=1000'
        },
        {
            name: { en: 'Iron Warriors HIIT Crew' },
            facilities: [{ en: 'CrossFit box access' }, { en: 'Performance supplements discount' }, { en: 'Weekly WOD challenges' }],
            members: [memberDocs['Rohit Mishra'], memberDocs['Suresh Yadav']],
            assign_trainers: [trainerDocs['Rahul Verma']],
            status: true,
            image: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=1000'
        }
    ];
    await Group.insertMany(groups);
    console.log('Groups seeded.');

    await mongoose.disconnect();
    console.log('Seed 3 complete! Disconnected from DB.');
}

seed3().catch(err => {
    console.error('Seed 3 failed:', err);
    process.exit(1);
});
