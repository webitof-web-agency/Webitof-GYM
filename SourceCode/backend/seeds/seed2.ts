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

    // 1. Product Categories
    console.log('Seeding Product Categories...');
    const categories = ['Supplements', 'Apparel', 'Equipment', 'Accessories', 'Nutrition'];
    const categoryDocs: any = {};
    for (const catName of categories) {
        let cat = await ProductCategory.findOne({ 'name.en': catName });
        if (!cat) {
            cat = await ProductCategory.create({ name: { en: catName } });
        }
        categoryDocs[catName] = cat._id;
    }
    console.log('Product Categories seeded.');

    // 2. Products
    console.log('Seeding Products...');
    const products = [
        {
            name: { en: '100% Whey Protein Isolate' },
            short_description: { en: 'Premium whey protein isolate for fast muscle recovery.' },
            description: { en: 'Our 100% Whey Protein Isolate delivers 25g of pure, fast-absorbing protein per serving. Ideal for post-workout recovery, it helps build lean muscle and reduce soreness.' },
            price: 49.99,
            quantity: 100,
            category: categoryDocs['Supplements'],
            thumbnail_image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Pre-Workout Explosive Energy' },
            short_description: { en: 'High-stimulant pre-workout formula.' },
            description: { en: 'Maximize your workout intensity with our Explosive Energy pre-workout. Formulated with caffeine, beta-alanine, and citrulline malate for insane pumps and focus.' },
            price: 34.99,
            quantity: 50,
            category: categoryDocs['Supplements'],
            thumbnail_image: 'https://images.unsplash.com/photo-1622486950666-88022a1ce02b?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1622486950666-88022a1ce02b?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'BCAA Recovery Formula' },
            short_description: { en: 'Essential amino acids for intra-workout recovery.' },
            description: { en: 'Speed up recovery and prevent muscle breakdown with our 2:1:1 ratio BCAA powder. Delicious fruit punch flavor.' },
            price: 29.99,
            quantity: 75,
            category: categoryDocs['Supplements'],
            thumbnail_image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Men\'s Compression Performance Tee' },
            short_description: { en: 'Breathable, sweat-wicking compression t-shirt.' },
            description: { en: 'Enhance your performance with this ultra-comfortable compression tee. Designed to keep you dry and supported during intense training.' },
            price: 24.99,
            quantity: 200,
            category: categoryDocs['Apparel'],
            thumbnail_image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Women\'s High-Waist Gym Leggings' },
            short_description: { en: 'Squat-proof, comfortable sports leggings.' },
            description: { en: 'Feel confident and supported in our high-waist gym leggings. Featuring a 4-way stretch fabric that is 100% squat-proof.' },
            price: 39.99,
            quantity: 150,
            category: categoryDocs['Apparel'],
            thumbnail_image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Pro Resistance Bands Set' },
            short_description: { en: 'Set of 5 heavy-duty resistance bands.' },
            description: { en: 'Take your workout anywhere with this versatile set of 5 resistance bands ranging from 10lbs to 50lbs. Includes handles and door anchor.' },
            price: 19.99,
            quantity: 120,
            category: categoryDocs['Equipment'],
            thumbnail_image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Adjustable Dumbbell Set (up to 50 lbs)' },
            short_description: { en: 'Space-saving adjustable dumbbell system.' },
            description: { en: 'Replace a full rack of weights with this single, adjustable dumbbell. Easily switch from 5 to 50 lbs with a simple dial mechanism.' },
            price: 149.99,
            quantity: 30,
            category: categoryDocs['Equipment'],
            thumbnail_image: 'https://images.unsplash.com/photo-1638097960686-2187d903e1c6?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1638097960686-2187d903e1c6?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Speed Jump Rope' },
            short_description: { en: 'Lightweight jump rope for cardio training.' },
            description: { en: 'Perfect for double-unders and intense cardio. Features a lightweight aluminum handle and a smooth ball-bearing spin.' },
            price: 12.99,
            quantity: 300,
            category: categoryDocs['Equipment'],
            thumbnail_image: 'https://images.unsplash.com/photo-1515522502621-c45244ddf7bd?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1515522502621-c45244ddf7bd?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Leather Weightlifting Gloves' },
            short_description: { en: 'Durable gloves with wrist support.' },
            description: { en: 'Protect your hands and improve your grip with our genuine leather weightlifting gloves. Built-in wrist wraps provide extra support for heavy lifts.' },
            price: 18.99,
            quantity: 180,
            category: categoryDocs['Accessories'],
            thumbnail_image: 'https://images.unsplash.com/photo-1562771242-a02d9096c85c?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1562771242-a02d9096c85c?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Stainless Steel Shaker Bottle' },
            short_description: { en: 'Odor-resistant 24oz protein shaker.' },
            description: { en: 'Keep your supplements cold and your bag dry with our leak-proof, insulated stainless steel shaker bottle.' },
            price: 22.99,
            quantity: 250,
            category: categoryDocs['Accessories'],
            thumbnail_image: 'https://images.unsplash.com/photo-1601614766860-316260481ce6?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1601614766860-316260481ce6?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'High-Protein Energy Bar Pack (12-Count)' },
            short_description: { en: 'Delicious on-the-go protein bars.' },
            description: { en: 'Fuel your day with our tasty protein bars. Each bar contains 20g of protein and only 2g of sugar. Peanut butter chocolate flavor.' },
            price: 29.99,
            quantity: 80,
            category: categoryDocs['Nutrition'],
            thumbnail_image: 'https://images.unsplash.com/photo-1622484211148-5226c63b4685?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1622484211148-5226c63b4685?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        },
        {
            name: { en: 'Complete Meal Replacement Shake' },
            short_description: { en: 'Nutritionally complete powder mix.' },
            description: { en: 'A perfect balance of protein, carbs, healthy fats, and 27 essential vitamins and minerals. Ideal for busy days when you need a quick, healthy meal.' },
            price: 54.99,
            quantity: 60,
            category: categoryDocs['Nutrition'],
            thumbnail_image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1000&auto=format&fit=crop'],
            in_stock: true,
            is_active: true
        }
    ];

    for (const prod of products) {
        const exists = await Product.findOne({ 'name.en': prod.name.en });
        if (!exists) {
            await Product.create(prod);
        }
    }
    console.log('Products seeded.');

    // 3. Coupons
    console.log('Seeding Coupons...');
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const coupons = [
        {
            name: 'Welcome 10% Off',
            code: 'WELCOME10',
            discount: 10,
            type: 'percentage',
            usage_limit_per_user: 1,
            expire_at: oneYearFromNow,
            status: true
        },
        {
            name: 'Summer Sale 20% Off',
            code: 'SUMMER20',
            discount: 20,
            type: 'percentage',
            usage_limit_per_user: 1,
            expire_at: oneYearFromNow,
            status: true
        },
        {
            name: 'Flat $50 Off',
            code: 'FLAT50',
            discount: 50,
            type: 'flat',
            minimum_order_amount: 200,
            usage_limit_per_user: 1,
            expire_at: oneYearFromNow,
            status: true
        },
        {
            name: 'Member 15% Discount',
            code: 'MEMBER15',
            discount: 15,
            type: 'percentage',
            expire_at: oneYearFromNow,
            status: true
        }
    ];

    for (const coup of coupons) {
        const exists = await Coupon.findOne({ code: coup.code });
        if (!exists) {
            await Coupon.create(coup);
        }
    }
    console.log('Coupons seeded.');

    await mongoose.disconnect();
    console.log('Seed 2 complete! Disconnected from DB.');
}

seed2().catch(err => {
    console.error('Seed 2 failed:', err);
    process.exit(1);
});
