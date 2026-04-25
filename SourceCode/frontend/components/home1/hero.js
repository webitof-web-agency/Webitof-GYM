'use client';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { useI18n } from '../../app/providers/i18n';
import { FiArrowRight, FiPlay, FiUsers, FiAward, FiTrendingUp } from 'react-icons/fi';

const Hero = ({ data }) => {
    const i18n = useI18n();
    const heading = data?.heading?.[i18n?.langCode] || '';
    const words = heading.split(' ');
    const firstThreeWords = words.slice(0, 3).join(' ');
    const remainingWords = words.slice(3).join(' ');
    const heroImage = data?.image?.[0]?.url || data?.image;
    const heroImageUrl = typeof heroImage === 'string' ? heroImage.trim() : '';
    const heroImageLower = heroImageUrl.toLowerCase();
    const hasHeroImage =
        heroImageUrl !== '' &&
        !['image', 'undefined', 'null', 'none', 'no', '0'].includes(heroImageLower) &&
        (heroImageUrl.startsWith('http') ||
            heroImageUrl.startsWith('/') ||
            heroImageUrl.startsWith('data:') ||
            heroImageUrl.includes('/'));
    const contentAlignClass = hasHeroImage ? 'mx-auto' : 'mx-0';
    const textAlignClass = hasHeroImage ? '' : 'text-left items-start';

    const stats = [
        { icon: <FiUsers size={18} />, value: '5K+', label: i18n?.t('Active Members') },
        { icon: <FiAward size={18} />, value: '50+', label: i18n?.t('Expert Trainers') },
        { icon: <FiTrendingUp size={18} />, value: '10+', label: i18n?.t('Years Experience') },
    ];

    return (
        <div className='relative overflow-x-hidden'>
            {/* Background */}
            <Image src={'/banner.png'} width={1920} height={986} alt='banner' className='absolute h-full w-full object-cover' />
            <div className='relative w-full overflow-hidden bg-[#001223]/88 md:h-[80vh] md:pt-10 md:pb-20 lg:h-[100vh]'>
                {/* Decorative gradient orbs */}
                <div className='absolute top-20 right-[10%] w-[500px] h-[500px] bg-[#F97316]/15 rounded-full blur-[120px] pointer-events-none' />
                <div className='absolute bottom-10 left-[5%] w-[300px] h-[300px] bg-[#F97316]/10 rounded-full blur-[80px] pointer-events-none' />

                <Image
                    src={'/banner-vector.png'}
                    width={1920}
                    height={986}
                    alt='banner vector'
                    className='absolute right-0 hidden h-[55vh] w-[55%] md:top-[78px] md:block lg:top-[111px] xl:top-[112px] 2xl:top-[110px] lg:h-[80vh] opacity-60'
                />

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 1 }}
                    className={`hero-content flex h-full ${contentAlignClass}`}
                >
                    <div className={`relative mt-20 h-[50%] max-w-[1320px] px-4 py-20 md:top-[80px] md:py-0 lg:top-0 lg:h-[83%] xl:h-[86%] ${contentAlignClass}`}>
                        <div className={`flex h-full flex-col justify-center xl:w-[660px] ${textAlignClass}`}>
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className='mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-1.5 backdrop-blur-sm'
                            >
                                <span className='h-2 w-2 rounded-full bg-[#F97316] animate-pulse' />
                                <span className='text-[12px] font-bold text-[#FB923C] uppercase tracking-widest'>
                                    {i18n?.t('Premier Fitness Hub')}
                                </span>
                            </motion.div>

                            {/* Heading */}
                            <motion.h1
                                className='largeHeading mb-6 capitalize xl:mb-8'
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 1 }}
                            >
                                <span className='text-white'>{firstThreeWords} </span>
                                <span className='text-[#F97316] relative'>
                                    {remainingWords}
                                    <svg className='absolute -bottom-2 left-0 w-full' height='6' viewBox='0 0 200 6' fill='none'>
                                        <path d='M0 3 Q50 0 100 3 Q150 6 200 3' stroke='#F97316' strokeWidth='2.5' strokeLinecap='round' fill='none' opacity='0.5' />
                                    </svg>
                                </span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                className='description text-white/75 lg:w-[580px] leading-relaxed'
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                {data?.description?.[i18n?.langCode] || ''}
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                className='mt-10 flex flex-wrap items-center gap-4 xl:mt-12'
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <Link
                                    href='/services'
                                    className='group flex items-center gap-2.5 rounded-xl bg-[#F97316] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F97316]/30 transition-all hover:bg-[#EA580C] hover:shadow-xl hover:shadow-[#F97316]/40 hover:-translate-y-0.5'
                                >
                                    {i18n?.t("Start Your Journey")}
                                    <FiArrowRight size={16} className='transition-transform group-hover:translate-x-1' />
                                </Link>
                                <Link
                                    href='/about'
                                    className='group flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30'
                                >
                                    <span className='flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-all group-hover:bg-[#F97316]/30'>
                                        <FiPlay size={12} className='ml-0.5' />
                                    </span>
                                    {i18n?.t("Learn More")}
                                </Link>
                            </motion.div>

                            {/* Stats Bar */}
                            <motion.div
                                className='mt-10 xl:mt-14 flex flex-wrap gap-6'
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                {stats.map((stat, i) => (
                                    <div key={i} className='flex items-center gap-3'>
                                        <div className='flex h-10 w-10 items-center justify-center rounded-xl border border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316] shrink-0'>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p className='text-lg font-extrabold text-white leading-none'>{stat.value}</p>
                                            <p className='text-[11px] text-white/50 font-medium'>{stat.label}</p>
                                        </div>
                                        {i < stats.length - 1 && <div className='ml-3 h-8 w-px bg-white/10' />}
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    {/* Hero image */}
                    {hasHeroImage ? (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 1 }}
                            className='hero-img relative top-20 hidden h-[65vh] w-fit flex-col justify-end md:flex lg:top-[130px] xl:right-[4%] 2xl:right-[6%] lg:h-[100%] 2xl:h-[100%]'
                        >
                            <Image
                                src={heroImageUrl}
                                width={788}
                                height={750}
                                alt='hero athlete'
                                className='h-full w-[788px] drop-shadow-2xl'
                            />
                        </motion.div>
                    ) : null}
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;

