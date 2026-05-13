import React from 'react';
import { useI18n } from '../../app/providers/i18n';
import Image from 'next/image';
import { FiArrowRight, FiCheckCircle, FiUsers } from 'react-icons/fi';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const GroupCard = ({ group, index = 0 }) => {
    const i18n = useI18n();
    const { push } = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: (index % 4) * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className='group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_40px_-8px_rgba(85,114,252,0.13)] hover:border-[#F97316]/20 transition-all duration-300 cursor-pointer'
            onClick={() => push(`/group/${group?._id}`)}
        >
            {/* Cover image */}
            <div className='relative h-[160px] overflow-hidden bg-slate-50'>
                {group?.image ? (
                    <Image
                        src={group?.image}
                        alt={group?.name?.[i18n.langCode] || 'Group'}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F97316]/10 to-[#FB923C]/10'>
                        <FiUsers size={48} className='text-[#F97316]/30' />
                    </div>
                )}
                {/* Top accent */}
                <div className='absolute top-0 left-0 right-0 h-0.5 bg-[#F97316] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left' />
            </div>

            {/* Content */}
            <div className='p-5'>
                <h4 className='text-[14px] font-semibold text-gray-800 capitalize leading-tight group-hover:text-[#F97316] transition-colors mb-3'>
                    {group?.name?.[i18n.langCode]}
                </h4>

                {/* Facilities */}
                {group?.facilities?.length > 0 && (
                    <ul className='space-y-1.5 mb-4'>
                        {group.facilities.slice(0, 3).map((facility, i) => (
                            <li key={i} className='flex items-center gap-2'>
                                <FiCheckCircle size={12} className='text-[#F97316] shrink-0' />
                                <span className='text-[12px] text-gray-500 font-medium line-clamp-1'>{facility?.[i18n.langCode]}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Read more */}
                <div className='flex items-center gap-1.5 text-[12px] font-bold text-gray-400 group-hover:text-[#F97316] transition-colors'>
                    {i18n?.t('View Group')}
                    <FiArrowRight size={12} className='transition-transform group-hover:translate-x-1' />
                </div>
            </div>
        </motion.div>
    );
};

export default GroupCard;

