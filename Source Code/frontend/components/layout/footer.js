'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FiPhoneCall, FiMail, FiMapPin, FiArrowRight, FiSend } from 'react-icons/fi';
import { postAdminNewsletter } from '../../app/helpers/backend';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../app/providers/i18n';
import { useCurrency } from '../../app/contexts/site';
import { useEnv } from '../../app/contexts/envContext';

const Footer = () => {
    const i18n = useI18n();
    const pathname = usePathname();
    const { findDefaultTheme } = useCurrency();
    const data = useEnv();
    const [submitState, setSubmitState] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailVal, setEmailVal] = useState('');

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        setSubmitState({ type: '', message: '' });
        const res = await postAdminNewsletter(values);
        if (res?.error === true) {
            setSubmitState({ type: 'error', message: res?.msg || i18n?.t('Something went wrong') });
        } else {
            setSubmitState({ type: 'success', message: res?.msg || i18n?.t('Subscribed successfully') });
            setEmailVal('');
        }
        setIsSubmitting(false);
    };

    const socialLinks = [
        { href: data?.youtube, icon: <FaYoutube size={17} />, label: 'YouTube' },
        { href: data?.facebook, icon: <FaFacebook size={17} />, label: 'Facebook' },
        { href: `mailto:${data?.email}`, icon: <FiMail size={17} />, label: 'Email' },
        { href: `tel:${data?.phone}`, icon: <FiPhoneCall size={17} />, label: 'Phone' },
        { href: data?.linkedin, icon: <FaLinkedin size={17} />, label: 'LinkedIn' },
    ];

    const quickLinks = [
        { href: '/', text: 'Home' },
        { href: '/about', text: 'About' },
        { href: '/shop', text: 'Shop' },
        { href: '/services', text: 'Services' },
        { href: '/blog', text: 'Blog' },
    ];

    const supportLinks = [
        { href: '/contact', text: 'Contact Us' },
        { href: '/faq', text: "FAQ'S" },
        { href: '/privacy-policy', text: 'Privacy Policy' },
        { href: '/termsCondition', text: 'Terms & Condition' },
    ];

    const contactInfo = [
        { icon: <FiMapPin size={15} className='text-[#5572fc] shrink-0 mt-0.5' />, text: data?.address },
        { icon: <FiPhoneCall size={15} className='text-[#5572fc] shrink-0' />, text: data?.phone },
        { icon: <FiMail size={15} className='text-[#5572fc] shrink-0' />, text: data?.email },
    ];

    if (pathname === '/setting') return null;

    return (
        <footer className={`relative overflow-hidden bg-[#0c1728] ${findDefaultTheme?.name === 'home3' && pathname === '/' ? '' : 'mt-40'}`}>

            {/* Ambient glow top */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px] bg-gradient-to-r from-transparent via-[#5572fc]/40 to-transparent' />
            <div className='absolute top-0 left-1/4 w-[400px] h-[300px] bg-[#5572fc]/5 rounded-full blur-[100px] pointer-events-none' />
            <div className='absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-[#5572fc]/4 rounded-full blur-[80px] pointer-events-none' />

            {/* Newsletter Banner */}
            <div className='relative border-b border-white/5'>
                <div className='container py-10 lg:py-12'>
                    <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-16'>
                        {/* Left copy */}
                        <div className='shrink-0 text-center lg:text-left'>
                            <p className='text-[11px] font-black text-[#5572fc] uppercase tracking-widest mb-1.5'>{i18n?.t('Stay Updated')}</p>
                            <h3 className='text-xl lg:text-2xl font-extrabold text-white leading-tight'>
                                {i18n?.t('Subscribe to our Newsletter')}
                            </h3>
                            <p className='text-[13px] text-white/40 font-medium mt-1'>{i18n?.t('Get tips, offers and gym news delivered to your inbox.')}</p>
                        </div>

                        {/* Newsletter form */}
                        <form
                            className='w-full max-w-xl'
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit({ email: emailVal });
                            }}
                        >
                            <div className='flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-2 backdrop-blur-sm'>
                                <FiMail size={18} className='ml-3 text-white/30 shrink-0' />
                                <input
                                    id='footer-email'
                                    type='email'
                                    name='email'
                                    autoComplete='email'
                                    value={emailVal}
                                    onChange={(e) => setEmailVal(e.target.value)}
                                    placeholder={i18n?.t('Enter your email address...')}
                                    required
                                    onInvalid={(e) => e.target.setCustomValidity(i18n?.t('Please enter a valid email address'))}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                    className='flex-1 bg-transparent text-[13px] text-white placeholder-white/25 focus:outline-none'
                                />
                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='flex items-center gap-2 rounded-xl bg-[#5572fc] px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-[#5572fc]/25 transition-all hover:bg-[#4461eb] disabled:opacity-60 shrink-0'
                                >
                                    {isSubmitting ? (
                                        <span className='h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin' />
                                    ) : (
                                        <><FiSend size={14} /> {i18n?.t('Subscribe')}</>
                                    )}
                                </button>
                            </div>
                            {submitState.message && (
                                <p className={`mt-2 text-[12px] font-medium pl-1 ${submitState.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {submitState.message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Main footer grid */}
            <div className='container py-14 lg:py-16'>
                {!data ? null : (
                    <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-12'>

                        {/* Brand column */}
                        <div className='sm:col-span-2 lg:col-span-1'>
                            <Link href='/' className='inline-flex items-center'>
                                <Image
                                    src={data?.logo || '/logo.png'}
                                    height={200}
                                    width={420}
                                    alt='Logo'
                                    className='h-[48px] w-auto max-w-[200px] object-contain'
                                />
                            </Link>
                            <p className='mt-5 text-[13px] text-white/45 leading-relaxed line-clamp-4 font-medium'>
                                {data?.description}
                            </p>

                            {/* Social icons */}
                            <div className='mt-6 flex items-center gap-2'>
                                {socialLinks.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.href || '#'}
                                        target={link.href ? '_blank' : '_self'}
                                        rel={link.href ? 'noopener noreferrer' : undefined}
                                        aria-label={link.label}
                                        className='flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-white/50 transition-all hover:border-[#5572fc]/40 hover:bg-[#5572fc]/10 hover:text-[#5572fc]'
                                    >
                                        {link.icon}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className='flex items-center gap-2.5 text-[13px] font-black text-white uppercase tracking-widest mb-5'>
                                <span className='h-4 w-0.5 rounded-full bg-[#5572fc]' />
                                {i18n?.t('Quick Links')}
                            </h4>
                            <ul className='space-y-3'>
                                {quickLinks.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className='group flex items-center gap-2 text-[13px] text-white/50 font-medium transition-all hover:text-[#5572fc]'
                                        >
                                            <FiArrowRight size={12} className='opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-[#5572fc]' />
                                            {i18n?.t(link.text)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className='flex items-center gap-2.5 text-[13px] font-black text-white uppercase tracking-widest mb-5'>
                                <span className='h-4 w-0.5 rounded-full bg-[#5572fc]' />
                                {i18n?.t('Support')}
                            </h4>
                            <ul className='space-y-3'>
                                {supportLinks.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className='group flex items-center gap-2 text-[13px] text-white/50 font-medium transition-all hover:text-[#5572fc]'
                                        >
                                            <FiArrowRight size={12} className='opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-[#5572fc]' />
                                            {i18n?.t(link.text)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className='flex items-center gap-2.5 text-[13px] font-black text-white uppercase tracking-widest mb-5'>
                                <span className='h-4 w-0.5 rounded-full bg-[#5572fc]' />
                                {i18n?.t('Contacts')}
                            </h4>
                            <ul className='space-y-4'>
                                {contactInfo.map((info, i) => (
                                    <li key={i} className='flex items-start gap-3'>
                                        <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#5572fc]/10 border border-[#5572fc]/15 mt-0.5'>
                                            {info.icon}
                                        </div>
                                        <span className='text-[13px] text-white/50 font-medium leading-snug'>{info.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom bar */}
            <div className='border-t border-white/5'>
                <div className='container flex flex-col sm:flex-row items-center justify-between gap-3 py-5'>
                    <p className='text-[12px] text-white/30 font-medium'>{data?.footer_text}</p>
                    <div className='flex items-center gap-5'>
                        <Link href='/privacy-policy' className='text-[11px] text-white/25 hover:text-[#5572fc] font-medium transition-colors'>
                            {i18n?.t('Privacy Policy')}
                        </Link>
                        <Link href='/termsCondition' className='text-[11px] text-white/25 hover:text-[#5572fc] font-medium transition-colors'>
                            {i18n?.t('Terms of Service')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
