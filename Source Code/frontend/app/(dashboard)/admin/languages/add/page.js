"use client";
import React from 'react';
import { Form } from 'antd';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import PageTitle from '../../../components/common/page-title';
import LanguageForm from './languageForm';

const AddLanguage = () => {
    const [form] = Form.useForm();
    const { push } = useRouter();

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
                        <PageTitle title="Register Language" className="!mb-0 !pb-0" />
                        <span className="text-[11px] text-gray-500 font-medium">Add a new fallback dialect to the local translation engine</span>
                    </div>
                </div>
            </div>
            
            <LanguageForm isEdit={false} form={form} />
        </div>
    );
};

export default AddLanguage;
