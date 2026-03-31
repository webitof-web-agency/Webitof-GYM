"use client"
import React from 'react';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { useI18n } from '../../app/providers/i18n';

const BasicBar = ({ heading, subHeading }) => {
    const i18n = useI18n();
    return (
        <section className="relative w-full overflow-hidden bg-cover bg-center bg-[url(/basic.png)]">
            {/* Layered overlay: dark base + subtle blue gradient */}
            <div className='absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40' />
            {/* Blue glow from bottom-left */}
            <div className='absolute bottom-0 left-0 w-[400px] h-[200px] bg-[#5572fc]/15 blur-[80px] pointer-events-none' />
            {/* Top accent line */}
            <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5572fc]/80 via-[#7c93ff]/60 to-transparent' />

            <div className='relative container lg:h-[320px] sm:h-[260px] h-[220px] flex flex-col justify-end pb-10 lg:pb-14'>
                {/* Heading */}
                <h2 className="font-montserrat text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold capitalize tracking-tight leading-tight mb-3">
                    {heading}
                </h2>

                {/* Breadcrumb pill */}
                <div className='flex items-center gap-1.5 w-fit rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5'>
                    <FiHome size={13} className='text-[#5572fc] shrink-0' />
                    <Link href='/' className='text-[#7c93ff] text-[12px] font-bold capitalize hover:text-white transition-colors'>
                        {i18n?.t('Home')}
                    </Link>
                    <FiChevronRight size={13} className='text-white/30' />
                    <span className='text-white/70 text-[12px] font-semibold capitalize'>{subHeading}</span>
                </div>
            </div>
        </section>
    );
};

export default BasicBar;
