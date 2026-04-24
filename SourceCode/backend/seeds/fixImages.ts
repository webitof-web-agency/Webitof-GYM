import 'dotenv/config';
import mongoose from 'mongoose';
import Service from '../models/service.model';
import Feature from '../models/feature.model';
import Subscription from '../models/subscription.model';
import Product from '../models/product/product.model';
import User from '../models/user.model';
import Group from '../models/group.models';
import Blog from '../models/blog/blog.model';
import Event from '../models/event.model';
import Gallery from '../models/gallery.model';

async function fixImages() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not set in .env');

    console.log('Connecting to MongoDB…');
    await mongoose.connect(dbUrl);
    console.log('Connected to DB.');

    // Using loremflickr with gym and fitness tags to get gym-related images
    function getNewImage(id: number, type: string = 'gym,fitness') {
        return `https://loremflickr.com/800/600/${type}?lock=${id}`;
    }

    let counter = 1;

    console.log('Updating Services...');
    const services = await Service.find();
    for (const s of services) {
        s.image = getNewImage(counter, 'gym,workout');
        s.icon = s.image;
        await s.save();
        counter++;
    }

    console.log('Updating Features...');
    const features = await Feature.find();
    for (const f of features) {
        f.image = getNewImage(counter, 'gym,fitness');
        await f.save();
        counter++;
    }

    console.log('Updating Subscriptions...');
    const subs = await Subscription.find();
    for (const s of subs) {
        s.image = getNewImage(counter, 'gym');
        await s.save();
        counter++;
    }

    console.log('Updating Products...');
    const prods = await Product.find();
    for (const p of prods) {
        const img = getNewImage(counter, 'dumbbell,protein');
        p.thumbnail_image = img;
        p.images = [img];
        await p.save();
        counter++;
    }

    console.log('Updating Users...');
    const users = await User.find();
    for (const u of users) {
        if (u.image && (u.image.includes('unsplash') || u.image.includes('picsum'))) {
            u.image = getNewImage(counter, 'portrait,fitness');
            await u.save();
            counter++;
        }
    }

    console.log('Updating Groups...');
    const groups = await Group.find();
    for (const g of groups) {
        g.image = getNewImage(counter, 'group,fitness');
        await g.save();
        counter++;
    }

    console.log('Updating Blogs...');
    const blogs = await Blog.find();
    for (const b of blogs) {
        b.image = getNewImage(counter, 'workout');
        await b.save();
        counter++;
    }

    console.log('Updating Events...');
    const events = await Event.find();
    for (const e of events) {
        e.image = getNewImage(counter, 'event,gym');
        await e.save();
        counter++;
    }

    console.log('Updating Gallery...');
    const gallery = await Gallery.find();
    for (const g of gallery) {
        g.image = getNewImage(counter, 'gym,bodybuilding');
        await g.save();
        counter++;
    }

    console.log('Images fixed with GYM-related placeholders!');
    await mongoose.disconnect();
}

fixImages().catch(err => {
    console.error('Failed to fix images:', err);
    process.exit(1);
});
