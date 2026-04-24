import 'dotenv/config';
import mongoose from 'mongoose';
import Service from '../models/service.model';

async function fix() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not set in .env');

    await mongoose.connect(dbUrl);
    
    const services = await Service.find();
    for (const s of services) {
        if (s.icon && !s.icon.startsWith('http') && !s.icon.startsWith('/')) {
            // Replaces the invalid class name with the valid image URL
            s.icon = s.image;
            await s.save();
        }
    }
    console.log('Fixed service icons in DB.');
    await mongoose.disconnect();
}

fix().catch(err => {
    console.error(err);
    process.exit(1);
});
