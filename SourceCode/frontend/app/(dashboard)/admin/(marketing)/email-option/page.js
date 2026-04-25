'use client';
import React, { useState } from 'react';
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import { MdEmail, MdScheduleSend } from 'react-icons/md';
import { SiMinutemailer } from "react-icons/si";
import { RiMailCloseFill } from "react-icons/ri";
import { TbClockHour4, TbMailCheck } from "react-icons/tb";
import AllEmail from './(pages)/all-email';
import SendEmail from './(pages)/send-email';
import ScheduleEmail from './(pages)/schedule-email';
import PendingEmail from './(pages)/pending-email';
import DeliveredEmail from './(pages)/delivered-email';
import FailedEmail from './(pages)/failed-email.js';

const Content = () => {
    const i18n = useI18n()
    const [tab, setTab] = useState(0);

    const methods = [
        {
            label: "Send Email",
            icon: <SiMinutemailer size={18} />,
            form: <SendEmail/>
        },
        {
            label: "All Email",
            icon: <MdEmail size={18} />,
            form: <AllEmail/>
        },
        {
            label: "Scheduled Email",
            icon: <MdScheduleSend size={18} />,
            form: <ScheduleEmail/>
        },
        {
            label: "Pending Email",
            icon: <TbClockHour4 size={18} />,
            form: <PendingEmail/>
        },
        {
            label: "Delivered Email",
            icon: <TbMailCheck size={18} />,
            form: <DeliveredEmail/>
        },
        {
            label: "Failed Email",
            icon: <RiMailCloseFill size={18} />,
            form: <FailedEmail/>
        }
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative">
            <div className="mb-2">
                <PageTitle title="Email Campaigns & Tracking" />
            </div>
            <div className="flex flex-col lg:flex-row gap-5 w-full">
                <div className="lg:w-[280px] flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100/80 p-2.5 flex flex-col gap-1 sticky top-4">
                        {methods.map((method, index) => {
                            const isActive = tab === index;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setTab(index)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 w-full text-left ${
                                        isActive
                                            ? "bg-[#F97316] text-white shadow-md shadow-[#F97316]/20"
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
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100/80 min-h-[500px]">
                        {methods[tab].form}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;

