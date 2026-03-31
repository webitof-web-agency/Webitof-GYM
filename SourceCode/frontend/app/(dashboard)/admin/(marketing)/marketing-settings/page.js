"use client"
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import GmailEmailProvider from './gmail';
import SendGridMarketing from './sendGridManageEmail';
import { useFetch } from '../../../../helpers/hooks';
import { fetchMarketingSettings } from '../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import EmailTemplate from './emailTemplate';
import { FiSend, FiMail, FiLayout, FiSettings } from 'react-icons/fi';

const MarkettingSettings = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    const [settings, getSettings, { loading }] = useFetch(fetchMarketingSettings)
    const [checkedValue, setCheckedValue] = useState(false);
    const [activeTab, setActiveTab] = useState('sendgrid');
    const [activeRootTab, setActiveRootTab] = useState(0);

    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
        }
    }, [settings])

    const rootMethods = [
        {
            label: "Email Configuration",
            icon: <FiSettings size={18} />,
            form: (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100/80 overflow-hidden min-h-[500px]">
                    <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 pt-4 gap-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('sendgrid')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-xs font-bold transition-all duration-200 border-b-2 -mb-[1px] ${
                                activeTab === 'sendgrid'
                                    ? 'bg-white text-[#5572fc] border-[#5572fc] shadow-sm'
                                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-white/60'
                            }`}
                        >
                            <FiSend size={13} /> SendGrid
                            {settings?.email?.default === 'sendgrid' && (
                                <span className="ml-1 text-[8px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wide">DEFAULT</span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('gmail')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-xs font-bold transition-all duration-200 border-b-2 -mb-[1px] ${
                                activeTab === 'gmail'
                                    ? 'bg-white text-[#5572fc] border-[#5572fc] shadow-sm'
                                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-white/60'
                            }`}
                        >
                            <FiMail size={13} /> Gmail
                            {settings?.email?.default === 'gmail' && (
                                <span className="ml-1 text-[8px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wide">DEFAULT</span>
                            )}
                        </button>
                    </div>
                    <div className="p-6">
                        {activeTab === 'sendgrid' && (
                            <SendGridMarketing settings={settings} getSettings={getSettings} loading={loading} />
                        )}
                        {activeTab === 'gmail' && (
                            <GmailEmailProvider settings={settings} getSettings={getSettings} loading={loading} setCheckedValue={setCheckedValue} />
                        )}
                    </div>
                </div>
            )
        },
        {
            label: "Email Template",
            icon: <FiLayout size={18} />,
            form: <EmailTemplate settings={settings} getSettings={getSettings} loading={loading} />
        }
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative">
            <div className="mb-2">
                <PageTitle title={"Marketing Settings"} />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-5 w-full">
                <div className="lg:w-[280px] flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100/80 p-2.5 flex flex-col gap-1 sticky top-4">
                        {rootMethods.map((method, index) => {
                            const isActive = activeRootTab === index;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setActiveRootTab(index)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 w-full text-left ${
                                        isActive
                                            ? "bg-[#5572fc] text-white shadow-md shadow-[#5572fc]/20"
                                            : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                                    }`}
                                >
                                    <div className={`flex items-center justify-center ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                        {method.icon}
                                    </div>
                                    <span>{i18n.t(method.label)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    {rootMethods[activeRootTab].form}
                </div>
            </div>
        </div>
    )
}

export default MarkettingSettings;