import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/user.model';
import Settings from '../models/settings.model';
import Language from '../models/language.model';
import Currency from '../models/currency.model';
import { Theme } from '../models/theme.model';

// ─── Admin credentials (change before running in production) ─────────────────
const ADMIN = {
    name:     'Admin',
    email:    'admin@gymstick.com',
    phone:    '0000000000',
    password: 'Admin@123',
};
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not set in .env');

    console.log('Connecting to MongoDB…');
    await mongoose.connect(dbUrl);
    console.log('Connected.');

    // ── Guard: skip if admin already exists ──────────────────────────────────
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
        console.log(`Admin already exists → ${existing.email}`);
        await mongoose.disconnect();
        return;
    }

    // ── Create admin user ────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(ADMIN.password, 8);
    const uid = crypto.randomBytes(4).toString('hex');

    const admin = await User.create({
        uid,
        name:     ADMIN.name,
        email:    ADMIN.email,
        phone:    ADMIN.phone,
        role:     'admin',
        password: hashedPassword,
    });
    console.log(`✓ Admin created → ${admin.email}  (uid: ${admin.uid})`);

    // ── Initial settings (skip if already present) ───────────────────────────
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
        await Settings.create({ title: 'Gymstick' });
        console.log('✓ Default settings created.');
    }

    const langCount = await Language.countDocuments();
    if (langCount === 0) {
        await Language.create({
            name: 'English', code: 'en',
            active: true, flag: 'us', default: true,
        });
        console.log('✓ Default language created.');
    }

    const currCount = await Currency.countDocuments();
    if (currCount === 0) {
        await Currency.create({
            name: 'US Dollar', code: 'USD', symbol: '$',
            rate: 1, default: true, placement: 'before',
        });
        console.log('✓ Default currency created.');
    }

    const themeCount = await Theme.countDocuments();
    if (themeCount === 0) {
        await Theme.create({ name: 'home1', isDefault: true });
        await Theme.create({ name: 'home2', isDefault: false });
        console.log('✓ Default themes created.');
    }

    await mongoose.disconnect();
    console.log('\nSeed complete!');
    console.log(`  Email   : ${ADMIN.email}`);
    console.log(`  Password: ${ADMIN.password}`);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
