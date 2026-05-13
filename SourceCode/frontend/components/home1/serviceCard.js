import React from 'react';
import { useI18n } from '../../app/providers/i18n';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { columnFormatter } from '../../app/helpers/utils';
import { motion } from 'framer-motion';

const ServiceCard = ({ service, index = 0 }) => {
    const i18n = useI18n();

    // Cycle through accent colors for visual variety
    const accents = ['#F97316', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#6366f1'];
    const accent = accents[index % accents.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: (index % 4) * 0.08 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className='group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 p-6 flex flex-col'
        >
            {/* Top accent line â€” slides in on hover */}
            <div
                className='absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl'
                style={{ background: accent }}
            />

            {/* Icon */}
            <div
                className='w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110'
                style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
            >
                <Image
                    src={service?.icon}
                    width={28}
                    height={28}
                    alt='service icon'
                    className='object-contain w-7 h-7'
                />
            </div>

            {/* Title */}
            <h4 className='text-[15px] font-semibold text-gray-800 leading-snug mb-2 tracking-tight group-hover:text-[#F97316] transition-colors duration-300'>
                {columnFormatter(service?.name)}
            </h4>

            {/* Description */}
            <p className='text-[12.5px] text-gray-500 leading-relaxed line-clamp-3 font-medium flex-1 mb-4'>
                {columnFormatter(service?.description)}
            </p>

            {/* Read more link */}
            <Link
                href={`/services/details/${service?._id}`}
                className='flex items-center gap-1.5 text-[12px] font-bold w-fit transition-all duration-300 text-gray-400 group-hover:text-[#F97316]'
            >
                {i18n?.t('Learn More')}
                <FiArrowRight size={13} className='transition-transform group-hover:translate-x-1' />
            </Link>
        </motion.div>
    );
};

export default ServiceCard;

