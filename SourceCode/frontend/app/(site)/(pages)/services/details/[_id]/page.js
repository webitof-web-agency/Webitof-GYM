'use client';

import { useEffect } from "react";
import { fetchService, fetchServices } from "../../../../../helpers/backend";
import { useFetch } from "../../../../../helpers/hooks";
import { useI18n } from "../../../../../providers/i18n";
import BasicBar from "../../../../../../components/common/basic-bar";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

const Page = ({ params }) => {
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchService);
    const [alldata, getAlldata] = useFetch(fetchServices);

    useEffect(() => { getData({ _id: params?._id }); }, [params?._id]);
    useEffect(() => { getAlldata(); }, []);

    return (
        <div>
            <BasicBar
                heading={data?.name?.[i18n.langCode]}
                subHeading={data?.name?.[i18n.langCode]}
            />

            <div className='container py-16 lg:py-24'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12'>

                    {/* ── Sidebar ─────────────────────────────────────── */}
                    <div className='lg:col-span-1 space-y-4'>
                        {/* All Services card */}
                        <div className='rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] overflow-hidden'>
                            {/* Header */}
                            <div className='bg-gradient-to-r from-[#EA580C] to-[#F97316] px-5 py-4'>
                                <p className='text-[11px] font-black text-white/60 uppercase tracking-widest mb-0.5'>{i18n?.t('Browse')}</p>
                                <h3 className='text-[15px] font-extrabold text-white capitalize'>{i18n?.t('All Services')}</h3>
                            </div>

                            {/* Service links */}
                            <div className='divide-y divide-slate-50'>
                                {alldata?.docs?.map((service) => {
                                    const isActive = service?._id === params?._id;
                                    return (
                                        <Link
                                            key={service?._id}
                                            href={`/services/details/${service?._id}`}
                                            className={`flex items-center justify-between px-5 py-3.5 transition-all duration-200 group ${isActive ? 'bg-[#F97316]/6' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className='flex items-center gap-3 min-w-0'>
                                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${isActive ? 'bg-[#F97316] border-[#F97316]' : 'bg-slate-50 border-slate-200 group-hover:border-[#F97316]/30'}`}>
                                                    <FiChevronRight size={12} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#F97316]'} />
                                                </div>
                                                <span className={`text-[13px] font-bold line-clamp-1 transition-colors ${isActive ? 'text-[#F97316]' : 'text-gray-700 group-hover:text-[#F97316]'}`}>
                                                    {service?.name?.[i18n.langCode]}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <span className='shrink-0 h-1.5 w-1.5 rounded-full bg-[#F97316]' />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CTA card */}
                        <div className='rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#C2410C] via-[#EA580C] to-[#F97316] p-6'>
                            <div className='absolute inset-0 opacity-[0.06]' style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                            <div className='relative z-10'>
                                <p className='text-[11px] font-black text-white/60 uppercase tracking-widest mb-2'>{i18n?.t('Get Started')}</p>
                                <h4 className='text-[16px] font-extrabold text-white leading-snug mb-4'>
                                    {i18n?.t('Ready to start your fitness journey?')}
                                </h4>
                                <Link
                                    href='/contact'
                                    className='inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[12px] font-bold text-[#F97316] hover:shadow-lg transition-all hover:-translate-y-0.5'
                                >
                                    {i18n?.t('Contact Us')} <FiArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── Main content ─────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className='lg:col-span-2'
                    >
                        {/* Hero image */}
                        {data?.image && (
                            <div className='relative rounded-2xl overflow-hidden h-[300px] lg:h-[420px] bg-slate-100 mb-8 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.1)]'>
                                <Image
                                    src={data.image}
                                    alt={data?.name?.[i18n.langCode] || 'Service'}
                                    fill
                                    className='object-cover'
                                />
                                {/* Gradient overlay */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
                                {/* Service name pill */}
                                <div className='absolute bottom-5 left-5'>
                                    <span className='inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[12px] font-black text-[#F97316] shadow-md capitalize'>
                                        {data?.name?.[i18n.langCode]}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Content card */}
                        <div className='rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] p-7 lg:p-10'>
                            <div className='flex items-center gap-2.5 mb-5'>
                                <span className='h-5 w-0.5 rounded-full bg-[#F97316]' />
                                <h2 className='text-[13px] font-black text-gray-800 uppercase tracking-widest capitalize'>
                                    {i18n?.t('About This Service')}
                                </h2>
                            </div>
                            <h1 className='text-2xl lg:text-3xl font-extrabold text-gray-800 capitalize tracking-tight leading-tight mb-5'>
                                {data?.name?.[i18n.langCode]}
                            </h1>
                            <p className='text-[13px] text-gray-500 font-medium leading-relaxed'>
                                {data?.description?.[i18n.langCode]}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Page;
