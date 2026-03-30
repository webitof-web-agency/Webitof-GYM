"use client";
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { useFetch } from '../../../../../helpers/hooks';
import { fetchPaymentMethod } from '../../../../../helpers/backend';
import PageTitle from '../../../../components/common/page-title';
import { PaymentMethodForm } from '../../add/page';
import { useI18n } from '../../../../../providers/i18n';

const EditPaymentMethod = ({ params }) => {
    const [form] = Form.useForm()
    const i18n = useI18n();
    const { push } = useRouter();
    const [data, getData] = useFetch(fetchPaymentMethod, {}, false);
    const [selectedMethod, setSelectedMethod] = useState('');

    useEffect(() => {
        if (params?._id) getData({ _id: params._id });
    }, [params?._id]);

    useEffect(() => {
        if (!data) return;
        form.setFieldsValue({ ...data });
        setSelectedMethod(data?.type || '');
    }, [data]);

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
                        <PageTitle title="Reconfigure Payment Endpoint" className="!mb-0 !pb-0" />
                        <span className="text-[11px] text-gray-500 font-medium">Map secure payment processors into the billing engine</span>
                    </div>
                </div>
            </div>

            <PaymentMethodForm
                title={i18n?.t('Edit Method')}
                form={form}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                isEdit={true}
            />
        </div>
    );
};

export default EditPaymentMethod;
