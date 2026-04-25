'use client'
import React from 'react';
import Image from 'next/image';
import { useI18n } from '../../../../providers/i18n';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const ACCENT_COLORS = [
    { bar: 'bg-[#F97316]', icon: 'bg-[#F97316]/10 border-[#F97316]/20', text: 'text-[#F97316]' },
    { bar: 'bg-purple-500', icon: 'bg-purple-50 border-purple-200', text: 'text-purple-600' },
    { bar: 'bg-teal-500', icon: 'bg-teal-50 border-teal-200', text: 'text-teal-600' },
    { bar: 'bg-amber-500', icon: 'bg-amber-50 border-amber-200', text: 'text-amber-600' },
    { bar: 'bg-rose-500', icon: 'bg-rose-50 border-rose-200', text: 'text-rose-600' },
    { bar: 'bg-emerald-500', icon: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600' },
];

const ServiceCard = ({ data, index = 0 }) => {
    const i18n = useI18n();
    const ac = ACCENT_COLORS[index % ACCENT_COLORS.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className='group relative bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_40px_-8px_rgba(85,114,252,0.12)] hover:border-[#F97316]/20 overflow-hidden flex flex-col transition-all duration-300'
        >
            {/* Top accent bar */}
            <div className={`h-0.5 w-full ${ac.bar} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left absolute top-0 left-0 z-10`} />

            {/* Cover image */}
            <Link href={`/services/details/${data?._id}`} className='block overflow-hidden h-[210px] bg-slate-50 shrink-0'>
                <Image
                    src={data?.image}
                    alt={data?.name?.[i18n.langCode] || 'Service'}
                    width={600}
                    height={400}
                    className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-105'
                />
            </Link>

            {/* Icon tile â€” overlapping the image bottom */}
            <div className='px-5 -mt-6 relative z-10'>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${ac.icon} shadow-md bg-white`}>
                    <Image
                        src={data?.icon}
                        width={28}
                        height={28}
                        alt='icon'
                        className='object-contain'
                    />
                </div>
            </div>

            {/* Content */}
            <div className='px-5 pt-3 pb-5 flex flex-col flex-1'>
                <h4 className='text-[15px] font-extrabold text-gray-800 tracking-tight capitalize line-clamp-1 mb-2'>
                    {data?.name?.[i18n.langCode]}
                </h4>
                <p className='text-[12px] text-gray-500 font-medium leading-relaxed line-clamp-2 flex-1'>
                    {data?.description?.[i18n.langCode]}
                </p>

                {/* CTA */}
                <Link
                    href={`/services/details/${data?._id}`}
                    className={`mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold ${ac.text} hover:gap-3 transition-all duration-200`}
                >
                    {i18n?.t('Read More')} <FiArrowRight size={13} />
                </Link>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
