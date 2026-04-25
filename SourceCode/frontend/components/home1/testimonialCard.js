import React from 'react';
import Image from 'next/image';
import { useI18n } from '../../app/providers/i18n';
import { useCurrency } from '../../app/contexts/site';
import { FiStar } from 'react-icons/fi';

const TestimonialCard = ({ allreview }) => {
    const i18n = useI18n();
    const { findDefaultTheme } = useCurrency();
    const isHome3 = findDefaultTheme?.name === 'home3';
    const rating = allreview?.rating || 5;
    const name = allreview?.user?.name || 'Anonymous';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className='px-2 pb-6'>
            <div className={`relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                ${isHome3
                    ? 'bg-white/8 border border-white/10 backdrop-blur-sm hover:shadow-[#F97316]/10'
                    : 'bg-white border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_30px_-8px_rgba(85,114,252,0.15)] hover:border-[#F97316]/15'
                }
            `}>
                {/* Large quote mark */}
                <div className='absolute top-4 right-5 text-[64px] font-black leading-none text-[#F97316]/10 select-none pointer-events-none'>"</div>

                {/* Star rating */}
                <div className='flex items-center gap-1 mb-4'>
                    {[...Array(5)].map((_, i) => (
                        <FiStar
                            key={i}
                            size={14}
                            className={i < rating ? 'fill-[#F97316] text-[#F97316]' : 'text-gray-200'}
                        />
                    ))}
                    <span className='ml-1.5 text-[11px] font-bold text-[#F97316]'>{rating}.0</span>
                </div>

                {/* Review text */}
                <p className={`text-[13.5px] leading-relaxed line-clamp-4 font-medium mb-5
                    ${isHome3 ? 'text-gray-200' : 'text-gray-600'}
                `}>
                    "{allreview?.description}"
                </p>

                {/* Reviewer info */}
                <div className='flex items-center gap-3 pt-4 border-t border-slate-100/50'>
                    <div className='relative shrink-0'>
                        {allreview?.user?.image ? (
                            <Image
                                src={allreview.user.image}
                                alt={name}
                                width={40}
                                height={40}
                                className='w-10 h-10 rounded-xl object-cover border-2 border-[#F97316]/20'
                            />
                        ) : (
                            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#FB923C] flex items-center justify-center text-white text-xs font-black'>
                                {initials}
                            </div>
                        )}
                        {/* Verified tick */}
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#F97316] flex items-center justify-center'>
                            <svg width='8' height='8' viewBox='0 0 12 12' fill='none'>
                                <path d='M2 6l3 3 5-5' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                            </svg>
                        </div>
                    </div>
                    <div className='min-w-0'>
                        <h4 className={`text-[13px] font-extrabold truncate ${isHome3 ? 'text-white' : 'text-gray-800'}`}>
                            {name}
                        </h4>
                        <p className='text-[11px] font-semibold text-[#F97316] uppercase tracking-wide'>
                            {i18n?.t('Verified Member')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
