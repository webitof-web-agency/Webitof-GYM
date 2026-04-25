'use client';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../app/providers/i18n';
import { useCurrency } from '../../app/contexts/site';

const FeatureCard = ({ feature }) => {
    const i18n = useI18n();
    const { findDefaultTheme } = useCurrency();

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className='group relative bg-white rounded-2xl overflow-hidden cursor-pointer w-full min-h-[280px] border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_-8px_rgba(85,114,252,0.18)] hover:border-[#F97316]/20 transition-all duration-300'
        >
            {/* Top accent bar */}
            <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F97316] to-[#FB923C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl' />

            {/* Glow background */}
            <div className='absolute inset-0 bg-gradient-to-br from-[#F97316]/0 to-[#F97316]/0 group-hover:from-[#F97316]/3 group-hover:to-transparent transition-all duration-300 pointer-events-none' />

            <div className='relative lg:py-10 py-8 px-6 flex flex-col items-center text-center'>
                {/* Icon */}
                <div className='mb-6 relative'>
                    <div className='w-16 h-16 rounded-2xl bg-[#F97316]/8 group-hover:bg-[#F97316]/12 border border-[#F97316]/10 group-hover:border-[#F97316]/25 flex items-center justify-center transition-all duration-300 shadow-sm'>
                        <Image
                            src={feature?.image}
                            width={34}
                            height={34}
                            alt={'Feature icon'}
                            className='object-contain h-[34px] w-[34px]'
                        />
                    </div>
                    {/* Outer ring on hover */}
                    <div className='absolute inset-0 rounded-2xl border-2 border-[#F97316]/0 group-hover:border-[#F97316]/20 scale-110 transition-all duration-300' />
                </div>

                {/* Text */}
                <div className='space-y-3'>
                    <h3 className='text-[17px] font-extrabold text-gray-800 leading-tight tracking-tight group-hover:text-[#F97316] transition-colors duration-300'>
                        {i18n.t(feature?.name?.[i18n.langCode])}
                    </h3>
                    <p className='text-[13px] text-gray-500 leading-relaxed line-clamp-3 font-medium'>
                        {feature?.description?.[i18n.langCode]}
                    </p>
                </div>

                {/* Arrow indicator */}
                <div className='mt-5 flex items-center gap-1.5 text-[#F97316] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 text-[12px] font-bold'>
                    <span>Explore</span>
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M5 12h14M12 5l7 7-7 7' />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
};

export default FeatureCard;

