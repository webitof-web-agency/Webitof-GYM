'use client';
import React, { useState } from 'react';
import { AiOutlineContacts } from "react-icons/ai";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { GoCodeOfConduct } from "react-icons/go";
import { LiaBorderStyleSolid } from "react-icons/lia";
import { IoHomeOutline, IoBusinessOutline } from "react-icons/io5";
import PrivacyPage from './(pages)/privacy/page';
import AboutPage from './(pages)/about/page';
import ContactPage from './(pages)/contact/page';
import TermsPage from './(pages)/terms/page';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import HomePageSetting from './(pages)/home/page';
import CompanyDetails from './(pages)/company/page';
import ThemeSetting from './(pages)/theme-settings/page';
import { FaAffiliatetheme } from "react-icons/fa";
import { FiLayout, FiLayers, FiFileText } from "react-icons/fi";

const Content = () => {
    const i18n = useI18n()
    const [tab, setTab] = useState(0);

    const methods = [
        {
            label: ("Theme Config"),
            icon: <FaAffiliatetheme size={16} />,
            form: <ThemeSetting slug={'theme_setting'} />,
            desc: "Global color & brand identity"
        },
        {
            label: ("Landing Page"),
            icon: <FiLayout size={16} />,
            form: <HomePageSetting slug={'home'} />,
            desc: "Hero intro & metrics"
        },
        {
            label: ("About Vision"),
            icon: <FiLayers size={16} />,
            form: <AboutPage slug={'about'} />,
            desc: "Mission & company story"
        },
        {
            label: ("Business Details"),
            icon: <IoBusinessOutline size={16} />,
            form: <CompanyDetails slug={'company_details'} />,
            desc: "Location & structural maps"
        },
        {
            label: ("Support Contacts"),
            icon: <AiOutlineContacts size={16} />,
            form: <ContactPage slug={'contact_us'} />,
            desc: "Helpdesk & routing"
        },
        {
            label: ("Privacy Notice"),
            icon: <MdOutlinePrivacyTip size={16} />,
            form: <PrivacyPage slug={'privacy_policy'} />,
            desc: "Data governance"
        },
        {
            label: ("Terms of Service"),
            icon: <FiFileText size={16} />,
            form: <TermsPage slug={'terms_&_condition'} />,
            desc: "Legal usage rules"
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0 pb-10">
            <div className="mb-2">
                <PageTitle title="CMS Page Builder" className="!mb-0 !pb-0" />
                <span className="text-[11px] text-gray-500 font-medium tracking-wide">Configure layouts and textual data mapping for frontend public routes</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Slim Sidebar Navigation */}
                <div className="lg:basis-3/12 w-full shrink-0">
                    <div className="bg-white border border-slate-100/80 shadow-sm rounded-xl overflow-hidden p-2">
                        <div className="flex flex-col gap-1">
                            {methods.map((method, index) => {
                                const isActive = tab === index;
                                return (
                                    <div
                                        key={index}
                                        className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                                            isActive 
                                              ? "bg-[#5572fc] text-white shadow-md shadow-[#5572fc]/20" 
                                              : "bg-transparent text-gray-600 hover:bg-[#5572fc]/5 hover:text-[#5572fc]"
                                        }`}
                                        onClick={() => setTab(index)}
                                    >
                                        <div className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-md ${isActive ? 'bg-white/20' : 'bg-slate-100 text-gray-400 group-hover:bg-[#5572fc]/10 group-hover:text-[#5572fc]'}`}>
                                            {method.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className={`text-[13px] font-bold ${isActive ? 'text-white' : 'text-gray-800 group-hover:text-[#5572fc]'}`}>
                                                {i18n.t(method.label)}
                                            </div>
                                            <div className={`text-[10px] font-semibold mt-0.5 tracking-wide ${isActive ? 'text-white/80' : 'text-gray-400 group-hover:text-[#5572fc]/60'}`}>
                                                {method.desc}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Dynamic Content Panel */}
                <div className="lg:basis-9/12 w-full animate-fade-in">
                    {methods[tab].form}
                </div>
                
            </div>
        </div>
    );
};

export default Content;