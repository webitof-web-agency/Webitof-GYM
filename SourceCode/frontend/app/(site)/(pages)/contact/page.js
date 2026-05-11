'use client';
import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import BasicBar from '../../../../components/common/basic-bar';
import { postContactUs } from '../../../helpers/backend';
import { useEnv } from '../../../contexts/envContext';
import { useI18n } from '../../../providers/i18n';
import { FiArrowRight, FiMail, FiMapPin, FiMessageSquare, FiPhone, FiSend, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Page = () => {
    const data = useEnv();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        const res = await postContactUs(values);
        if (res?.error === false) {
            message.success(res?.msg);
            form.resetFields();
        } else {
            message.error(res?.message);
        }
        setLoading(false);
    };

    const contactItems = [
        {
            icon: <FiPhone size={20} className='text-[#F97316]' />,
            label: i18n?.t('Phone'),
            value: data?.phone ? `+${data.phone}` : '—',
            href: `tel:${data?.phone}`,
        },
        {
            icon: <FiMail size={20} className='text-[#F97316]' />,
            label: i18n?.t('Email'),
            value: data?.email || '—',
            href: `mailto:${data?.email}`,
        },
        {
            icon: <FiMapPin size={20} className='text-[#F97316]' />,
            label: i18n?.t('Address'),
            value: data?.address || '—',
            href: null,
        },
    ];

    const inputClass = 'h-11 rounded-xl border-slate-200 text-[13px] font-medium placeholder:text-gray-300 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10';

    return (
        <div>
            <BasicBar heading={i18n?.t('Contact Us')} subHeading={i18n?.t('Contact Us')} />

            <div className='container py-16 lg:py-24'>
                <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-14'>

                    {/* â”€â”€ Left info panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className='lg:col-span-2 flex flex-col gap-6'
                    >
                        {/* Header */}
                        <div>
                            <div className='inline-flex items-center gap-2 rounded-full border border-[#F97316]/25 bg-[#F97316]/8 px-4 py-1.5 mb-4'>
                                <span className='h-1.5 w-1.5 rounded-full bg-[#F97316]' />
                                <span className='text-[11px] font-black text-[#F97316] uppercase tracking-widest'>{i18n?.t('Get In Touch')}</span>
                            </div>
                            <h2 className='text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight leading-tight'>
                                {i18n?.t("We'd Love to")} <span className='text-[#F97316]'>{i18n?.t('Hear From You')}</span>
                            </h2>
                            <p className='text-[13px] text-gray-500 font-medium leading-relaxed mt-4'>
                                {i18n?.t('Have questions about memberships, training or anything else? Send us a message and we will get back to you shortly.')}
                            </p>
                        </div>

                        {/* Contact info cards */}
                        <div className='flex flex-col gap-4 mt-2'>
                            {contactItems.map((item, i) => (
                                <div key={i} className='flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:border-[#F97316]/20 hover:shadow-[0_4px_20px_-6px_rgba(85,114,252,0.1)] transition-all'>
                                    <div className='shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/8 border border-[#F97316]/15'>
                                        {item.icon}
                                    </div>
                                    <div className='min-w-0'>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>{item.label}</p>
                                        {item.href ? (
                                            <a href={item.href} className='text-[13px] font-bold text-gray-700 hover:text-[#F97316] transition-colors truncate block mt-0.5'>{item.value}</a>
                                        ) : (
                                            <p className='text-[13px] font-semibold text-gray-700 mt-0.5'>{item.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Decorative glow block */}
                        <div className='mt-4 rounded-2xl overflow-hidden relative h-48 bg-gradient-to-br from-[#C2410C] via-[#EA580C] to-[#F97316] flex items-center justify-center'>
                            <div className='absolute inset-0 opacity-[0.06]' style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                            <div className='text-center relative z-10'>
                                <FiMessageSquare size={36} className='text-white/60 mx-auto mb-3' />
                                <p className='text-white font-extrabold text-lg'>{i18n?.t("Let's Talk Fitness")}</p>
                                <p className='text-white/50 text-[12px] font-medium mt-1'>{i18n?.t('We reply within 24 hours')}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* â”€â”€ Right form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className='lg:col-span-3 rounded-2xl border border-slate-100 bg-white p-8 lg:p-10 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)]'
                    >
                        {/* Form header */}
                        <div className='mb-8'>
                            <h3 className='text-xl font-extrabold text-gray-800'>{i18n?.t('Send a Message')}</h3>
                            <p className='text-[13px] text-gray-400 font-medium mt-1'>{i18n?.t('Fill out the form below and we\'ll be in touch.')}</p>
                        </div>

                        <Form form={form} onFinish={onFinish} layout='vertical' className='space-y-4'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                {/* Name */}
                                <Form.Item
                                    name='name'
                                    label={<span className='text-[11px] font-black text-gray-500 uppercase tracking-widest'>{i18n?.t('Name')}</span>}
                                    rules={[{ required: true, message: i18n?.t('Please provide your Name') }]}
                                    className='mb-0'
                                >
                                    <div className='relative'>
                                        <FiUser size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none' />
                                        <Input placeholder={i18n?.t('Your full name')} className={`pl-9 ${inputClass}`} />
                                    </div>
                                </Form.Item>

                                {/* Subject */}
                                <Form.Item
                                    name='subject'
                                    label={<span className='text-[11px] font-black text-gray-500 uppercase tracking-widest'>{i18n?.t('Subject')}</span>}
                                    rules={[{ required: true, message: i18n?.t('Please provide your subject') }]}
                                    className='mb-0'
                                >
                                    <Input placeholder={i18n?.t('e.g. Membership inquiry')} className={inputClass} />
                                </Form.Item>

                                {/* Email */}
                                <Form.Item
                                    name='email'
                                    label={<span className='text-[11px] font-black text-gray-500 uppercase tracking-widest'>{i18n?.t('Email')}</span>}
                                    rules={[{ required: true, message: i18n?.t('Please provide your Email') }, { type: 'email', message: i18n?.t('Enter a valid email') }]}
                                    className='mb-0'
                                >
                                    <div className='relative'>
                                        <FiMail size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none' />
                                        <Input type='email' placeholder='you@example.com' className={`pl-9 ${inputClass}`} />
                                    </div>
                                </Form.Item>

                                {/* Phone */}
                                <Form.Item
                                    name='phone'
                                    label={<span className='text-[11px] font-black text-gray-500 uppercase tracking-widest'>{i18n?.t('Phone')}</span>}
                                    rules={[{ required: true, message: i18n?.t('Please provide your Phone Number') }]}
                                    className='mb-0'
                                >
                                    <div className='relative'>
                                        <FiPhone size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none' />
                                        <Input type='number' placeholder='+1 234 567 890' className={`pl-9 ${inputClass}`} />
                                    </div>
                                </Form.Item>
                            </div>

                            {/* Message */}
                            <Form.Item
                                name='message'
                                label={<span className='text-[11px] font-black text-gray-500 uppercase tracking-widest'>{i18n?.t('Message')}</span>}
                                rules={[{ required: true, message: i18n?.t('Please provide your message') }]}
                                className='mb-0'
                            >
                                <Input.TextArea
                                    placeholder={i18n?.t('Tell us how we can help you...')}
                                    rows={5}
                                    className='rounded-xl border-slate-200 text-[13px] font-medium placeholder:text-gray-300 resize-none'
                                />
                            </Form.Item>

                            {/* Submit */}
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full flex items-center justify-center gap-2 rounded-xl bg-[#F97316] py-3 text-sm font-bold text-white shadow-lg shadow-[#F97316]/25 transition-all hover:bg-[#EA580C] hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 mt-2'
                            >
                                {loading
                                    ? <span className='h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin' />
                                    : <><FiSend size={14} /> {i18n?.t('Send Message')}</>
                                }
                            </button>
                        </Form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Page;

