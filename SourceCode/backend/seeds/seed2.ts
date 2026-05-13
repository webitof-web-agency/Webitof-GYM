import 'dotenv/config';
import mongoose from 'mongoose';
import ProductCategory from '../models/product/category.model';
import Product from '../models/product/product.model';
import Coupon from '../models/product/coupon.model';

async function seed2() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not set in .env');

    console.log('Connecting to MongoDB…');
    await mongoose.connect(dbUrl);
    console.log('Connected to DB.');

    // 1. Product Categories — delete old, insert new
    console.log('Clearing old Product Categories & Products...');
    await Product.deleteMany({});
    await ProductCategory.deleteMany({});
    console.log('Seeding Product Categories...');
    const categories = ['Supplements', 'Apparel', 'Equipment', 'Accessories', 'Nutrition'];
    const categoryDocs: any = {};
    for (const catName of categories) {
        const cat = await ProductCategory.create({ name: { en: catName } });
        categoryDocs[catName] = cat._id;
    }
    console.log('Product Categories seeded.');

    // 2. Products
    console.log('Seeding Products...');
    const products = [
        {
            name: { en: '100% Whey Protein Isolate' },
            short_description: { en: 'Premium whey protein isolate for fast muscle recovery.' },
            description: { en: 'Our 100% Whey Protein Isolate delivers 25g of pure protein per serving. Ideal for post-workout recovery, it helps build lean muscle and reduce soreness.' },
            price: 49.99,
            quantity: 100,
            category: categoryDocs['Supplements'],
            thumbnail_image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Pre-Workout Explosive Energy' },
            short_description: { en: 'High-stimulant pre-workout formula for peak performance.' },
            description: { en: 'Maximize your workout intensity with caffeine, beta-alanine, and citrulline malate for insane pumps and focus.' },
            price: 34.99,
            quantity: 50,
            category: categoryDocs['Supplements'],
            thumbnail_image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'BCAA Recovery Formula' },
            short_description: { en: 'Essential amino acids for intra-workout recovery.' },
            description: { en: 'Speed up recovery with our 2:1:1 ratio BCAA powder. Prevents muscle breakdown and reduces soreness.' },
            price: 29.99,
            quantity: 75,
            category: categoryDocs['Supplements'],
            thumbnail_image: 'https://images.pexels.com/photos/4047058/pexels-photo-4047058.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/4047058/pexels-photo-4047058.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: "Men's Compression Performance Tee" },
            short_description: { en: 'Breathable, sweat-wicking compression t-shirt.' },
            description: { en: 'Stay dry and comfortable during the most intense sessions with this ultra-breathable compression tee.' },
            price: 24.99,
            quantity: 200,
            category: categoryDocs['Apparel'],
            thumbnail_image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: "Women's High-Waist Gym Leggings" },
            short_description: { en: 'Squat-proof, comfortable sports leggings.' },
            description: { en: '4-way stretch fabric that is 100% squat-proof. Designed for maximum support and comfort.' },
            price: 39.99,
            quantity: 150,
            category: categoryDocs['Apparel'],
            thumbnail_image: 'https://images.pexels.com/photos/3621184/pexels-photo-3621184.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/3621184/pexels-photo-3621184.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Pro Resistance Bands Set' },
            short_description: { en: 'Set of 5 heavy-duty resistance bands.' },
            description: { en: 'Versatile set of 5 resistance bands ranging from 10 to 50 lbs. Includes handles and door anchor.' },
            price: 19.99,
            quantity: 120,
            category: categoryDocs['Equipment'],
            thumbnail_image: 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Adjustable Dumbbell Set (up to 50 lbs)' },
            short_description: { en: 'Space-saving adjustable dumbbell system.' },
            description: { en: 'Replace a full dumbbell rack with a single adjustable unit. Switch weights with a simple dial.' },
            price: 149.99,
            quantity: 30,
            category: categoryDocs['Equipment'],
            thumbnail_image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Speed Jump Rope' },
            short_description: { en: 'Lightweight jump rope for cardio training.' },
            description: { en: 'Perfect for intense cardio sessions with a smooth ball-bearing spin and lightweight aluminum handle.' },
            price: 12.99,
            quantity: 300,
            category: categoryDocs['Equipment'],
            thumbnail_image: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Leather Weightlifting Gloves' },
            short_description: { en: 'Durable gloves with wrist support.' },
            description: { en: 'Genuine leather gloves with built-in wrist wraps for extra support during heavy lifts.' },
            price: 18.99,
            quantity: 180,
            category: categoryDocs['Accessories'],
            thumbnail_image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Stainless Steel Shaker Bottle' },
            short_description: { en: 'Odor-resistant 24oz protein shaker.' },
            description: { en: 'Leak-proof, insulated stainless steel shaker bottle to keep your supplements fresh and cold.' },
            price: 22.99,
            quantity: 250,
            category: categoryDocs['Accessories'],
            thumbnail_image: 'https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'High-Protein Energy Bar Pack (12-Count)' },
            short_description: { en: 'Delicious on-the-go protein bars.' },
            description: { en: '20g protein and only 2g sugar per bar. Peanut butter chocolate flavor — perfect post-workout fuel.' },
            price: 29.99,
            quantity: 80,
            category: categoryDocs['Nutrition'],
            thumbnail_image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Complete Meal Replacement Shake' },
            short_description: { en: 'Nutritionally complete powder mix.' },
            description: { en: 'Balanced protein, carbs, healthy fats, and 27 essential vitamins and minerals in one quick shake.' },
            price: 54.99,
            quantity: 60,
            category: categoryDocs['Nutrition'],
            thumbnail_image: 'https://images.pexels.com/photos/4047058/pexels-photo-4047058.jpeg?auto=compress&cs=tinysrgb&w=1000',
            images: ['https://images.pexels.com/photos/4047058/pexels-photo-4047058.jpeg?auto=compress&cs=tinysrgb&w=1000'],
            in_stock: true,
            is_active: true
        }
    ];
    await Product.insertMany(products);
    console.log('Products seeded.');

    // 3. Coupons — delete old, insert new
    console.log('Clearing old Coupons...');
    await Coupon.deleteMany({});
    console.log('Seeding Coupons...');
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const coupons = [
        { name: 'Welcome 10% Off', code: 'WELCOME10', discount: 10, type: 'percentage', usage_limit_per_user: 1, expire_at: oneYearFromNow, status: true },
        { name: 'Summer Sale 20% Off', code: 'SUMMER20', discount: 20, type: 'percentage', usage_limit_per_user: 1, expire_at: oneYearFromNow, status: true },
        { name: 'Flat Discount', code: 'FLAT500', discount: 50, type: 'flat', minimum_order_amount: 200, usage_limit_per_user: 1, expire_at: oneYearFromNow, status: true },
        { name: 'Member 15% Discount', code: 'MEMBER15', discount: 15, type: 'percentage', expire_at: oneYearFromNow, status: true }
    ];
    await Coupon.insertMany(coupons);
    console.log('Coupons seeded.');

    await mongoose.disconnect();
    console.log('Seed 2 complete! Disconnected from DB.');
}

seed2().catch(err => {
    console.error('Seed 2 failed:', err);
    process.exit(1);
});
