"use client";
import { Checkbox, Form, message } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '../../../components/common/page-title';
import { useI18n } from '../../../../providers/i18n';
import { postPaymentMethod } from '../../../../helpers/backend';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import FormSelect from '../../../../../components/form/select';
import Button from '../../../../../components/common/button';
import { FiArrowLeft, FiCreditCard, FiLock, FiGlobe, FiDatabase, FiSave } from 'react-icons/fi';

const AddPaymentMethods = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    const [selectedMethod, setSelectedMethod] = useState('');
    const { push } = useRouter();

    return (
        <div className="max-w-[800px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-start gap-4">
                    <button 
                        type="button"
                        onClick={() => push('/admin/payment-method')} 
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-gray-500 hover:bg-slate-50 hover:text-gray-800 transition-colors shadow-sm shrink-0 mt-0.5"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <div className="flex flex-col">
                        <PageTitle title="Configure Payment Intercept" className="!mb-0 !pb-0" />
                        <span className="text-[11px] text-gray-500 font-medium">Map secure payment processors into the billing engine</span>
                    </div>
                </div>
            </div>

            <PaymentMethodForm
                title={i18n?.t('Add Method')}
                form={form}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                isEdit={false}
            />
        </div>
    );
};

export default AddPaymentMethods;


export const PaymentMethodForm = ({ title, form, selectedMethod, setSelectedMethod, isEdit = false }) => {
    const { push } = useRouter()
    const i18n = useI18n()
    const [loader, setLoader] = useState(false);

    const handleFinish = async (values) => {
        setLoader(true);
        try {
            const config = values.config;
            const payload = { ...values, config: config }
            const res = await postPaymentMethod(payload)
            if (res?.error === false) {
                message.success(res?.msg)
                push('/admin/payment-method')
            } else {
                message.error(res?.msg)
            }
        } finally {
            setLoader(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                      <FiLock size={16} />
                 </div>
                 <div>
                      <h3 className="text-base font-bold text-gray-800 leading-tight">API Handshake Values</h3>
                      <p className="text-[11px] text-gray-500 font-medium">Verify your payment terminal secrets accurately</p>
                 </div>
            </div>
            
            <Form form={form} layout="vertical" onFinish={handleFinish} className="p-6">
                {isEdit && <HiddenInput name="_id" />}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="col-span-1">
                        <FormInput 
                           placeholder={("Backend mapping reference...")} 
                           name="name" 
                           label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiCreditCard size={12}/> Gateway Reference</span>} 
                           required 
                        />
                    </div>
                    <div className="col-span-1">
                        <FormSelect 
                           placeholder={("Select core integration")} 
                           name="type" 
                           label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiDatabase size={12}/> API Platform</span>}
                           onChange={(e) => setSelectedMethod(e)}
                           options={[
                               { value: 'paypal', label: i18n?.t('Paypal REST') },
                               { value: 'stripe', label: i18n?.t('Stripe Elements') },
                               { value: 'razorpay', label: i18n?.t('Razorpay') },
                               { value: 'sslcommerz', label: i18n?.t('SSLCommerz') },
                               { value: 'mollie', label: i18n?.t('Mollie Processor') },
                           ]}
                           allowClear
                        />
                    </div>

                    {selectedMethod && (
                        <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-slate-100">
                             <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-4"><FiGlobe size={12}/> Secure Auth Config</h4>
                             
                             <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedMethod === 'paypal' && (
                                    <>
                                        <div className="col-span-1 md:col-span-2"><FormInput required name={['config', 'clientId']} label={<span className="text-[11px] font-bold text-gray-600">Client UUID</span>} placeholder={''} /></div>
                                        <div className="col-span-1 md:col-span-2"><FormInput required name={['config', 'clientSecret']} label={<span className="text-[11px] font-bold text-gray-600">Private Secret Hash</span>} placeholder={''} type="password" /></div>
                                        <div className="col-span-1"><FormSelect required name={['config', 'mode']} label={<span className="text-[11px] font-bold text-gray-600">Network Mode</span>} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} /></div>
                                    </>
                                )}
                                {selectedMethod === 'stripe' && (
                                    <>
                                        <div className="col-span-1 md:col-span-2"><FormInput required name={['config', 'clientId']} label={<span className="text-[11px] font-bold text-gray-600">Publishable / Secret Key</span>} placeholder={''} type="password" /></div>
                                        <div className="col-span-1 md:col-span-2"><FormInput required name={['config', 'clientSecret']} label={<span className="text-[11px] font-bold text-gray-600">Webhook Endpoint Signature</span>} placeholder={''} type="password" /></div>
                                        <div className="col-span-1"><FormSelect required name={['config', 'mode']} label={<span className="text-[11px] font-bold text-gray-600">Network Mode</span>} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} /></div>
                                    </>
                                )}
                                {selectedMethod === 'razorpay' && (
                                    <>
                                        <div className="col-span-1 md:col-span-2"><FormInput required name={['config', 'clientId']} label={<span className="text-[11px] font-bold text-gray-600">Razorpay Key ID</span>} placeholder={''} /></div>
                                        <div className="col-span-1 md:col-span-2"><FormInput required name={['config', 'clientSecret']} label={<span className="text-[11px] font-bold text-gray-600">Razorpay Auth Secret</span>} placeholder={''} type="password" /></div>
                                        <div className="col-span-1"><FormSelect required name={['config', 'mode']} label={<span className="text-[11px] font-bold text-gray-600">Network Mode</span>} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} /></div>
                                    </>
                                )}
                                {selectedMethod === 'sslcommerz' && (
                                    <>
                                        <div className="col-span-1"><FormInput required name={['config', 'clientId']} label={<span className="text-[11px] font-bold text-gray-600">Store API ID</span>} placeholder={''} /></div>
                                        <div className="col-span-1"><FormInput required name={['config', 'clientSecret']} label={<span className="text-[11px] font-bold text-gray-600">Store Auth Password</span>} placeholder={''} type="password" /></div>
                                        <div className="col-span-1"><FormSelect required name={['config', 'mode']} label={<span className="text-[11px] font-bold text-gray-600">Network Mode</span>} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} /></div>
                                        <div className="col-span-1 flex items-center pt-5">
                                            <Form.Item name={['config', 'is_live']} valuePropName="checked" initialValue={false} className="mb-0">
                                                <Checkbox className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Bind Live SSL Status</Checkbox>
                                            </Form.Item>
                                        </div>
                                    </>
                                )}
                                {selectedMethod === 'mollie' && (
                                    <>
                                        <div className="col-span-1 md:col-span-2"><FormInput required name={['config', 'clientId']} label={<span className="text-[11px] font-bold text-gray-600">Mollie API Integration Key</span>} placeholder={''} type="password" /></div>
                                        <div className="col-span-1"><FormSelect required name={['config', 'mode']} label={<span className="text-[11px] font-bold text-gray-600">Network Mode</span>} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} /></div>
                                    </>
                                )}
                             </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
                     <Button type='button' onClick={() => push('/admin/payment-method')} className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !px-6 !py-2 !font-semibold !rounded-lg !text-xs mr-2 transition-all">Cancel</Button>
                     <Button type='submit' loading={loader} className="!px-6 !py-2 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg !text-xs transition-all tracking-wide">
                         <FiSave size={14}/> {isEdit ? i18n?.t('Patch Gateway Configuration') : i18n?.t('Mount Payment Gateway')}
                     </Button>
                </div>
            </Form>
        </div>
    )
}

