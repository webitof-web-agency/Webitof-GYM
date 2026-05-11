"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CheckOutCard from '../../../../components/shop/chackoutCard';
import { Form, message, Radio } from 'antd';
import BasicBar from '../../../../components/common/basic-bar';
import FormInput from '../../../../components/form/input';
import { useFetch } from '../../../helpers/hooks';
import { applyCoupon, fetchCartlist, fetchUserPaymentMethods, postOrder } from '../../../helpers/backend';
import { useCurrency } from '../../../contexts/site';
import { useI18n } from '../../../providers/i18n';
import { swalConfirm, swalAlert } from '../../../helpers/swal';
import { useRouter } from 'next/navigation';
import PhoneNumberInput from '../../../../components/form/phoneNumberInput';
import { FiArrowRight, FiCheckCircle, FiCreditCard, FiMapPin, FiPackage, FiShoppingBag, FiTag, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Page = () => {
    const [data, getData] = useFetch(fetchCartlist);
    const [payMethods] = useFetch(fetchUserPaymentMethods);
    const router = useRouter();
    const { currencySymbol, convertAmount, currency } = useCurrency();
    const { langCode } = useI18n();
    const [subtotal, setSubtotal] = useState(0);
    const [savedMoney, setSavedMoney] = useState(0);
    const [coupon, setCoupon] = useState('');
    const [couponStatus, setCouponStatus] = useState(false);
    const [placing, setPlacing] = useState(false);
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const i18n = useI18n();
    const [value, setValue] = useState(undefined);
    const [form] = Form.useForm();

    useEffect(() => {
        const total = data?.products?.reduce((acc, item) => acc + item?.price * item?.quantity, 0) || 0;
        setSubtotal(total);
    }, [data]);

    const productList = data?.products?.map(item => ({
        productId: item?._id,
        quantity: item?.quantity,
        variantId: item?.variant?._id,
    }));

    const handlePlaceOrder = async (values) => {
        const result = await swalConfirm({
            icon: 'question',
            title: i18n?.t('Confirm Order'),
            text: i18n?.t('Do you want to proceed with checkout?'),
            confirmText: i18n?.t('Yes, Place Order'),
            cancelText: i18n?.t('Cancel'),
        });
        if (result.isConfirmed) {
            if (!value) {
                await swalAlert({ icon: 'warning', title: i18n?.t('Select Payment'), text: i18n?.t('Please select a payment method to proceed.') });
                return;
            }
            setPlacing(true);
            const payload = {
                ...values, currency, langCode, method: value,
                subtotal: parseFloat(convertAmount(subtotal)),
                items: productList,
                discount_coupon: coupon || null,
            };
            const { data: resData, error, msg } = await postOrder(payload);
            setPlacing(false);
            if (error) {
                await swalAlert({ icon: 'error', title: i18n?.t('Order Failed'), text: msg || i18n?.t('Something went wrong. Please try again.') });
            } else {
                router.push(resData);
            }
        }
    };

    const applyCouponHandler = async () => {
        if (couponStatus) return message.warning(i18n?.t('Coupon already applied'));
        if (!coupon.trim()) return message.warning(i18n?.t('Please enter a coupon code'));
        setApplyingCoupon(true);
        const { data: res, error, msg } = await applyCoupon({ code: coupon, sub_total: subtotal });
        setApplyingCoupon(false);
        if (error) {
            message.error(msg || i18n?.t('Invalid coupon code'));
        } else {
            setSavedMoney(res?.saved_money);
            setSubtotal(res?.current_subtotal);
            setCouponStatus(true);
            message.success(i18n?.t('Coupon applied successfully!'));
        }
    };

    const inputClass = 'h-11 rounded-xl border-slate-200 text-[13px] font-medium focus:border-[#F97316]';

    return (
        <section>
            <BasicBar heading={i18n?.t('Checkout')} subHeading={i18n?.t('Checkout')} />

            <div className='container py-16 lg:py-24'>
                {data?.products?.length > 0 ? (
                    <Form form={form} onFinish={handlePlaceOrder}>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12'>

                            {/* â”€â”€ LEFT: Shipping + Payment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                            <div className='lg:col-span-2 space-y-6'>

                                {/* Shipping details card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className='rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] overflow-hidden'
                                >
                                    {/* Card header */}
                                    <div className='flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50'>
                                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]/10 border border-[#F97316]/20'>
                                            <FiMapPin size={14} className='text-[#F97316]' />
                                        </div>
                                        <div>
                                            <p className='text-[13px] font-extrabold text-gray-800'>{i18n?.t('Shipping Details')}</p>
                                            <p className='text-[11px] text-gray-400 font-medium'>{i18n?.t('Where should we deliver your order?')}</p>
                                        </div>
                                    </div>

                                    <div className='p-6 space-y-4'>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <Form.Item name='name' label={<span className='text-[11px] font-black text-gray-500 uppercase tracking-widest'>{i18n?.t('Full Name')}</span>} rules={[{ required: true, message: i18n?.t('Please provide your Full Name') }]} className='mb-0'>
                                                <FormInput name='name' type='text' placeholder={i18n?.t('Enter Your Full Name')} className={`${inputClass} w-full`} noStyle />
                                            </Form.Item>
                                            <Form.Item name='email' label={<span className='text-[11px] font-black text-gray-500 uppercase tracking-widest'>{i18n?.t('Email')}</span>} rules={[{ required: true, message: i18n?.t('Please provide your Email') }, { type: 'email' }]} className='mb-0'>
                                                <FormInput name='email' type='email' isEmail placeholder={i18n?.t('Enter Your Email')} className={`${inputClass} w-full`} noStyle />
                                            </Form.Item>
                                        </div>

                                        <PhoneNumberInput
                                            label='Phone Number'
                                            name='phone'
                                            rules={[{ required: true, message: i18n?.t('Please provide your Phone Number') }]}
                                            className={`${inputClass} w-full`}
                                        />

                                        <FormInput
                                            label='Location'
                                            name='location'
                                            type='text'
                                            placeholder={i18n?.t('Street Address / Area')}
                                            rules={[{ required: true, message: i18n?.t('Please provide your Location') }]}
                                            className={`${inputClass} w-full`}
                                        />

                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <FormInput
                                                label='Town/City'
                                                name='city'
                                                type='text'
                                                placeholder={i18n?.t('Town / City')}
                                                rules={[{ required: true, message: i18n?.t('Please provide your Town/City') }]}
                                                className={`${inputClass} w-full`}
                                            />
                                            <FormInput
                                                label='Zip Code'
                                                name='zip_code'
                                                type='number'
                                                placeholder={i18n?.t('Zip / Postal Code')}
                                                rules={[{ required: true, message: i18n?.t('Please provide your Zip Code') }]}
                                                className={`${inputClass} w-full`}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Payment method card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className='rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] overflow-hidden'
                                >
                                    <div className='flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50'>
                                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]/10 border border-[#F97316]/20'>
                                            <FiCreditCard size={14} className='text-[#F97316]' />
                                        </div>
                                        <div>
                                            <p className='text-[13px] font-extrabold text-gray-800'>{i18n?.t('Payment Method')}</p>
                                            <p className='text-[11px] text-gray-400 font-medium'>{i18n?.t('Choose how you want to pay')}</p>
                                        </div>
                                    </div>

                                    <div className='p-4'>
                                        <Radio.Group
                                            onChange={e => setValue(e.target.value)}
                                            value={value}
                                            className='w-full space-y-2'
                                        >
                                            {payMethods?.docs?.map(method => (
                                                <label
                                                    key={method?._id}
                                                    className={`flex items-center gap-3 w-full rounded-xl border-2 px-4 py-3.5 cursor-pointer transition-all duration-200 ${value === method?.type ? 'border-[#F97316] bg-[#F97316]/5' : 'border-slate-100 hover:border-slate-200'}`}
                                                    onClick={() => setValue(method?.type)}
                                                >
                                                    <Radio value={method?.type} className='opacity-0 w-0 h-0 absolute' />
                                                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${value === method?.type ? 'border-[#F97316] bg-[#F97316]' : 'border-slate-300'}`}>
                                                        {value === method?.type && <div className='h-1.5 w-1.5 rounded-full bg-white' />}
                                                    </div>
                                                    <span className={`text-[13px] font-bold transition-colors ${value === method?.type ? 'text-[#F97316]' : 'text-gray-700'}`}>
                                                        {method?.name}
                                                    </span>
                                                    {value === method?.type && (
                                                        <FiCheckCircle size={14} className='text-[#F97316] ml-auto' />
                                                    )}
                                                </label>
                                            ))}
                                        </Radio.Group>
                                    </div>
                                </motion.div>
                            </div>

                            {/* â”€â”€ RIGHT: Order Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                            <div className='lg:col-span-1'>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.15 }}
                                    className='rounded-2xl border border-slate-100 bg-white shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] overflow-hidden sticky top-24'
                                >
                                    {/* Header */}
                                    <div className='bg-gradient-to-r from-[#EA580C] to-[#F97316] px-6 py-5'>
                                        <div className='flex items-center gap-2'>
                                            <FiPackage size={16} className='text-white/80' />
                                            <p className='text-[11px] font-black text-white/60 uppercase tracking-widest'>{data?.products?.length} {i18n?.t('items')}</p>
                                        </div>
                                        <h3 className='text-lg font-extrabold text-white mt-0.5'>{i18n?.t('Order Summary')}</h3>
                                    </div>

                                    {/* Product list */}
                                    <div className='px-5 pt-4 pb-2 max-h-[280px] overflow-y-auto divide-y divide-slate-50'>
                                        {data?.products?.map((product, index) => (
                                            <CheckOutCard key={index} {...product} currencySymbol={currencySymbol} convertAmount={convertAmount} />
                                        ))}
                                    </div>

                                    {/* Coupon */}
                                    <div className='px-5 pb-4'>
                                        <p className='text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2'>{i18n?.t('Coupon Code')}</p>
                                        <div className='flex gap-2'>
                                            <div className='relative flex-1'>
                                                <FiTag size={13} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none' />
                                                <input
                                                    type='text'
                                                    placeholder={i18n?.t('Enter coupon code')}
                                                    value={coupon}
                                                    onChange={e => setCoupon(e.target.value)}
                                                    disabled={couponStatus}
                                                    className='w-full pl-9 pr-3 h-10 rounded-xl border border-slate-200 text-[12px] font-medium focus:outline-none focus:border-[#F97316] disabled:bg-slate-50 disabled:text-gray-400'
                                                />
                                            </div>
                                            <button
                                                type='button'
                                                onClick={applyCouponHandler}
                                                disabled={couponStatus || applyingCoupon}
                                                className={`px-4 h-10 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all ${couponStatus ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' : 'bg-[#F97316] text-white hover:bg-[#EA580C] disabled:opacity-60'}`}
                                            >
                                                {couponStatus ? `✓ ${i18n?.t('Applied')}` : applyingCoupon ? '...' : i18n?.t('Apply')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Totals */}
                                    <div className='border-t border-slate-100 px-5 py-4 space-y-3'>
                                        <div className='flex justify-between'>
                                            <span className='text-[13px] text-gray-500 font-medium'>{i18n?.t('Subtotal')}</span>
                                            <span className='text-[13px] font-bold text-gray-800'>{currencySymbol}{convertAmount(subtotal + savedMoney)}</span>
                                        </div>
                                        {savedMoney > 0 && (
                                            <div className='flex justify-between'>
                                                <span className='text-[13px] text-emerald-600 font-medium'>{i18n?.t('Coupon Discount')}</span>
                                                <span className='text-[13px] font-bold text-emerald-600'>-{currencySymbol}{convertAmount(savedMoney)}</span>
                                            </div>
                                        )}
                                        <div className='flex justify-between'>
                                            <span className='text-[13px] text-gray-500 font-medium'>{i18n?.t('Shipping')}</span>
                                            <span className='text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full'>{i18n?.t('At checkout')}</span>
                                        </div>
                                        <div className='h-px bg-slate-100' />
                                        <div className='flex justify-between items-center'>
                                            <span className='text-[14px] font-extrabold text-gray-800'>{i18n?.t('Total')}</span>
                                            <span className='text-xl font-black text-[#F97316]'>{currencySymbol}{convertAmount(subtotal)}</span>
                                        </div>
                                    </div>

                                    {/* Place Order CTA */}
                                    <div className='px-5 pb-6'>
                                        <button
                                            type='submit'
                                            disabled={placing}
                                            className='w-full flex items-center justify-center gap-2 rounded-xl bg-[#F97316] py-3.5 text-[13px] font-bold text-white shadow-lg shadow-[#F97316]/25 hover:bg-[#EA580C] hover:-translate-y-0.5 transition-all disabled:opacity-60'
                                        >
                                            {placing
                                                ? <span className='h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin' />
                                                : <><FiCheckCircle size={15} /> {i18n?.t('Place Order')}</>
                                            }
                                        </button>
                                        <p className='text-[10px] text-gray-400 font-medium text-center mt-3'>
                                            🔒 {i18n?.t('Secure & encrypted checkout')}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </Form>
                ) : (
                    <div className='flex flex-col items-center justify-center min-h-[50vh] rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_-6px_rgba(0,0,0,0.06)]'>
                        <div className='flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F97316]/8 border border-[#F97316]/15 mb-6'>
                            <FiShoppingBag size={36} className='text-[#F97316]/50' />
                        </div>
                        <h3 className='text-xl font-extrabold text-gray-800 mb-2'>{i18n?.t('No items in cart')}</h3>
                        <p className='text-[13px] text-gray-400 font-medium mb-6'>{i18n?.t('Add some products before checking out.')}</p>
                        <Link href='/shop' className='inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-6 py-3 text-[13px] font-bold text-white shadow-lg shadow-[#F97316]/25 hover:bg-[#EA580C] transition-all'>
                            <FiShoppingBag size={14} /> {i18n?.t('Browse Shop')} <FiArrowRight size={13} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Page;

