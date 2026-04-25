"use client"
import React from 'react';
import NoticeCalendar from '../../../../(site)/(pages)/(trainer)/components/noticeCalender';
import { useParams, useRouter } from 'next/navigation';
import PageTitle from '../../../components/common/page-title';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';

const page = () => {
    const params = useParams();
    const router = useRouter();

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-start gap-4">
                    <button 
                        onClick={() => router.push('/admin/attendance')} 
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-gray-500 hover:bg-slate-50 hover:text-gray-800 transition-colors shadow-sm shrink-0"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <div className="flex flex-col pt-0.5">
                        <PageTitle title="Deep Access Logs" className="!mb-0 !pb-0" />
                        <span className="text-[11px] text-gray-500 font-medium">Monthly historical calendar view for this user's check-ins</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80 p-5">
                <div className="flex items-center gap-2 text-[#F97316] mb-2 pb-4 border-b border-slate-100">
                    <FiCalendar size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">Attendance History Matrix</span>
                </div>
                <div className="-mx-2">
                    <NoticeCalendar _id={params?._id} isAdmin={true} />
                </div>
            </div>
        </div>
    );
};

export default page;