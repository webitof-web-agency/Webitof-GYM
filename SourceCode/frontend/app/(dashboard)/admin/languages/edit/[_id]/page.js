"use client";
import { Form } from 'antd';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

import PageTitle from '../../../../components/common/page-title';
import { useFetch } from '../../../../../helpers/hooks';
import { fetchLanguage } from '../../../../../helpers/backend';
import LanguageForm from '../../add/languageForm';

const EditLanguages = ({ params }) => {
    const [form] = Form.useForm();
    const { push } = useRouter();
    const [data, getData] = useFetch(fetchLanguage, {}, false);

    useEffect(() => {
        if (params?._id) {
            getData({ _id: params?._id });
        }
    }, [params]);

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                ...data,
                rtl: data?.rtl ? true : false,
            });
        }
    }, [data]);

    return (
        <div className="max-w-[800px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-start gap-4">
                    <button 
                        type="button"
                        onClick={() => push('/admin/languages')} 
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-gray-500 hover:bg-slate-50 hover:text-gray-800 transition-colors shadow-sm shrink-0 mt-0.5"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <div className="flex flex-col">
                        <PageTitle title={`Edit Dialect: ${data?.name || '...'}`} className="!mb-0 !pb-0" />
                        <span className="text-[11px] text-gray-500 font-medium">Reconfigure origin mapping codes and layout flow modes</span>
                    </div>
                </div>
            </div>
            
            <LanguageForm isEdit={true} form={form} />
        </div>
    );
};

export default EditLanguages;