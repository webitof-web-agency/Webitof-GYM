'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useI18n } from '../../app/providers/i18n';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import BannerTitle from '../common/banner-title';
import Button from '../common/button';

const AboutUs = ({ data }) => {
    const i18n = useI18n();

    const aboutImage = Array.isArray(data?.about_image)
        ? data.about_image[0]?.url
        : data?.about_image || '';

    const stats = [
        { value: '10+', label: i18n?.t('Years Experience') },
        { value: '5K+', label: i18n?.t('Happy Members') },
        { value: '50+', label: i18n?.t('Expert Trainers') },
    ];

    return (
        <div className='container mb-[60px] lg:mb-[120px] overflow-hidden'>
            <div className='flex flex-col items-center gap-12 lg:flex-row xl:gap-[80px]'>

                {/* Left â€” Image with decorative frame */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className='relative w-full lg:basis-1/2 flex justify-center'
                >
                    {/* Decorative background block */}
                    <div className='absolute -bottom-4 -right-4 w-[calc(100%-48px)] h-[calc(100%-48px)] max-w-[338px] bg-[#F97316]/8 rounded-2xl border border-[#F97316]/15 hidden sm:block' />

                    {/* Main image */}
                    <div className='relative rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-slate-100 xs:h-[400px] h-[300px] lg:h-[480px] w-full max-w-[386px]'>
                        <Image
                            src={aboutImage}
                            fill
                            alt='About Us'
                            className='object-cover'
                        />
                        {/* Subtle gradient overlay at bottom */}
                        <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent' />
                    </div>

                    {/* Floating stat badges */}
                    <div className='absolute -bottom-6 left-2 sm:left-6 flex gap-3'>
                        {stats.map((s, i) => (
                            <div key={i} className='flex flex-col items-center bg-white rounded-xl px-3 py-2.5 shadow-lg border border-slate-100 min-w-[70px]'>
                                <span className='text-lg font-black text-[#F97316] leading-none'>{s.value}</span>
                                <span className='text-[9px] text-gray-400 font-semibold text-center leading-tight mt-0.5'>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right â€” Text content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className='w-full lg:basis-1/2 pt-10 lg:pt-0'
                >
                    {/* Badge */}
                    <div className='inline-flex items-center gap-2 rounded-full border border-[#F97316]/25 bg-[#F97316]/8 px-4 py-1.5 mb-5'>
                        <span className='h-1.5 w-1.5 rounded-full bg-[#F97316]' />
                        <span className='text-[11px] font-black text-[#F97316] uppercase tracking-widest'>{i18n?.t('About Us')}</span>
                    </div>

                    <h2 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight leading-tight mb-5'>
                        {data?.heading?.[i18n.langCode]}
                    </h2>

                    <p className='text-[14px] text-gray-500 leading-relaxed line-clamp-4 font-medium mb-8'>
                        {data?.description?.[i18n.langCode]}
                    </p>

                    {/* Quick benefits */}
                    <ul className='space-y-2.5 mb-8'>
                        {['World-class training equipment', 'Certified professional trainers', 'Flexible membership plans'].map((item, i) => (
                            <li key={i} className='flex items-center gap-2.5 text-[13px] text-gray-600 font-medium'>
                                <FiCheckCircle size={15} className='text-[#F97316] shrink-0' />
                                {i18n?.t(item)}
                            </li>
                        ))}
                    </ul>

                    <Link
                        href='/about'
                        className='inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#F97316]/25 transition-all hover:bg-[#EA580C] hover:shadow-xl hover:-translate-y-0.5'
                    >
                        {i18n?.t('Read More')} <FiArrowRight size={15} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutUs;

