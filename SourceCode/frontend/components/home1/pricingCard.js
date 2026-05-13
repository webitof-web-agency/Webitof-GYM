'use client';
import Image from 'next/image';
import React, { useState, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '../../app/providers/i18n';
import UserContext from '../../app/contexts/user';
import { message, Tooltip } from 'antd';
import { useCurrency } from '../../app/contexts/site';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight, FiZap } from 'react-icons/fi';

const PricingCard = ({ data, activeTab, index = 0 }) => {
    const i18n = useI18n();
    const { push } = useRouter();
    const { user } = useContext(UserContext);
    const { currencySymbol, convertAmount, findDefaultTheme } = useCurrency();
    const pathName = usePathname();
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    // Middle card is "most popular"
    const isPopular = index === 1;

    const handleButtonClick = () => {
        switch (user?.role) {
            case 'admin':
            case 'trainer':
                message.warning(i18n?.t('As a trainer or admin, You do not need to buy a subscription'));
                break;
            case 'user':
                push(`/pricing-plan/${data?._id}?type=${activeTab}`);
                break;
            default:
                push('/signin');
        }
    };

    const isHome3 = findDefaultTheme?.name === 'home3' && pathName === '/';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300
                ${isPopular
                    ? 'bg-gradient-to-br from-[#F97316] to-[#3a56f0] shadow-[0_20px_60px_-12px_rgba(85,114,252,0.5)] scale-105 border-0'
                    : isHome3
                        ? 'bg-white/5 border border-white/10 backdrop-blur-sm hover:shadow-xl'
                        : 'bg-white border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_-8px_rgba(85,114,252,0.15)] hover:border-[#F97316]/20'
                }
            `}
        >
            {/* Popular badge */}
            {isPopular && (
                <div className='absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm'>
                    <FiZap size={11} className='text-yellow-300' />
                    <span className='text-[10px] font-black text-white uppercase tracking-widest'>Most Popular</span>
                </div>
            )}

            {/* Plan Image */}
            <div className='relative h-[200px] overflow-hidden'>
                <Image
                    src={data?.image}
                    width={524}
                    height={270}
                    alt='plan image'
                    className='w-full h-full object-cover'
                />
                {/* Image overlay for popular */}
                {isPopular && <div className='absolute inset-0 bg-[#F97316]/20 mix-blend-multiply' />}
                {/* Gradient fade-to-card */}
                <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t ${isPopular ? 'from-[#F97316]' : isHome3 ? 'from-[#0d1829]' : 'from-white'} to-transparent`} />
            </div>

            {/* Card Content */}
            <div className='flex flex-col flex-1 p-6'>
                {/* Plan name + price */}
                <div className='mb-5'>
                    <h2 className={`text-xl font-bold capitalize tracking-tight mb-1 ${isPopular ? 'text-white' : isHome3 ? 'text-white' : 'text-gray-800'}`}>
                        {data?.name?.[i18n.langCode]}
                    </h2>
                    <div className='flex items-end gap-1'>
                        <span className={`text-3xl font-black ${isPopular ? 'text-white' : 'text-[#F97316]'}`}>
                            {currencySymbol}{activeTab === 'monthly' ? convertAmount(data?.monthly_price) : convertAmount(data?.yearly_price)}
                        </span>
                        <span className={`text-[12px] font-semibold mb-1.5 ${isPopular ? 'text-white/60' : 'text-gray-400'}`}>
                            /{activeTab === 'monthly' ? i18n?.t('mo') : i18n?.t('yr')}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className={`h-px mb-5 ${isPopular ? 'bg-white/20' : 'bg-slate-100'}`} />

                {/* Features List */}
                <ul className='space-y-2.5 flex-1'>
                    {data?.features?.slice(0, showAllFeatures ? data.features.length : 4).map((item, idx) => (
                        <li key={idx} className='flex items-start gap-2.5'>
                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isPopular ? 'bg-white/20 text-white' : 'bg-[#F97316]/10 text-[#F97316]'}`}>
                                <FiCheck size={11} strokeWidth={3} />
                            </span>
                            <Tooltip title={item?.[i18n.langCode]}>
                                <span className={`text-[13px] font-medium leading-snug line-clamp-1 ${isPopular ? 'text-white/85' : isHome3 ? 'text-gray-200' : 'text-gray-600'}`}>
                                    {item?.[i18n.langCode]}
                                </span>
                            </Tooltip>
                        </li>
                    ))}
                </ul>

                {/* Show more / less */}
                {data?.features?.length > 4 ? (
                    <button
                        onClick={() => setShowAllFeatures(!showAllFeatures)}
                        className={`mt-3 text-[12px] font-bold hover:underline ${isPopular ? 'text-white/70 hover:text-white' : 'text-[#F97316]'}`}
                    >
                        {showAllFeatures ? i18n?.t('Show Less â†‘') : i18n?.t('Show More â†“')}
                    </button>
                ) : <div className='h-3' />}

                {/* CTA Button */}
                <button
                    onClick={handleButtonClick}
                    className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300
                        ${isPopular
                            ? 'bg-white text-[#F97316] hover:bg-white/90 shadow-lg'
                            : 'bg-[#F97316] text-white hover:bg-[#EA580C] shadow-md shadow-[#F97316]/25 hover:shadow-lg hover:shadow-[#F97316]/35'
                        }
                    `}
                >
                    {i18n?.t('Get Started')}
                    <FiArrowRight size={15} className='transition-transform group-hover:translate-x-1' />
                </button>
            </div>
        </motion.div>
    );
};

export default PricingCard;

