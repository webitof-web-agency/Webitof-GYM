import Image from 'next/image';
import React from 'react';
import { FiUser, FiCalendar, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { useI18n } from '../../app/providers/i18n';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const NewsCard = ({ data, index = 0 }) => {
    const i18n = useI18n();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className='group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_40px_-8px_rgba(85,114,252,0.12)] hover:border-[#F97316]/20 transition-all duration-300 flex flex-col'
        >
            {/* Cover image */}
            <Link href={`/blog/view/${data?._id}`} className='relative w-full h-[220px] overflow-hidden bg-slate-50 block shrink-0'>
                <Image
                    src={data.image}
                    alt={data?.title?.[i18n.langCode] || 'Blog'}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                {/* Category badge */}
                <div className='absolute top-3 left-3'>
                    <span className='text-[10px] font-black text-white bg-[#F97316] rounded-full px-3 py-1 uppercase tracking-widest shadow-md'>
                        {i18n?.t('Blog')}
                    </span>
                </div>
            </Link>

            {/* Content */}
            <div className='p-5 flex flex-col flex-1'>
                {/* Meta row */}
                <div className='flex items-center gap-4 mb-3'>
                    <div className='flex items-center gap-1.5 text-[11px] text-gray-400 font-medium'>
                        <FiUser size={11} />
                        <span className='line-clamp-1'>{data?.user?.name?.slice(0, 12) || 'Admin'}</span>
                    </div>
                    <div className='h-3 w-px bg-slate-200' />
                    <div className='flex items-center gap-1.5 text-[11px] text-gray-400 font-medium'>
                        <FiCalendar size={11} />
                        <span>{dayjs(data?.createdAt).format('DD MMM YYYY')}</span>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/blog/view/${data?._id}`} className='flex-1'>
                    <h5 className='text-[14.5px] font-extrabold text-gray-800 leading-snug line-clamp-2 capitalize group-hover:text-[#F97316] transition-colors'>
                        {data?.title?.[i18n.langCode]}
                    </h5>
                </Link>

                {/* Divider */}
                <div className='my-3 h-px bg-slate-100' />

                {/* Read more */}
                <Link
                    href={`/blog/view/${data?._id}`}
                    className='flex items-center gap-1.5 text-[12px] font-bold text-gray-400 group-hover:text-[#F97316] transition-all w-fit'
                >
                    {i18n?.t('Read More')}
                    <FiArrowRight size={12} className='transition-transform group-hover:translate-x-1' />
                </Link>
            </div>
        </motion.div>
    );
};

export default NewsCard;
