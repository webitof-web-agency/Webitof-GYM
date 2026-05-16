import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const ExpartCard = ({ team }) => {
    const [showSocial, setShowSocial] = useState(false);

    const socials = [
        { href: team?.instagram, icon: <FaInstagram size={14} />, label: 'Instagram' },
        { href: team?.linkedin, icon: <FaLinkedin size={14} />, label: 'LinkedIn' },
        { href: team?.twitter, icon: <FaXTwitter size={14} />, label: 'Twitter' },
        { href: team?.facebook, icon: <FaFacebook size={14} />, label: 'Facebook' },
    ].filter(s => s.href);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_-8px_rgba(85,114,252,0.15)] hover:border-[#F97316]/20 transition-all duration-300'
        >
            {/* Photo */}
            <div className='relative sm:h-[320px] h-[260px] overflow-hidden bg-slate-50'>
                <Image
                    src={team?.image}
                    alt={team?.name}
                    fill
                    className='object-cover object-top transition-transform duration-500 group-hover:scale-105'
                />
                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-[#F97316]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400' />

                {/* Social icons - appear on hover */}
                <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300'>
                    {socials.map((s, i) => (
                        <Link
                            key={i}
                            href={s.href || '#'}
                            target='_blank'
                            aria-label={s.label}
                            className='flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-gray-700 hover:bg-[#F97316] hover:text-white transition-all duration-200 shadow-sm'
                        >
                            {s.icon}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className='p-5 flex items-center justify-between'>
                <div className='min-w-0'>
                    <Link
                        href={`/trainers/view/${team?._id}`}
                        className='text-[15px] font-semibold text-gray-800 capitalize hover:text-[#F97316] transition-colors block leading-tight truncate'
                    >
                        {team?.name}
                    </Link>
                    <p className='text-[11px] font-bold text-[#F97316] uppercase tracking-widest mt-1 truncate'>
                        {team?.role}
                    </p>
                </div>
                <Link
                    href={`/trainers/view/${team?._id}`}
                    className='shrink-0 ml-3 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 text-gray-400 hover:border-[#F97316] hover:text-[#F97316] transition-all duration-200'
                >
                    <FiArrowRight size={14} />
                </Link>
            </div>
        </motion.div>
    );
};

export default ExpartCard;

