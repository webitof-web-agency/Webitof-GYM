'use client';
import Image from 'next/image';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '../../app/providers/i18n';
import { useAction, useActionConfirm } from '../../app/helpers/hooks';
import { delCart, postCartlist, postWishlist } from '../../app/helpers/backend';
import { swalDanger } from '../../app/helpers/swal';
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { message } from 'antd';
import { columnFormatter } from '../../app/helpers/utils';
import { useCurrency } from '../../app/contexts/site';
import Link from 'next/link';
import { createProductSlug } from '../../app/helpers/product';

const ProductCard = ({ data, getWaishlist, getData }) => {
    const i18n = useI18n();
    const pathname = usePathname();
    const router = useRouter();
    const { currencySymbol, convertAmount, getCartItems } = useCurrency();

    const remove = (id) => {
        swalDanger({
            title: i18n?.t('Remove from Wishlist?'),
            text: i18n?.t('This product will be removed from your wishlist.'),
            confirmText: i18n?.t('Yes, Remove'),
        }).then((result) => {
            if (result.isConfirmed) {
                const storedPropertyIds = JSON.parse(localStorage.getItem('propertyIds')) || [];
                localStorage.setItem('propertyIds', JSON.stringify(storedPropertyIds.filter(item => item !== id)));
                useAction(postWishlist, { productId: id, variantId: data?.variant?._id }, () => { getWaishlist?.(); });
            }
        });
    };

    const deleteFromCart = async (id) => {
        await useActionConfirm(delCart, { product_id: id, variant_id: data?.variant?._id }, () => getData(), i18n?.t('Remove this item from cart?'), i18n?.t('Yes, Remove'));
    };

    const addToCart = async (quantity) => {
        const res = await postCartlist({ product_id: data?._id, variant_id: data?.variant?._id, quantity: quantity || 1 });
        if (res.error === false) {
            getCartItems();
            if (pathname === '/cart') { getData(); }
            else { message.success(res?.msg); router.push('/cart'); getWaishlist?.(); }
        } else {
            message.error(res?.msg);
        }
    };

    const lineTotal = currencySymbol + convertAmount((data?.price * data?.quantity)?.toFixed(2));
    const productHref = `/shop/${createProductSlug(data)}`;

    return (
        <div className='flex sm:flex-row flex-col gap-4 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:border-[#F97316]/20 hover:shadow-[0_4px_20px_-6px_rgba(85,114,252,0.08)] transition-all p-4'>
            {/* Product image */}
            <Link href={productHref} className='shrink-0'>
                <Image
                    className='rounded-xl object-cover sm:w-[120px] sm:h-[120px] w-full h-[200px]'
                    src={data?.thumbnail_image}
                    alt={data?.name?.[i18n.langCode] || 'Product'}
                    width={300}
                    height={300}
                />
            </Link>

            {/* Product details */}
            <div className='flex-1 flex flex-col justify-between min-w-0'>
                {/* Top row: name + price */}
                <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                        <Link href={productHref} className='text-[14px] font-semibold text-gray-800 capitalize line-clamp-2 hover:text-[#F97316] transition-colors leading-snug'>
                            {data?.name?.[i18n.langCode]}
                        </Link>
                        {data?.variant && (
                            <span className='inline-block mt-1 text-[11px] font-bold text-[#F97316] bg-[#F97316]/8 border border-[#F97316]/15 rounded-full px-2.5 py-0.5'>
                                {i18n.t('Variant')}: {columnFormatter(data?.variant?.name)}
                            </span>
                        )}
                    </div>
                    <div className='shrink-0 text-right'>
                        <p className='text-[16px] font-black text-[#F97316]'>{currencySymbol}{convertAmount(data?.price?.toFixed(2))}</p>
                        {data?.quantity > 1 && (
                            <p className='text-[10px] text-gray-400 font-medium'>{i18n?.t('Each')}</p>
                        )}
                    </div>
                </div>

                {/* Bottom row: qty control + delete */}
                <div className='flex items-center justify-between gap-3 mt-4'>
                    {/* Qty stepper (only on cart page) */}
                    {pathname !== '/wishlist' && (
                        <div className='flex items-center gap-1 rounded-xl border border-slate-200 overflow-hidden'>
                            <button
                                onClick={() => addToCart(-1)}
                                className='flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-[#F97316] hover:text-white transition-colors'
                            >
                                <FiMinus size={12} />
                            </button>
                            <span className='w-8 text-center text-[13px] font-bold text-gray-800'>{data?.quantity}</span>
                            <button
                                onClick={() => addToCart(1)}
                                className='flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-[#F97316] hover:text-white transition-colors'
                            >
                                <FiPlus size={12} />
                            </button>
                        </div>
                    )}

                    {/* Line total (cart only) */}
                    {pathname === '/cart' && data?.quantity > 1 && (
                        <p className='text-[12px] text-gray-500 font-bold'>
                            {i18n?.t('Total')}: <span className='text-gray-800'>{lineTotal}</span>
                        </p>
                    )}

                    {/* Action buttons */}
                    <div className='flex items-center gap-2 ml-auto'>
                        {pathname !== '/cart' && (
                            <button
                                onClick={() => addToCart(1)}
                                className='flex items-center gap-1.5 rounded-xl bg-[#F97316]/8 border border-[#F97316]/20 text-[#F97316] px-3 py-1.5 text-[12px] font-bold hover:bg-[#F97316] hover:text-white transition-all'
                            >
                                <FiShoppingCart size={12} /> {i18n.t('Add to Cart')}
                            </button>
                        )}
                        <button
                            onClick={() => pathname !== '/cart' ? remove(data?._id) : deleteFromCart(data?._id)}
                            className='flex h-8 w-8 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all'
                            title={i18n?.t('Remove')}
                        >
                            <FiTrash2 size={13} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

