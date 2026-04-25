'use client';

import { useState } from "react";
import BasicBar from "../../../../components/common/basic-bar";
import { fetchFaq } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { useI18n } from "../../../providers/i18n";
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const FaqItem = ({ item, i18n, isOpen, onToggle }) => (
    <div
        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? 'border-[#F97316]/30 shadow-[0_4px_20px_-6px_rgba(85,114,252,0.12)]' : 'border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]'} bg-white`}
    >
        <button
            onClick={onToggle}
            className='w-full flex items-center justify-between gap-4 px-6 py-5 text-left'
        >
            <div className='flex items-start gap-3 min-w-0'>
                <div className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${isOpen ? 'bg-[#F97316] text-white' : 'bg-slate-100 text-gray-400'}`}>
                    <FiHelpCircle size={14} />
                </div>
                <span className={`text-[14px] font-bold leading-snug transition-colors ${isOpen ? 'text-[#F97316]' : 'text-gray-800'}`}>
                    {item?.question[i18n.langCode]}
                </span>
            </div>
            <FiChevronDown
                size={18}
                className={`shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#F97316]' : ''}`}
            />
        </button>

        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                    <div className='px-6 pb-5 pl-16 text-[13px] text-gray-500 font-medium leading-relaxed border-t border-slate-50'>
                        <div className='pt-4'>
                            {item?.answer[i18n.langCode]}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const Page = () => {
    const i18n = useI18n();
    const [data] = useFetch(fetchFaq);
    const [activePanel, setActivePanel] = useState(null);

    return (
        <div>
            <BasicBar heading={i18n?.t('FAQ')} subHeading={i18n?.t('FAQ')} />

            <div className='container py-16 lg:py-24'>
                {/* Header */}
                <div className='max-w-2xl mb-14'>
                    <div className='inline-flex items-center gap-2 rounded-full border border-[#F97316]/25 bg-[#F97316]/8 px-4 py-1.5 mb-5'>
                        <span className='h-1.5 w-1.5 rounded-full bg-[#F97316]' />
                        <span className='text-[11px] font-black text-[#F97316] uppercase tracking-widest'>{i18n?.t('Help Center')}</span>
                    </div>
                    <h1 className='text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight leading-tight mb-4'>
                        {i18n?.t('Frequently Asked')} <span className='text-[#F97316]'>{i18n?.t('Questions')}</span>
                    </h1>
                    <p className='text-[13px] text-gray-500 font-medium leading-relaxed'>
                        {i18n?.t('Find answers to common questions about our gym facilities, membership options, personal training, and more.')}
                    </p>
                </div>

                {/* FAQ items */}
                <div className='max-w-3xl flex flex-col gap-3'>
                    {data?.docs?.map((item, idx) => (
                        <motion.div
                            key={item?._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                        >
                            <FaqItem
                                item={item}
                                i18n={i18n}
                                isOpen={activePanel === item?._id}
                                onToggle={() => setActivePanel(activePanel === item?._id ? null : item?._id)}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* CTA strip */}
                <div className='mt-14 max-w-3xl rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#F97316] p-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <div>
                        <p className='text-[11px] font-black text-white/60 uppercase tracking-widest mb-1'>{i18n?.t('Still have questions?')}</p>
                        <h3 className='text-xl font-extrabold text-white'>{i18n?.t("Can't find what you're looking for?")}</h3>
                    </div>
                    <a
                        href='/contact'
                        className='shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-[13px] font-bold text-[#F97316] shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5'
                    >
                        {i18n?.t('Contact Us')} <FiChevronDown size={14} className='-rotate-90' />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Page;

