import 'dotenv/config';
import mongoose from 'mongoose';
import axios from 'axios';
import Service from '../models/service.model';
import Feature from '../models/feature.model';
import Subscription from '../models/subscription.model';
import Product from '../models/product/product.model';
import User from '../models/user.model';
import Group from '../models/group.models';
import Blog from '../models/blog/blog.model';
import Event from '../models/event.model';
import Gallery from '../models/gallery.model';

const API_KEY = 'FPSX7c48dc9083a72656bd1154d958b273bf';

async function fetchFreepikImages(term: string, limit: number = 20) {
    try {
        const response = await axios.get('https://api.freepik.com/v1/resources', {
            params: {
                term,
                limit,
                'filters[content_type][]': 'photo'
            },
            headers: {
                'Accept-Language': 'en-US',
                'Accept': 'application/json',
                'x-freepik-api-key': API_KEY
            }
        });
        return response.data.data.map((d: any) => {
            let url = d.image?.source?.url || '';
            // Ensure HTTPS for Next.js image compatibility
            return url.replace('http://', 'https://');
        }).filter((u: string) => !!u);
    } catch (e: any) {
        console.error(`Error fetching Freepik for ${term}:`, e.response?.data || e.message);
        return [];
    }
}

async function freepikSeed() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not set in .env');

    console.log('Connecting to MongoDB…');
    await mongoose.connect(dbUrl);
    console.log('Connected to DB.');

    console.log('Fetching images from Freepik API...');
    const gymImages = await fetchFreepikImages('gym workout', 30);
    const trainerImages = await fetchFreepikImages('fitness trainer portrait', 10);
    const productImages = await fetchFreepikImages('gym equipment', 20);
    const yogaImages = await fetchFreepikImages('yoga class', 10);
    const supplementImages = await fetchFreepikImages('protein powder', 10);

    // Helper to get random image from array
    const getRandom = (arr: string[], fallback: string) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : fallback;
    const fallbackImage = 'https://picsum.photos/800/600';

    console.log('Updating Services...');
    const services = await Service.find();
    for (const s of services) {
        s.image = getRandom(gymImages, fallbackImage);
        s.icon = s.image;
        await s.save();
    }

    console.log('Updating Features...');
    const features = await Feature.find();
    for (const f of features) {
        f.image = getRandom(gymImages, fallbackImage);
        await f.save();
    }

    console.log('Updating Subscriptions...');
    const subs = await Subscription.find();
    for (const s of subs) {
        s.image = getRandom(gymImages, fallbackImage);
        await s.save();
    }

    console.log('Updating Products...');
    const prods = await Product.find();
    for (const p of prods) {
        // Try to match product type if possible
        let imgs = productImages;
        if (p.name?.get('en')?.toLowerCase().includes('protein')) imgs = supplementImages;
        
        const img = getRandom(imgs, fallbackImage);
        p.thumbnail_image = img;
        p.images = [img];
        await p.save();
    }

    console.log('Updating Users (Trainers)...');
    const users = await User.find({ role: 'trainer' });
    for (const u of users) {
        u.image = getRandom(trainerImages, fallbackImage);
        await u.save();
    }

    console.log('Updating Groups...');
    const groups = await Group.find();
    for (const g of groups) {
        g.image = getRandom(gymImages, fallbackImage);
        await g.save();
    }

    console.log('Updating Blogs...');
    const blogs = await Blog.find();
    for (const b of blogs) {
        b.image = getRandom(gymImages, fallbackImage);
        await b.save();
    }

    console.log('Updating Events...');
    const events = await Event.find();
    for (const e of events) {
        e.image = getRandom(gymImages, fallbackImage);
        await e.save();
    }

    console.log('Updating Gallery...');
    const gallery = await Gallery.find();
    for (const g of gallery) {
        g.image = getRandom([...gymImages, ...yogaImages], fallbackImage);
        await g.save();
    }

    console.log('Freepik Images successfully seeded!');
    await mongoose.disconnect();
}

freepikSeed().catch(err => {
    console.error('Failed to seed Freepik images:', err);
    process.exit(1);
});
