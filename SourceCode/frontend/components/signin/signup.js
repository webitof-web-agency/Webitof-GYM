"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Form, Input, message, Modal } from 'antd';
import FormInput from '../form/input';
import { useRouter } from 'next/navigation';
import { useUser } from '../../app/contexts/user';
import OTPInput from 'react-otp-input';
import { useTimer } from 'use-timer';
import { postRegister, sendOtp } from '../../app/helpers/backend';
import PhoneNumberInput from '../form/phoneNumberInput';
import { useI18n } from '../../app/providers/i18n';
import { useEnv } from '../../app/contexts/envContext';
import { FiArrowRight, FiLock, FiMail, FiPhone, FiShield, FiUser } from 'react-icons/fi';

const SignUp = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const i18n = useI18n();
    const data = useEnv();
    const [loadingRequest, setLoadingRequest] = useState(true);
    const [value, setValue] = useState('user');
    const [otpModal, setOtpModal] = useState(false);
    const [email, setEmail] = useState('');
    const [registrationValues, setRegistrationValues] = useState({});
    const { getUser, user, userLoaded } = useUser();
    const [getEmail, setGetEmail] = useState('');

    const { time, start, pause, reset } = useTimer({ initialTime: 150, timerType: 'DECREMENTAL' });
    useEffect(() => { if (email) start(); if (time === 0) pause(); }, [time, start, pause, email]);
    useEffect(() => {
        if (!userLoaded) {
            return;
        }
        if (user?.role) {
            if (user.role === 'admin' || user.role === 'employee') router.replace('/admin');
            else if (user.role === 'user') router.replace('/user');
            else if (user.role === 'trainer') router.replace('/trainer');
            return;
        }
        setLoadingRequest(false);
    }, [router, user, userLoaded]);

    if (!userLoaded || user?.role) {
        return (
            <div className='container lg:my-[80px] my-[40px] otp-modal pb-20'>
                <div className='relative overflow-hidden rounded-2xl shadow-2xl shadow-black/15 min-h-[580px] bg-white flex items-center justify-center'>
                    <div className='h-10 w-10 rounded-full border-2 border-[#F97316]/20 border-t-[#F97316] animate-spin' />
                </div>
            </div>
        );
    }

    return (
        <div className='container lg:my-[80px] my-[40px] otp-modal pb-20'>

            {/* --- Main Card --- */ }
            <div className='relative overflow-hidden rounded-2xl shadow-2xl shadow-black/15 flex flex-col lg:flex-row min-h-[580px]'>

                {/* Left - Athlete Panel */}
                <div className='relative hidden lg:flex lg:w-[42%] flex-col items-center justify-end overflow-hidden bg-gradient-to-br from-[#C2410C] via-[#EA580C] to-[#F97316]'>
                    {/* Background pattern */}
                    <div className='absolute inset-0 opacity-[0.07]' style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                    {/* Glows */}
                    <div className='absolute top-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl' />
                    <div className='absolute bottom-20 right-0 w-32 h-32 bg-[#FB923C]/20 rounded-full blur-2xl' />

                    {/* Brand watermark - centered behind image */}
                    <p className='absolute inset-0 flex items-center justify-center text-[70px] xl:text-[90px] font-black font-montserrat text-white/15 leading-none select-none pointer-events-none tracking-tight text-center'>
                        {data?.title?.slice(0, 8)}
                    </p>

                    {/* Athlete image - constrained, bottom-anchored */}
                    <div className='relative z-10 w-[280px] xl:w-[320px] shrink-0'>
                        <Image
                            className='w-full h-auto object-contain object-bottom drop-shadow-2xl'
                            src='/signup.png'
                            alt='athlete'
                            width={320}
                            height={500}
                        />
                    </div>
                </div>

                {/* Right - Form Panel */}
                <div className='flex-1 bg-white flex flex-col justify-center px-8 sm:px-12 lg:px-14 py-12'>
                    {/* Header */}
                    <div className='mb-7'>
                        <div className='flex items-center gap-2 mb-3'>
                            <div className='w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center'>
                                <FiUser size={15} />
                            </div>
                            <span className='text-[11px] font-black text-[#F97316] uppercase tracking-widest'>New Account</span>
                        </div>
                        <h1 className='text-3xl font-extrabold text-gray-800 tracking-tight leading-tight'>
                            {i18n?.t("Let's Join Us")}
                        </h1>
                        <p className='text-sm text-gray-400 font-medium mt-1.5'>
                            {i18n?.t('Create your account and start your fitness journey.')}
                        </p>
                    </div>

                    {/* Form */}
                    <Form className='space-y-4' form={form} layout='vertical'
                        onFinish={async (values) => {
                            if (values?.email) {
                                setEmail(values?.email);
                                const { error, msg } = await sendOtp({ email: values?.email, phone: values?.phone, role: value || 'user', action: 'registration' });
                                if (error) { message.error(msg); }
                                else {
                                    message.success(`OTP sent to ${values?.email}`);
                                    setOtpModal(true);
                                    setGetEmail(values?.email);
                                    values.role = value || 'user';
                                    setRegistrationValues(values);
                                }
                            }
                        }}
                    >
                        {/* Two-column grid for name + email */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {/* Name */}
                            <Form.Item
                                label={<span className='text-[12px] font-bold text-gray-600 uppercase tracking-widest'>{i18n?.t('Name')}</span>}
                                name='name'
                                rules={[{ required: true, message: i18n?.t('Please input your Name!') }]}
                                className='mb-0'
                            >
                                <div className='relative'>
                                    <FiUser size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                                    <Input placeholder={i18n?.t('Full name')} className='pl-9 h-11 rounded-xl border-slate-200 text-[13px]' />
                                </div>
                            </Form.Item>

                            {/* Email */}
                            <Form.Item
                                label={<span className='text-[12px] font-bold text-gray-600 uppercase tracking-widest'>{i18n?.t('Email')}</span>}
                                name='email'
                                rules={[{ required: true, message: i18n?.t('Please input your Email!') }, { type: 'email', message: i18n?.t('Please enter a valid email address') }]}
                                className='mb-0'
                            >
                                <div className='relative'>
                                    <FiMail size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                                    <Input type='email' placeholder={i18n?.t('you@example.com')} className='pl-9 h-11 rounded-xl border-slate-200 text-[13px]' />
                                </div>
                            </Form.Item>
                        </div>

                        {/* Phone */}
                        <Form.Item
                            label={<span className='text-[12px] font-bold text-gray-600 uppercase tracking-widest'>{i18n?.t('Phone Number')}</span>}
                            className='mb-0'
                        >
                            <PhoneNumberInput name='phone' required={true} />
                        </Form.Item>

                        {/* Password row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <Form.Item
                                label={<span className='text-[12px] font-bold text-gray-600 uppercase tracking-widest'>{i18n?.t('Password')}</span>}
                                name='password'
                                rules={[{ required: true, message: i18n?.t('Please input your password!') }, { min: 6, message: i18n?.t('Min 6 characters') }]}
                                hasFeedback className='mb-0'
                            >
                                <div className='relative'>
                                    <FiLock size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10' />
                                    <Input.Password placeholder={i18n?.t('••••••••')} className='pl-9 h-11 rounded-xl border-slate-200 text-[13px]' />
                                </div>
                            </Form.Item>

                            <Form.Item
                                label={<span className='text-[12px] font-bold text-gray-600 uppercase tracking-widest'>{i18n?.t('Confirm Password')}</span>}
                                name='confirm_password'
                                hasFeedback className='mb-0'
                                rules={[
                                    { required: true, message: i18n?.t('Please confirm your password!') },
                                    ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error(i18n?.t('Passwords do not match!'))); } })
                                ]}
                            >
                                <div className='relative'>
                                    <FiLock size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10' />
                                    <Input.Password placeholder={i18n?.t('••••••••')} className='pl-9 h-11 rounded-xl border-slate-200 text-[13px]' />
                                </div>
                            </Form.Item>
                        </div>

                        {/* Submit */}
                        <button
                            type='submit'
                            className='w-full flex items-center justify-center gap-2 rounded-xl bg-[#F97316] py-3 text-sm font-bold text-white shadow-lg shadow-[#F97316]/30 hover:bg-[#EA580C] hover:shadow-xl hover:shadow-[#F97316]/40 transition-all hover:-translate-y-0.5 mt-2'
                        >
                            {loadingRequest
                                ? <span className='h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin' />
                                : <>{i18n?.t('Create Account')} <FiArrowRight size={15} /></>
                            }
                        </button>
                    </Form>

                    {/* Footer */}
                    <p className='mt-5 text-center text-[13px] text-gray-400 font-medium'>
                        {i18n?.t('Already have an account?')}{' '}
                        <Link href='/signin' className='text-[#F97316] font-bold hover:underline'>{i18n?.t('Sign In')}</Link>
                    </p>
                </div>
            </div>

            {/* --- OTP Modal --- */ }
            <Modal open={otpModal} maskClosable={false} footer={null} onCancel={() => setOtpModal(false)}
                className='!w-[460px]'
                styles={{ content: { borderRadius: '16px', padding: '32px' } }}
                title={
                    <div className='flex items-center gap-3 pb-3 border-b border-slate-100'>
                        <div className='w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0'>
                            <FiShield size={15} />
                        </div>
                        <div>
                            <p className='text-sm font-extrabold text-gray-800'>{i18n?.t('Verify Your Email')}</p>
                            <p className='text-[11px] text-gray-400 font-medium'>Code sent to <span className='text-[#F97316] font-bold'>{getEmail}</span></p>
                        </div>
                    </div>
                }
            >
                <Form className='mt-6 flex flex-col items-center'
                    onFinish={async (values) => {
                        if (values?.otp) {
                            const { error, msg, data } = await postRegister({ ...registrationValues, otp: values?.otp });
                            if (error) { message.error(msg); }
                            else {
                                setOtpModal(false);
                                localStorage.setItem('token', data.token);
                                await getUser();
                                message.success(msg);
                                if (data?.role === 'admin' || data?.role === 'employee') router.replace('/admin');
                                else if (data?.role === 'trainer') router.replace('/trainer');
                                else router.replace('/user');
                            }
                        }
                    }}
                >
                    <Form.Item name='otp' className='mb-4'>
                        <OTPInput numInputs={4} renderInput={(props) => <input {...props} />}
                            inputStyle={{ width: '52px', height: '52px', marginRight: '12px', fontSize: '22px', border: '2px solid #e2e8f0', outline: 'none', borderRadius: '12px', fontWeight: '700', textAlign: 'center' }}
                        />
                    </Form.Item>
                    <p className='text-[12px] text-gray-400 font-medium mb-5 text-center'>
                        {i18n?.t("Didn't receive the code?")}{' '}
                        {time === 0
                            ? <span className='text-[#F97316] font-bold cursor-pointer' onClick={async () => { const { error, msg } = await sendOtp({ email, action: 'registration' }); if (error) message.error(msg); else { message.success(msg); reset(); start(); } }}>{i18n?.t('Resend')}</span>
                            : <span className='text-[#F97316] font-bold'>{i18n?.t('resend in')} {time}s</span>
                        }
                    </p>
                    <button className='w-full bg-[#F97316] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#EA580C] transition-colors shadow-lg shadow-[#F97316]/25'>
                        {i18n?.t('Verify & Create Account')}
                    </button>
                    <p className='mt-4 text-[12px] text-gray-400 font-medium text-center'>
                        {i18n?.t('Already have an account?')}{' '}
                        <Link href='/signin' onClick={() => setOtpModal(false)} className='text-[#F97316] font-bold hover:underline'>{i18n?.t('Sign in now')}</Link>
                    </p>
                </Form>
            </Modal>
        </div>
    );
};

export default SignUp;

