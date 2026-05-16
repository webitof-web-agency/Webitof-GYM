'use client';
import React, { useEffect, useState } from 'react';
import FormInput from '../form/input';
import { Form, Input, message, Modal } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '../../app/contexts/user';
import { postLogin, postResetPassword, postVerifyOtp, sendOtp } from '../../app/helpers/backend';
import OTPInput from 'react-otp-input';
import { useTimer } from 'use-timer';
import { useI18n } from '../../app/providers/i18n';
import { useEnv } from '../../app/contexts/envContext';
import { FiArrowRight, FiLock, FiMail, FiShield } from 'react-icons/fi';

const getDashboardPath = (role) => {
    if (role === 'admin' || role === 'employee') return '/admin';
    if (role === 'trainer') return '/trainer';
    return '/user';
};

const SignIn = () => {
    const router = useRouter();
    const i18n = useI18n();
    const data = useEnv();
    const [loadingRequest, setLoadingRequest] = useState(true);
    const { getUser, user, userLoaded } = useUser();
    const [form] = Form.useForm();
    const [otpform] = Form.useForm();
    const [newform] = Form.useForm();
    const [otpModal, setOtpModal] = useState(false);
    const [newPass, setNewPass] = useState(false);
    const [email, setEmail] = useState('');
    const [forgetValues, setForgetValues] = useState({});
    const [forget, setForget] = useState(false);
    const [getEmail, setGetEmail] = useState('');

    const handleSubmit = async (values) => {
        setLoadingRequest(true);
        const { error, msg, data } = await postLogin(values);
        if (error) { message.error(msg); setLoadingRequest(false); }
        else {
            const redirectPath = getDashboardPath(data?.role);
            localStorage.setItem('token', data?.token);
            await getUser();
            message.success(msg);
            router.replace(redirectPath);
        }
    };

    const { time, start, pause, reset, status } = useTimer({ initialTime: 150, timerType: 'DECREMENTAL' });
    useEffect(() => { if (email) start(); if (time === 0) pause(); }, [time, start, pause, email]);
    useEffect(() => {
        if (!userLoaded) {
            return;
        }
        if (user?.role) {
            router.replace(getDashboardPath(user.role));
            return;
        }
        setLoadingRequest(false);
    }, [router, user, userLoaded]);

    if (!userLoaded || user?.role) {
        return (
            <div className='px-2 sm:px-8 md:px-0 lg:mt-[80px] mt-[40px] max-w-[1320px] mx-auto pb-20'>
                <div className='relative overflow-hidden rounded-2xl shadow-2xl shadow-black/15 min-h-[520px] bg-white flex items-center justify-center'>
                    <div className='h-10 w-10 rounded-full border-2 border-[#F97316]/20 border-t-[#F97316] animate-spin' />
                </div>
            </div>
        );
    }

    return (
        <div className='px-2 sm:px-8 md:px-0 lg:mt-[80px] mt-[40px] max-w-[1320px] mx-auto pb-20'>

            {/* --- Main Card --- */ }
            <div className='relative overflow-hidden rounded-2xl shadow-2xl shadow-black/15 flex flex-col md:flex-row min-h-[520px]'>

                {/* Left - Athlete Panel */}
                <div className='relative hidden md:flex md:w-[42%] flex-col items-center justify-end overflow-hidden bg-gradient-to-br from-[#C2410C] via-[#EA580C] to-[#F97316]'>
                    {/* Background pattern */}
                    <div className='absolute inset-0 opacity-[0.07]' style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                    {/* Glow */}
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
                            src='/signin.png'
                            alt='athlete'
                            width={320}
                            height={480}
                        />
                    </div>
                </div>

                {/* Right - Form Panel */}
                <div className='flex-1 bg-white flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12'>
                    {/* Header */}
                    <div className='mb-8'>
                        <div className='flex items-center gap-2 mb-3'>
                            <div className='w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center'>
                                <FiShield size={16} />
                            </div>
                            <span className='text-[11px] font-black text-[#F97316] uppercase tracking-widest'>Secure Login</span>
                        </div>
                        <h1 className='text-3xl font-extrabold text-gray-800 tracking-tight leading-tight'>
                            {i18n?.t('Sign In')}
                        </h1>
                        <p className='text-sm text-gray-400 font-medium mt-1.5'>
                            {i18n?.t("Welcome back! Enter your credentials to continue.")}
                        </p>
                    </div>

                    {/* Form */}
                    <Form className='space-y-5' onFinish={handleSubmit} form={form} layout='vertical'>
                        {/* Email */}
                        <Form.Item
                            label={<span className='text-[12px] font-bold text-gray-600 uppercase tracking-widest'>{i18n?.t('Email')}</span>}
                            name='email'
                            rules={[{ required: true, message: i18n?.t('Please input your email!') }, { type: 'email', message: i18n?.t('Please enter a valid email address') }]}
                        >
                            <div className='relative'>
                                <FiMail size={15} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                                <Input
                                    type='email'
                                    placeholder={i18n?.t('you@example.com')}
                                    className='pl-10 h-11 rounded-xl border-slate-200 text-[13px] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15'
                                />
                            </div>
                        </Form.Item>

                        {/* Password */}
                        <Form.Item
                            label={<span className='text-[12px] font-bold text-gray-600 uppercase tracking-widest'>{i18n?.t('Password')}</span>}
                            name='password'
                            rules={[{ required: true, message: i18n?.t('Please input your password!') }]}
                        >
                            <div className='relative'>
                                <FiLock size={15} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10' />
                                <Input.Password
                                    placeholder={i18n?.t('••••••••')}
                                    className='pl-10 h-11 rounded-xl border-slate-200 text-[13px] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15'
                                />
                            </div>
                        </Form.Item>

                        {/* Forgot password */}
                        <div className='flex justify-end -mt-2'>
                            <button type='button' onClick={() => setForget(true)} className='text-[12px] font-semibold text-[#F97316] hover:underline'>
                                {i18n?.t('Forgot Password?')}
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type='submit'
                            className='w-full flex items-center justify-center gap-2 rounded-xl bg-[#F97316] py-3 text-sm font-bold text-white shadow-lg shadow-[#F97316]/30 hover:bg-[#EA580C] hover:shadow-xl hover:shadow-[#F97316]/40 transition-all hover:-translate-y-0.5 mt-4'
                        >
                            {loadingRequest ? (
                                <span className='h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin' />
                            ) : (
                                <>{i18n?.t('Sign In')} <FiArrowRight size={15} /></>
                            )}
                        </button>
                    </Form>

                    {/* Footer */}
                    <p className='mt-6 text-center text-[13px] text-gray-400 font-medium'>
                        {i18n?.t("Don't have an account?")}{' '}
                        <Link href='/signup' className='text-[#F97316] font-bold hover:underline'>{i18n?.t('Sign Up')}</Link>
                    </p>
                </div>
            </div>

            {/* --- Forget Password Modal --- */}
            <Modal open={forget} maskClosable={false} footer={null} onCancel={() => setForget(false)}
                className='!w-[460px]'
                styles={{ content: { borderRadius: '16px', padding: '32px' } }}
                title={
                    <div className='flex items-center gap-3 pb-3 border-b border-slate-100'>
                        <div className='w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center shrink-0'>
                            <FiMail size={15} />
                        </div>
                        <div>
                            <p className='text-sm font-extrabold text-gray-800'>{i18n?.t('Forgot Password?')}</p>
                            <p className='text-[11px] text-gray-400 font-medium'>Enter your email to receive a reset code</p>
                        </div>
                    </div>
                }
            >
                <Form form={form} layout='vertical' className='mt-4'
                    onFinish={async (values) => {
                        if (values?.email) {
                            setEmail(values?.email);
                            const { error, msg } = await sendOtp({ email: values?.email, action: 'forgot_password' });
                            if (error) { message.error(msg); }
                            else { setOtpModal(true); message.success(`OTP sent to ${values?.email}`); setForgetValues(values); setGetEmail(values?.email); setForget(false); }
                        }
                    }}
                >
                    <FormInput name='email' label={i18n?.t('Email Address')}
                        rules={[{ required: true, message: i18n?.t('Please input your email!') }, { type: 'email', message: i18n?.t('Please enter a valid email address') }]}
                        placeholder={i18n?.t('you@example.com')} className='!py-2' />
                    <button className='mt-4 w-full bg-[#F97316] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#EA580C] transition-colors shadow-lg shadow-[#F97316]/25'>
                        {i18n?.t('Send Reset Code')}
                    </button>
                </Form>
            </Modal>

            {/* --- OTP Modal --- */}
            <Modal open={otpModal} maskClosable={false} footer={null} onCancel={() => setOtpModal(false)}
                className='!w-[460px]'
                styles={{ content: { borderRadius: '16px', padding: '32px' } }}
                title={
                    <div className='flex items-center gap-3 pb-3 border-b border-slate-100'>
                        <div className='w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0'>
                            <FiShield size={15} />
                        </div>
                        <div>
                            <p className='text-sm font-extrabold text-gray-800'>{i18n?.t('Verify Code')}</p>
                            <p className='text-[11px] text-gray-400 font-medium'>Code sent to <span className='text-[#F97316] font-bold'>{getEmail}</span></p>
                        </div>
                    </div>
                }
            >
                <Form form={otpform} className='mt-6 flex flex-col items-center'
                    onFinish={async (values) => {
                        if (values?.otp) {
                            const { error, msg, data } = await postVerifyOtp({ ...forgetValues, otp: values?.otp, action: 'forgot_password', email: forgetValues?.email });
                            if (error) { message.error(msg); }
                            else { message.success(msg); localStorage.setItem('token', data.token); setOtpModal(false); setNewPass(true); otpform.resetFields(); }
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
                            ? <button type='button' className='text-[#F97316] font-bold' onClick={async () => { const { error, msg } = await sendOtp({ email, action: 'forgot_password' }); if (error) message.error(msg); else { message.success(msg); reset(); start(); } }}>{i18n?.t('Resend')}</button>
                            : <span className='text-[#F97316] font-bold'>{i18n?.t('resend in')} {time}s</span>
                        }
                    </p>
                    <button className='w-full bg-[#F97316] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#EA580C] transition-colors shadow-lg shadow-[#F97316]/25'>
                        {i18n?.t('Verify Code')}
                    </button>
                </Form>
            </Modal>

            {/* --- Reset Password Modal --- */}
            <Modal open={newPass} maskClosable={false} footer={null} onCancel={() => setNewPass(false)}
                className='!w-[460px]'
                styles={{ content: { borderRadius: '16px', padding: '32px' } }}
                title={
                    <div className='flex items-center gap-3 pb-3 border-b border-slate-100'>
                        <div className='w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0'>
                            <FiLock size={15} />
                        </div>
                        <div>
                            <p className='text-sm font-extrabold text-gray-800'>{i18n?.t('Reset Password')}</p>
                            <p className='text-[11px] text-gray-400 font-medium'>Choose a strong new password</p>
                        </div>
                    </div>
                }
            >
                <Form form={newform} layout='vertical' className='mt-4'
                    onFinish={async (values) => {
                        const { error, msg } = await postResetPassword({ ...values, token: localStorage.getItem('token') });
                        if (error) { message.error(msg); }
                        else { message.success(msg); router.push('/signin'); setNewPass(false); newform.resetFields(); }
                    }}
                >
                    <Form.Item name='password' label={<span className='text-[12px] font-bold text-gray-600 uppercase tracking-widest'>{i18n?.t('New Password')}</span>}
                        rules={[{ required: true, message: i18n?.t('Please input your password!') }]} hasFeedback>
                        <Input.Password placeholder={i18n?.t('Enter new password')} className='h-11 rounded-xl border-slate-200 text-[13px]' />
                    </Form.Item>
                    <Form.Item name='confirm_password' label={<span className='text-[12px] font-bold text-gray-600 uppercase tracking-widest'>{i18n?.t('Confirm Password')}</span>}
                        dependencies={['password']} hasFeedback
                        rules={[{ required: true, message: i18n?.t('Please confirm your password!') },
                            ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error(i18n?.t('Passwords do not match!'))); } })
                        ]}>
                        <Input.Password placeholder={i18n?.t('Confirm password')} className='h-11 rounded-xl border-slate-200 text-[13px]' />
                    </Form.Item>
                    <button className='mt-2 w-full bg-[#F97316] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#EA580C] transition-colors shadow-lg shadow-[#F97316]/25'>
                        {i18n?.t('Reset Password')}
                    </button>
                </Form>
            </Modal>
        </div>
    );
};

export default SignIn;

