import { Form } from 'antd';
import React, { useEffect } from 'react';
import JodiEditor from '../../../components/form/jodiEditor';
import PageTitle from '../../../components/common/page-title';
import Button from '../../../../../components/common/button';
import { useAction, useFetch } from '../../../../helpers/hooks';
import { fetchMarketingSettings, postMarketingSettings } from '../../../../helpers/backend';
import { FiLayout, FiSave, FiEdit3 } from 'react-icons/fi';
import { Loader } from '../../../../../components/common/loader';

const EmailTemplate = ({ settings, getSettings, loading }) => {
    const [form] = Form.useForm();
    
    useEffect(() => {
        form.setFieldsValue({
            email_template1: settings?.email_template?.[0] || '',
            email_template2: settings?.email_template?.[1] || ''
        })
    }, [settings])

    if (loading) {
        return <div className='flex justify-center items-center h-[280px]'><Loader /></div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100/80 overflow-hidden min-h-[500px]">
             <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FiLayout className="text-[#F97316]" /> Marketing Email Templates
                </h2>
                <p className="text-xs text-gray-500 mt-1">Configure your default rich-text email wrapper layouts for use in marketing campaigns.</p>
            </div>
            
            <div className='p-6'>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        let email_template = [values?.email_template1, values?.email_template2]
                        return useAction(postMarketingSettings, {
                            ...settings,
                            email_template: email_template
                        }, () => {
                            getSettings();
                        })
                    }}
                >
                    <div className="flex flex-col gap-6 mb-6">
                        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                                    <span className="text-xs font-bold">1</span>
                                </div>
                                <span className="text-sm font-bold text-gray-700">Template Slot 1</span>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <JodiEditor placeholder={"Build your first template..."} name={'email_template1'} required />
                            </div>
                        </div>

                        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded bg-purple-50 text-purple-500 border border-purple-100/50 flex items-center justify-center">
                                    <span className="text-xs font-bold">2</span>
                                </div>
                                <span className="text-sm font-bold text-gray-700">Template Slot 2</span>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <JodiEditor placeholder={"Build your second template..."} name={'email_template2'} required />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-5 border-t border-slate-100">
                        <Button 
                            className="flex items-center gap-1.5 !px-8 !py-2.5 shadow-lg shadow-[#F97316]/20 hover:shadow-[#F97316]/40 transition-all !rounded-xl text-sm font-bold" 
                            htmlType="submit"
                        >
                            <FiSave size={15} /> Save Templates
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default EmailTemplate;
