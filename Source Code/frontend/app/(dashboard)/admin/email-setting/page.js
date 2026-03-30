"use client"
import React, { useState } from 'react';
import PageTitle from '../../components/common/page-title';
import { fetchEmailSettings } from '../../../helpers/backend';
import SendGridManageEmail from './sendGridManageEmail';
import GmailEmailProvider from './gmail';
import OtherProviderManageEmail from './otherServices';
import { useFetch } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';
import { FiSend, FiMail, FiServer } from 'react-icons/fi';

const tabs = [
    { key: '1', label: 'SendGrid SMTP', icon: FiSend },
    { key: '2', label: 'Gmail Provider', icon: FiMail },
    { key: '3', label: 'Other Provider', icon: FiServer },
];

const EmailSettings = () => {
    const i18n = useI18n();
    const [settings, getSettings, { loading }] = useFetch(fetchEmailSettings);
    const [checkedValue, setCheckedValue] = useState(false);
    const [activeTab, setActiveTab] = useState('1');

    return (
        <div className="max-w-[900px] mx-auto space-y-4 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title="Email Settings" />
            </div>

            {/* Custom Tab Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
                {/* Tab Header */}
                <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 pt-4 gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-xs font-bold transition-all duration-200 border-b-2 -mb-[1px] ${
                                    isActive
                                        ? 'bg-white text-[#5572fc] border-[#5572fc] shadow-sm'
                                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-white/60'
                                }`}
                            >
                                <Icon size={13} />
                                {tab.label}
                                {settings?.default === (tab.key === '1' ? 'sendgrid' : tab.key === '2' ? 'gmail' : 'others') && (
                                    <span className="ml-1 text-[8px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                        DEFAULT
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === '1' && (
                        <SendGridManageEmail settings={settings} getSettings={getSettings} loading={loading} checkedValue={checkedValue} setCheckedValue={setCheckedValue} />
                    )}
                    {activeTab === '2' && (
                        <GmailEmailProvider settings={settings} getSettings={getSettings} loading={loading} checkedValue={checkedValue} setCheckedValue={setCheckedValue} />
                    )}
                    {activeTab === '3' && (
                        <OtherProviderManageEmail settings={settings} getSettings={getSettings} loading={loading} checkedValue={checkedValue} setCheckedValue={setCheckedValue} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailSettings;
