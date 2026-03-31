'use client';
import React from 'react';
import { fetchTheme } from '../../../../../helpers/backend';
import { useFetch } from '../../../../../helpers/hooks';
import Home1 from '../../../../../../components/admin/pagesetting/home/home1';
import Home2 from '../../../../../../components/admin/pagesetting/home/home2';
import Home3 from '../../../../../../components/admin/pagesetting/home/home3';
import Home4 from '../../../../../../components/admin/pagesetting/home/home4';
import { FiHome } from 'react-icons/fi';

const HomePageSetting = ({ slug }) => {
    const [theme] = useFetch(fetchTheme);
    const isDefaultTheme = theme?.filter((i) => i?.isDefault === true);
    const defaultName = isDefaultTheme?.[0]?.name;

    if (!Array.isArray(theme)) {
        return (
            <div className="bg-white rounded-xl border border-slate-100/80 p-8 flex items-center justify-center">
                <div className="text-gray-400 text-sm font-medium animate-pulse">Loading layout config…</div>
            </div>
        );
    }

    const renderContent = () => {
        if (defaultName === 'home1') return <Home1 slug={slug} />;
        if (defaultName === 'home2') return <Home2 slug={slug} />;
        if (defaultName === 'home3') return <Home3 slug={slug} />;
        if (defaultName === 'home4') return <Home4 slug={slug} />;
        return <Home1 slug={slug} />;
    };

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                    <FiHome size={16} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-800 leading-tight">Landing Page Hero Config</h3>
                    <p className="text-[11px] text-gray-500 font-medium capitalize">
                        Active theme: <span className="font-bold text-[#5572fc]">{defaultName || 'home1'}</span>
                    </p>
                </div>
            </div>
            <div className="p-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default HomePageSetting;
