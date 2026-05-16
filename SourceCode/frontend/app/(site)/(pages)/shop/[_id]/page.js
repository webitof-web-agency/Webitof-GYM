'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Empty, message, Rate } from 'antd';
import Link from 'next/link';
import BasicBar from '../../../../../components/common/basic-bar';
import ShopCard from '../../../../../components/home1/shopCard';
import { useFetch } from '../../../../helpers/hooks';
import { fatchWishlist, postCartlist, postWishlist, singleProductAdmin } from '../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import { columnFormatter } from '../../../../helpers/utils';
import { useRouter } from 'next/navigation';
import { useCurrency } from '../../../../contexts/site';
import { FaFacebookF, FaLinkedinIn, FaRedditAlien, FaTwitter } from 'react-icons/fa';
import ProductImageSlider from '../../../../../components/common/imageSlider';
import { FiHeart, FiShoppingCart, FiStar, FiCheckCircle, FiPackage, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { createProductSlug, isMongoObjectId } from '../../../../helpers/product';

const Review = dynamic(() => import('../../../../../components/shop/review'));
const WriteReview = dynamic(() => import('../../../../../components/shop/writeReview'));

const Wheyprotein = ({ params }) => {
    const i18n = useI18n();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('description');
    const [wishlist, getWaishlist] = useFetch(fatchWishlist);
    const [wishListed, setWishListed] = useState(false);
    const { currencySymbol, convertAmount, getCartItems } = useCurrency();
    const [data, getData] = useFetch(singleProductAdmin, {}, false);
    const [variant, setVariant] = useState();
    const [varientPrice, setVariantPrice] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [url, setUrl] = useState('');
    const productParam = Array.isArray(params?._id) ? params._id[0] : params?._id;

    useEffect(() => {
        if (productParam) {
            getData(isMongoObjectId(productParam) ? { _id: productParam } : { slug: productParam });
        }
    }, [getData, productParam]);
    useEffect(() => { setUrl(window.location.href); }, []);

    useEffect(() => {
        if (wishlist?.docs?.length > 0) {
            setWishListed(Boolean(wishlist.docs[0].products?.some(item => item._id === data?.product?._id)));
        }
    }, [data?.product?._id, wishlist]);

    useEffect(() => {
        let varientProduct = data?.product?.variants?.find(item => item?._id === variant);
        setVariantPrice(varientProduct?.price);
    }, [variant]);

    useEffect(() => {
        if (data?.product?.variants?.length > 0) setVariant(data?.product?.variants[0]?._id);
    }, [data?.product?.variants]);

    const submitWishlist = async () => {
        try {
            const currentProductId = data?.product?._id;
            const res = await postWishlist({ productId: currentProductId, variantId: variant });
            if (res?.error === false) { getWaishlist(); getData(currentProductId ? { _id: currentProductId } : { slug: productParam }); message.success(res.msg); }
            else message.error(res.msg);
        } catch { message.error('Failed to add to wishlist.'); }
    };

    const addToCart = async () => {
        setAddingToCart(true);
        const res = await postCartlist({ product_id: data?.product?._id, variant_id: variant, quantity: 1 });
        setAddingToCart(false);
        if (res.error === false) { getCartItems(); message.success(res?.msg); router.push('/cart'); }
        else { message.error(res?.msg); router.push('/signin'); }
    };

    const shareLinks = [
        { key: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: <FaFacebookF size={13} /> },
        { key: 'twitter', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, icon: <FaTwitter size={13} /> },
        { key: 'reddit', href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}`, icon: <FaRedditAlien size={13} /> },
        { key: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, icon: <FaLinkedinIn size={13} /> },
    ];

    const tabs = ['description', 'review', 'Write review'];
    const inStock = data?.product?.quantity > 0;
    const displayPrice = currencySymbol + convertAmount(varientPrice ?? data?.product?.price ?? 0);

    return (
        <section>
            <BasicBar heading={i18n?.t('Product Details')} subHeading={i18n?.t('Product Details')} />

            <div className='container py-16 lg:py-24'>

                {/* ── Product Hero ──────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16'
                >
                    {/* Left — Image slider */}
                    <div className='rounded-2xl border border-slate-100 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] bg-white p-4 lg:p-6'>
                        <ProductImageSlider
                            thumbnail_image={data?.product?.thumbnail_image}
                            images={data?.product?.images}
                        />
                    </div>

                    {/* Right — Product info */}
                    <div className='flex flex-col gap-5'>

                        {/* Category + rating row */}
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                            <span className='inline-flex items-center gap-1.5 rounded-full border border-[#F97316]/25 bg-[#F97316]/8 px-3 py-1 text-[11px] font-black text-[#F97316] uppercase tracking-widest'>
                                <FiTag size={10} /> {columnFormatter(data?.product?.category?.name)}
                            </span>
                            <div className='flex items-center gap-2'>
                                <Rate disabled value={data?.avgRating} className='text-amber-400 text-sm' />
                                <span className='text-[12px] text-gray-400 font-medium'>
                                    ({data?.reviews?.length || 0} {i18n?.t('reviews')})
                                </span>
                            </div>
                        </div>

                        {/* Product name */}
                        <h1 className='text-2xl lg:text-3xl font-extrabold text-gray-800 capitalize tracking-tight leading-tight'>
                            {columnFormatter(data?.product?.name)}
                        </h1>

                        {/* Price row */}
                        <div className='flex items-baseline gap-4'>
                            <span className='text-3xl font-black text-[#F97316]'>{displayPrice}</span>
                            {data?.product?.compare_price > (varientPrice ?? data?.product?.price) && (
                                <span className='text-lg text-gray-400 line-through font-medium'>
                                    {currencySymbol}{convertAmount(data?.product?.compare_price)}
                                </span>
                            )}
                        </div>

                        {/* Stock badge */}
                        <div className='flex items-center gap-2'>
                            <div className={`h-2 w-2 rounded-full ${inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            <span className={`text-[12px] font-bold ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                                {inStock ? `${i18n?.t('In Stock')} · ${data?.product?.quantity} ${i18n?.t('units')}` : i18n?.t('Out of Stock')}
                            </span>
                        </div>

                        {/* Short description */}
                        <p className='text-[13px] text-gray-500 font-medium leading-relaxed line-clamp-4 border-t border-slate-100 pt-4'>
                            {columnFormatter(data?.product?.short_description)}
                        </p>

                        {/* Variants */}
                        {data?.product?.variants?.length > 0 && (
                            <div>
                                <p className='text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2.5'>{i18n?.t('Select Variant')}</p>
                                <div className='flex flex-wrap gap-2'>
                                    {data.product.variants.map(size => (
                                        <button
                                            key={size?._id}
                                            onClick={() => setVariant(size?._id)}
                                            className={`px-4 py-2 rounded-xl text-[12px] font-bold border-2 transition-all duration-200 ${
                                                variant === size?._id
                                                    ? 'bg-[#F97316] border-[#F97316] text-white shadow-md shadow-[#F97316]/25'
                                                    : 'bg-white border-slate-200 text-gray-600 hover:border-[#F97316] hover:text-[#F97316]'
                                            }`}
                                        >
                                            {size?.name?.[i18n?.langCode]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA buttons */}
                        <div className='flex flex-wrap gap-3 pt-2'>
                            {inStock ? (
                                <>
                                    <button
                                        onClick={addToCart}
                                        disabled={addingToCart}
                                        className='flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl bg-[#F97316] py-3 px-6 text-[13px] font-bold text-white shadow-lg shadow-[#F97316]/25 hover:bg-[#EA580C] hover:-translate-y-0.5 transition-all disabled:opacity-60'
                                    >
                                        {addingToCart
                                            ? <span className='h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin' />
                                            : <><FiShoppingCart size={15} /> {i18n?.t('Add to Cart')}</>
                                        }
                                    </button>
                                    <button
                                        onClick={submitWishlist}
                                        className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 px-5 text-[13px] font-bold transition-all hover:-translate-y-0.5 ${
                                            wishListed
                                                ? 'bg-[#F97316]/8 border-[#F97316]/30 text-[#F97316]'
                                                : 'bg-white border-slate-200 text-gray-500 hover:border-[#F97316] hover:text-[#F97316]'
                                        }`}
                                    >
                                        <FiHeart size={15} className={wishListed ? 'fill-[#F97316]' : ''} />
                                        {wishListed ? i18n?.t('Wishlisted') : i18n?.t('Wishlist')}
                                    </button>
                                </>
                            ) : (
                                <div className='w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 border-2 border-red-200 py-3 text-[13px] font-bold text-red-500'>
                                    <FiPackage size={15} /> {i18n?.t('Out of Stock')}
                                </div>
                            )}
                        </div>

                        {/* Share row */}
                        <div className='flex items-center gap-3 pt-2 border-t border-slate-100'>
                            <p className='text-[11px] font-black text-gray-400 uppercase tracking-widest'>{i18n?.t('Share')}:</p>
                            <div className='flex gap-2'>
                                {shareLinks.map((item) => (
                                    <a
                                        key={item.key}
                                        href={item.href}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-gray-500 hover:bg-[#F97316] hover:text-white transition-all duration-200'
                                    >
                                        {item.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Tabs ─────────────────────────────────────────────── */}
                <div className='mt-16'>
                    {/* Tab bar */}
                    <div className='flex gap-1 border-b border-slate-100 mb-8'>
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-3 text-[13px] font-bold rounded-t-xl transition-all duration-200 whitespace-nowrap ${
                                    activeTab === tab
                                        ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/20'
                                        : 'text-gray-500 hover:text-[#F97316] hover:bg-[#F97316]/5'
                                }`}
                            >
                                {i18n?.t(tab.charAt(0).toUpperCase() + tab.slice(1))}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div>
                        {activeTab === 'description' && (
                            <div
                                dangerouslySetInnerHTML={{ __html: columnFormatter(data?.product?.description) }}
                                className='prose prose-sm sm:prose max-w-none text-gray-600 leading-relaxed rounded-2xl border border-slate-100 p-6 lg:p-8 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]
                                    prose-headings:text-gray-800 prose-headings:font-extrabold
                                    prose-strong:text-gray-800 prose-a:text-[#F97316]'
                            />
                        )}
                        {activeTab === 'review' && <Review review={data?.reviews} />}
                        {activeTab === 'Write review' && <WriteReview productId={data?.product?._id} />}
                    </div>
                </div>

                {/* ── Related Products ─────────────────────────────────── */}
                <div className='mt-20'>
                    <div className='flex items-center gap-2.5 mb-8'>
                        <span className='h-5 w-0.5 rounded-full bg-[#F97316]' />
                        <h2 className='text-[13px] font-black text-gray-800 uppercase tracking-widest'>{i18n?.t('Related Products')}</h2>
                    </div>
                    {data?.relatedProducts?.length > 0 ? (
                        <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
                            {data.relatedProducts.map(product => (
                                <Link key={product._id} href={`/shop/${createProductSlug(product)}`} passHref>
                                    <ShopCard data={product} getData={() => getData(data?.product?._id ? { _id: data.product._id } : { slug: productParam })} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className='min-h-[20vh] flex items-center justify-center rounded-2xl border border-slate-100 bg-white'>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={i18n?.t('No Related Products')} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Wheyprotein;
