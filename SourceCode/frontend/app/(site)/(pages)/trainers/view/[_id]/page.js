"use client";
import React, { useEffect } from 'react';
import BasicBar from '../../../../../../components/common/basic-bar';
import Image from 'next/image';
import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiAward, FiMail, FiMapPin, FiPhone, FiStar } from 'react-icons/fi';
import { useFetch } from '../../../../../helpers/hooks';
import { trainerdetails } from '../../../../../helpers/backend';
import { useI18n } from '../../../../../providers/i18n';
import { motion } from 'framer-motion';

const Page = ({ params }) => {
    const [data, getData, { loading }] = useFetch(trainerdetails, {}, false);
    const i18n = useI18n();

    useEffect(() => {
        getData({ _id: params?._id });
    }, [params?._id]);

    const socials = [
        { href: data?.twitter, icon: <FaXTwitter size={16} />, label: 'Twitter' },
        { href: data?.facebook, icon: <FaFacebook size={16} />, label: 'Facebook' },
        { href: data?.linkedin, icon: <FaLinkedin size={16} />, label: 'LinkedIn' },
        { href: data?.instagram, icon: <FaInstagram size={16} />, label: 'Instagram' },
    ].filter(s => s.href);

    const contactItems = [
        { icon: <FiAward size={16} className='text-[#5572fc]' />, label: i18n?.t('Experience'), value: data?.experience },
        { icon: <FiMail size={16} className='text-[#5572fc]' />, label: i18n?.t('Email'), value: data?.email },
        { icon: <FiPhone size={16} className='text-[#5572fc]' />, label: i18n?.t('Phone'), value: data?.phone },
        { icon: <FiMapPin size={16} className='text-[#5572fc]' />, label: i18n?.t('Address'), value: data?.address },
    ];

    if (loading) return (
        <div>
            <BasicBar heading={i18n?.t('Trainers')} subHeading={i18n?.t('Trainer Details')} />
            <div className='container py-20 flex justify-center'>
                <div className='h-8 w-8 rounded-full border-4 border-[#5572fc]/20 border-t-[#5572fc] animate-spin' />
            </div>
        </div>
    );

    return (
        <div>
            <BasicBar heading={i18n?.t('Trainers')} subHeading={i18n?.t('Trainer Details')} />

            <div className='container py-16 lg:py-24'>

                {/* ── Profile Hero Card ─────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className='relative overflow-hidden rounded-2xl border border-slate-100 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.12)] bg-white mb-8'
                >
                    {/* Top gradient strip */}
                    <div className='h-2 bg-gradient-to-r from-[#3a52c4] via-[#5572fc] to-[#7c93ff]' />

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-0'>

                        {/* Left — Photo */}
                        <div className='relative overflow-hidden bg-slate-50 lg:rounded-none'>
                            {/* Background pattern */}
                            <div className='absolute inset-0 opacity-[0.04]' style={{ backgroundImage: 'radial-gradient(circle, #5572fc 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                            <div className='relative aspect-[3/4] lg:aspect-auto lg:h-full min-h-[300px]'>
                                {data?.image && (
                                    <Image
                                        src={data.image}
                                        fill
                                        alt={data?.name || 'Trainer'}
                                        className='object-cover object-top'
                                    />
                                )}
                                {/* Gradient at bottom */}
                                <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent' />
                                {/* Role badge */}
                                <div className='absolute bottom-5 left-5'>
                                    <span className='inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[11px] font-black text-[#5572fc] uppercase tracking-widest shadow-md'>
                                        <FiStar size={11} className='fill-[#5572fc]' /> {i18n?.t('Trainer')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right — Info */}
                        <div className='lg:col-span-2 p-8 lg:p-12 flex flex-col justify-between'>
                            {/* Header */}
                            <div>
                                <div className='flex flex-wrap items-start justify-between gap-4 mb-4'>
                                    <div>
                                        <h1 className='text-3xl lg:text-4xl font-extrabold text-gray-800 capitalize tracking-tight leading-tight'>
                                            {data?.name}
                                        </h1>
                                        <p className='text-[13px] text-[#5572fc] font-bold uppercase tracking-widest mt-1'>{data?.role}</p>
                                    </div>

                                    {/* Social links */}
                                    {socials.length > 0 && (
                                        <div className='flex items-center gap-2'>
                                            {socials.map((s, i) => (
                                                <Link
                                                    key={i}
                                                    href={s.href}
                                                    target='_blank'
                                                    aria-label={s.label}
                                                    className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-gray-500 transition-all hover:border-[#5572fc] hover:bg-[#5572fc]/5 hover:text-[#5572fc]'
                                                >
                                                    {s.icon}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Short bio */}
                                <p className='text-[13px] text-gray-500 leading-relaxed font-medium mb-8 max-w-[560px]'>
                                    {data?.short_bio}
                                </p>

                                {/* Divider */}
                                <div className='h-px bg-slate-100 mb-8' />

                                {/* Contact grid */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                    {contactItems.map((item, idx) => (
                                        <div key={idx} className='flex items-center gap-4'>
                                            <div className='shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-[#5572fc]/15 bg-[#5572fc]/8'>
                                                {item.icon}
                                            </div>
                                            <div className='min-w-0'>
                                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>{item.label}</p>
                                                <p className='text-[13px] font-bold text-gray-700 truncate mt-0.5'>{item.value || '—'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── About & Skills ────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                    className='grid grid-cols-1 lg:grid-cols-2 gap-8'
                >
                    {/* About */}
                    <div className='rounded-2xl border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] bg-white p-8'>
                        <div className='flex items-center gap-2.5 mb-5'>
                            <span className='h-5 w-0.5 rounded-full bg-[#5572fc]' />
                            <h2 className='text-[13px] font-black text-gray-800 uppercase tracking-widest'>{i18n?.t('About')} {data?.name}</h2>
                        </div>
                        <p className='text-[13px] text-gray-500 leading-relaxed font-medium'>
                            {data?.about || '—'}
                        </p>
                    </div>

                    {/* Skills */}
                    {data?.skills?.length > 0 && (
                        <div className='rounded-2xl border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] bg-white p-8'>
                            <div className='flex items-center gap-2.5 mb-6'>
                                <span className='h-5 w-0.5 rounded-full bg-[#5572fc]' />
                                <h2 className='text-[13px] font-black text-gray-800 uppercase tracking-widest'>{i18n?.t('Key Skills')}</h2>
                            </div>
                            <div className='flex flex-col gap-5'>
                                {data.skills.map((skill) => (
                                    <div key={skill?._id}>
                                        <div className='flex justify-between mb-2'>
                                            <span className='text-[13px] font-bold text-gray-700 capitalize'>{skill?.name}</span>
                                            <span className='text-[12px] font-extrabold text-[#5572fc]'>{skill?.level}%</span>
                                        </div>
                                        {/* Custom progress bar */}
                                        <div className='h-2 w-full rounded-full bg-slate-100 overflow-hidden'>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill?.level}%` }}
                                                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                                                className='h-full rounded-full bg-gradient-to-r from-[#4461eb] to-[#5572fc]'
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Page;
