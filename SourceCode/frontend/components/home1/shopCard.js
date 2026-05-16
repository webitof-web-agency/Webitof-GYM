import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { FiHeart, FiEye, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import { columnFormatter } from '../../app/helpers/utils';
import { message } from 'antd';
import { fatchWishlist, postWishlist } from '../../app/helpers/backend';
import { useCurrency } from '../../app/contexts/site';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '../../app/contexts/user';
import { motion } from 'framer-motion';
import { useI18n } from '../../app/providers/i18n';
import { useFetch } from '../../app/helpers/hooks';
import { createProductSlug } from '../../app/helpers/product';

const ShopCard = ({ data, getData }) => {
    const { user } = useUser();
    const i18n = useI18n();
    const router = useRouter();
    const { currencySymbol, convertAmount, findDefaultTheme } = useCurrency();
    const pathName = usePathname();
    const [wishlist, getWaishlist] = useFetch(fatchWishlist);
    const [wishListed, setWishListed] = useState(false);

    useEffect(() => {
        if (wishlist?.docs?.length > 0) {
            setWishListed(Boolean(wishlist.docs[0].products?.some(item => item._id === data._id)));
        }
    }, [wishlist, data._id]);

    const submitWishlist = async (id) => {
        if (!user?._id) {
            message.warning(i18n?.t('Please login to add to wishlist'));
            router.push('/signin');
        } else {
            try {
                const res = await postWishlist({ productId: id });
                if (res?.error === false) { getWaishlist(); getData(); message.success(res.msg); }
                else message.error(res.msg);
            } catch (err) { console.error(err); }
        }
    };

    const isSoldOut = data?.quantity === 0;
    const productHref = `/shop/${createProductSlug(data)}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className='group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_40px_-8px_rgba(85,114,252,0.12)] hover:border-[#F97316]/20 transition-all duration-300 flex flex-col'
        >
            {/* Image area */}
            <div className='relative overflow-hidden bg-slate-50 lg:h-[240px] sm:h-[200px] h-[170px] shrink-0'>
                {/* Main image */}
                <Link href={productHref} className='block w-full h-full'>
                    <Image
                        src={data?.thumbnail_image}
                        alt={columnFormatter(data?.name)}
                        fill
                        className='object-cover transition-opacity duration-300 group-hover:opacity-0'
                    />
                    <Image
                        src={data?.images?.[0] || data?.thumbnail_image}
                        alt={columnFormatter(data?.name)}
                        fill
                        className='object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                    />
                </Link>

                {/* Sold out badge */}
                {isSoldOut && (
                    <div className='absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full shadow'>
                        {i18n?.t('Sold Out')}
                    </div>
                )}

                {/* Hover action strip */}
                <div className='absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm py-2.5'>
                    <button
                        onClick={() => submitWishlist(data?._id)}
                        className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all duration-200 ${wishListed ? 'bg-[#F97316] border-[#F97316] text-white' : 'border-slate-200 text-gray-500 hover:border-[#F97316] hover:text-[#F97316]'}`}
                        title={i18n?.t('Wishlist')}
                    >
                        <FiHeart size={14} className={wishListed ? 'fill-current' : ''} />
                    </button>
                    <Link
                        href={productHref}
                        className='flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition-all duration-200'
                        title={i18n?.t('Quick View')}
                    >
                        <FiEye size={14} />
                    </Link>
                    <Link
                        href={productHref}
                        className='flex h-8 items-center gap-1.5 px-4 rounded-xl bg-[#F97316] text-[11px] font-bold text-white hover:bg-[#EA580C] transition-colors'
                    >
                        <FiShoppingBag size={12} /> {i18n?.t('Buy')}
                    </Link>
                </div>
            </div>

            {/* Info */}
            <div className='p-4 flex flex-col flex-1'>
                <Link href={productHref} className='text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-[#F97316] transition-colors mb-1'>
                    {columnFormatter(data?.name)}
                </Link>
                <p className='text-[11px] text-gray-400 font-medium capitalize mb-2'>{columnFormatter(data?.category?.name)}</p>
                <div className='mt-auto flex items-center justify-between'>
                    <span className='text-base font-black text-[#F97316]'>
                        {currencySymbol}{convertAmount(data?.price || 0)}
                    </span>
                    {data?.compare_price > data?.price && (
                        <span className='text-[11px] text-gray-400 line-through font-medium'>
                            {currencySymbol}{convertAmount(data?.compare_price)}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ShopCard;

