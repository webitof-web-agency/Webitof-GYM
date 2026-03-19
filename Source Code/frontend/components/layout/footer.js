'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaFacebook, FaLinkedin, FaPhoneAlt, FaEnvelope, FaYoutube } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import { IoHomeOutline } from 'react-icons/io5';
import { LuMailCheck } from 'react-icons/lu';
import { postAdminNewsletter } from '../../app/helpers/backend';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../app/providers/i18n';
import { useCurrency } from '../../app/contexts/site';
import { useEnv } from '../../app/contexts/envContext';

const Footer = () => {
    const i18n = useI18n();
    const pathname = usePathname();
    const { findDefaultTheme } = useCurrency()
    const data = useEnv();
    const [submitState, setSubmitState] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        setSubmitState({ type: '', message: '' });
        const res = await postAdminNewsletter(values);
        if (res?.error === true) {
            setSubmitState({ type: 'error', message: res?.msg || i18n?.t('Something went wrong') });
        } else {
            setSubmitState({ type: 'success', message: res?.msg || i18n?.t('Subscribed successfully') });
        }
        setIsSubmitting(false);
    };
    const socialLinks = [
        { href: data?.youtube, icon: <FaYoutube size={20} />, label: i18n?.t('YouTube') || 'YouTube' },
        { href: data?.facebook, icon: <FaFacebook size={20} />, label: i18n?.t('Facebook') || 'Facebook' },
        { href: `mailto:${data?.email}`, icon: <FaEnvelope size={20} />, label: i18n?.t('Email') || 'Email' },
        { href: `tel:${data?.phone}`, icon: <FaPhoneAlt size={20} />, label: i18n?.t('Phone') || 'Phone' },
        { href: data?.linkedin, icon: <FaLinkedin size={20} />, label: i18n?.t('LinkedIn') || 'LinkedIn' },
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
        { icon: <IoHomeOutline className='text-xl text-[#5572fc]' />, text: data?.address },
        { icon: <FiPhoneCall className='text-xl text-[#5572fc]' />, text: data?.phone },
        { icon: <LuMailCheck className='text-xl text-[#5572fc]' />, text: data?.email },
    ];

    return (
        <footer className={`${pathname === '/setting' ? "hidden" : ""} pb-10 lg:pt-32 pt-10 !bg-[#2C2C2C] ${findDefaultTheme?.name === 'home3' && pathname === "/" ? '' : 'mt-40'}`}>
            <div className='container font-poppins !text-white'>
                {!data ? null : (
                    <div className='flex flex-col lg:flex-row lg:gap-10 2xl:gap-40'>
                        <div className='w-full lg:w-[33%]'>
                            <Link href='/' className='flex items-center text-[#5572fc] '>
                                <Image
                                    src={data?.logo || '/logo.png'}
                                    height={200}
                                    width={420}
                                    alt='logoImage'
                                    className='h-[68px] w-auto max-w-[320px] object-contain'
                                />
                            </Link>
                            <p className='mt-[30px] text-[16px] text-white lg:mt-[60px] line-clamp-3'>
                                {data?.description}
                            </p>
                            <div className='mt-4 flex gap-6 lg:mt-[42px]'>
                                {socialLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href || '#'}
                                        target={link.href ? '_blank' : '_self'}
                                        rel={link.href ? 'noopener noreferrer' : undefined}
                                        aria-label={link.label}
                                        className='text-white hover:text-[#5572fc]'
                                    >
                                        {link.icon}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className='mt-10 grid w-full grid-cols-1 gap-10 sm:grid-cols-3 lg:mt-0 lg:gap-0'>
                            <div>
                                <h3 className='flex items-center gap-2 text-[16px] font-bold'>
                                    <span className='h-3 w-3 rounded-full bg-[#5572fc]'></span>
                                    <span>{i18n?.t('Quick Links')}</span>
                                </h3>
                                <ul className='mt-7 space-y-4'>
                                    {quickLinks.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                href={link.href}
                                                className='font-poppins  hover:text-[#5572fc]'
                                            >
                                                {i18n?.t(link.text)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className='flex items-center gap-2 text-[16px] font-bold'>
                                    <span className='h-3 w-3 rounded-full bg-[#5572fc]'></span>
                                    <span>{i18n?.t('Support')}</span>
                                </h3>
                                <ul className='mt-7 space-y-4'>
                                    {supportLinks.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                href={link.href}
                                                className='font-poppins hover:text-[#5572fc]'
                                            >
                                                {i18n?.t(link.text)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='w-full'>
                                <h3 className='flex items-center gap-2 text-[16px] font-bold'>
                                    <span className='h-3 w-3 rounded-full bg-[#5572fc]'></span>
                                    <span>{i18n?.t('Contacts')}</span>
                                </h3>
                                <ul className='mt-7 space-y-4'>
                                    {contactInfo.map((info, index) => (
                                        <li key={index} className='flex  gap-2'>
                                            <span className='w-[25px] text-white'>{info.icon}</span>
                                            <span className='font-poppins text-white'>{info.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                <div className='mx-auto mt-10 sm:w-[80%] lg:w-[60%]'>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const email = e.target.email.value;
                            handleSubmit({ email });
                            if (!isSubmitting) {
                                e.target.reset();
                            }
                        }}
                    >
                        <label htmlFor="footer-email" className="sr-only">
                            {i18n?.t('Email') || 'Email'}
                        </label>
                        <input
                            id="footer-email"
                            type='email'
                            name='email'
                            autoComplete="email"
                            placeholder={`${i18n?.t('Your Email') || 'Your Email'} (name@example.com)…`}
                            required
                            onInvalid={(e) => e.target.setCustomValidity(i18n?.t('Please enter a valid email address'))}
                            onInput={(e) => e.target.setCustomValidity('')}
                            className='w-full border-b-2 border-[#D9D9D9] py-5 !bg-[#2C2C2C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5572fc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2C2C2C]'
                        />
                        <div className='mx-auto mt-6 text-center'>
                            <button
                                type="submit"
                                className='mx-auto rounded bg-[#5572fc] px-8 py-4 text-[18px] font-medium text-white duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70'
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? i18n?.t('Submitting…') || 'Submitting…' : i18n?.t('Subscribe')}
                            </button>
                        </div>
                        {submitState.message && (
                            <p className={`mt-4 text-center text-sm ${submitState.type === 'error' ? 'text-red-300' : 'text-green-300'}`}>
                                {submitState.message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
            <div className='mt-12 border-t border-[#D9D9D9] pt-5 text-center'>
                <p className='text-[16px] font-bold !text-white'>{data?.footer_text}</p>
            </div>
        </footer>
    );
};
export default Footer;
