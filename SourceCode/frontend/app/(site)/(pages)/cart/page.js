"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BasicBar from '../../../../components/common/basic-bar';
import ProductCard from '../../../../components/shop/productCard';
import { Empty } from 'antd';
import { useI18n } from '../../../providers/i18n';
import { useCurrency } from '../../../contexts/site';
import { FiArrowRight, FiShoppingBag, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Page = () => {
    const i18n = useI18n();
    const { currencySymbol, convertAmount, cartItems, getCartItems } = useCurrency();
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        const total = cartItems?.products?.reduce((acc, item) => acc + item?.price * item?.quantity, 0) || 0;
        setSubtotal(total);
    }, [cartItems]);

    const itemCount = cartItems?.products?.length || 0;

    return (
        <section>
            <BasicBar heading={i18n?.t('Shopping Cart')} subHeading={i18n?.t('Shopping Cart')} />

            <div className='container py-16 lg:py-24'>
                {/* Page header */}
                <div className='flex items-center gap-3 mb-10'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316]/8 border border-[#F97316]/15'>
                        <FiShoppingCart size={18} className='text-[#F97316]' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-extrabold text-gray-800 tracking-tight capitalize'>{i18n?.t('Shopping Cart')}</h1>
                        {itemCount > 0 && (
                            <p className='text-[12px] text-gray-400 font-medium'>{itemCount} {i18n?.t(itemCount === 1 ? 'item' : 'items')} {i18n?.t('in your cart')}</p>
                        )}
                    </div>
                </div>

                {itemCount > 0 ? (
                    <div className='flex flex-col lg:flex-row gap-8 xl:gap-12'>
                        {/* --- Cart items --- */}
                        <div className='w-full lg:w-2/3 flex flex-col gap-4'>
                            {cartItems.products.map((product, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: index * 0.06 }}
                                >
                                    <ProductCard data={product} getData={getCartItems} />
                                </motion.div>
                            ))}

                            {/* Continue shopping */}
                            <Link
                                href='/shop'
                                className='inline-flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-[#F97316] transition-colors mt-2 w-fit'
                            >
                                <FiArrowLeft size={14} /> {i18n?.t('Continue Shopping')}
                            </Link>
                        </div>

                        {/* Order summary */}
                        <div className='w-full lg:w-1/3 shrink-0'>
                            <div className='rounded-2xl border border-slate-100 bg-white shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] overflow-hidden sticky top-24'>
                                {/* Header */}
                                <div className='bg-gradient-to-r from-[#EA580C] to-[#F97316] px-6 py-5'>
                                    <p className='text-[11px] font-black text-white/60 uppercase tracking-widest mb-0.5'>{i18n?.t('Summary')}</p>
                                    <h3 className='text-lg font-extrabold text-white'>{i18n?.t('Order Total')}</h3>
                                </div>

                                {/* Rows */}
                                <div className='p-6 space-y-4'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-[13px] text-gray-500 font-medium'>{i18n?.t('Subtotal')}</span>
                                        <span className='text-[13px] font-bold text-gray-800'>{currencySymbol}{convertAmount(subtotal)}</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-[13px] text-gray-500 font-medium'>{i18n?.t('Shipping')}</span>
                                        <span className='text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full'>{i18n?.t('Calculated at checkout')}</span>
                                    </div>
                                    <div className='h-px bg-slate-100' />
                                    <div className='flex justify-between items-center'>
                                        <span className='text-[14px] font-extrabold text-gray-800'>{i18n?.t('Total')}</span>
                                        <span className='text-xl font-black text-[#F97316]'>{currencySymbol}{convertAmount(subtotal)}</span>
                                    </div>

                                    <Link href='/checkout' className='block'>
                                        <button className='mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#F97316] py-3.5 text-[13px] font-bold text-white shadow-lg shadow-[#F97316]/25 hover:bg-[#EA580C] hover:-translate-y-0.5 transition-all'>
                                            {i18n?.t('Proceed to Checkout')} <FiArrowRight size={14} />
                                        </button>
                                    </Link>

                                    {/* Trust badges */}
                                    <div className='flex items-center justify-center gap-4 pt-2'>
                                        {['Secure Payment', 'Free Returns', '24/7 Support'].map((b, i) => (
                                            <p key={i} className='text-[10px] text-gray-400 font-medium text-center'>{i18n?.t(b)}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* --- Empty state --- */
                    <div className='flex flex-col items-center justify-center min-h-[50vh] rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_-6px_rgba(0,0,0,0.06)]'>
                        <div className='flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F97316]/8 border border-[#F97316]/15 mb-6'>
                            <FiShoppingBag size={36} className='text-[#F97316]/50' />
                        </div>
                        <h3 className='text-xl font-extrabold text-gray-800 mb-2'>{i18n?.t('Your cart is empty')}</h3>
                        <p className='text-[13px] text-gray-400 font-medium mb-6'>{i18n?.t('Looks like you haven\'t added anything yet.')}</p>
                        <Link
                            href='/shop'
                            className='inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-6 py-3 text-[13px] font-bold text-white shadow-lg shadow-[#F97316]/25 hover:bg-[#EA580C] transition-all'
                        >
                            <FiShoppingCart size={14} /> {i18n?.t('Start Shopping')}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Page;
