"use client";
import React, { useState } from 'react';
import dayjs from 'dayjs';
import PageTitle from '../../components/common/page-title';
import Table from '../../components/form/table';
import { useFetch } from '../../../helpers/hooks';
import { fetchAttendanceAdmin, todayAttendanceAdmin } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import { Modal } from 'antd';
import AttendanceTable from './attendanceTable';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiCalendar, FiClock, FiLogIn, FiLogOut, FiUsers, FiExternalLink, FiX, FiMail, FiPhone } from 'react-icons/fi';

const page = () => {
    const i18n = useI18n();
    let { langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchAttendanceAdmin);
    const [todayData, getTodayData] = useFetch(todayAttendanceAdmin, { status: 'all' });
    const [selectedTab, setSelectedTab] = useState('all');
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState(null);
    const router = useRouter();

    const getStatusTheme = (status) => {
        if (status === "present") return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", label: "In Time" };
        if (status === "late") return { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", label: "Late" };
        return { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", label: status || "Unknown" };
    };

    const columns = [
        {
            text: 'Employee Identity',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-[10px] uppercase">
                        {d?.employee?.image ? (
                            <Image src={d?.employee?.image} alt={d?.employee?.name} width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                            d?.employee?.name?.substring(0, 2)
                        )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-800 text-xs capitalize leading-tight">{d?.employee?.name}</span>
                        <span className="text-[9px] font-semibold text-gray-400 truncate max-w-[120px]">
                            {d?.employee?.email || 'No Email'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            text: 'Date',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: "Time Activity",
            dataField: "clockIn",
            formatter: (_, d) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-[100px]">
                        <div className="w-4 h-4 rounded flex items-center justify-center bg-emerald-50 text-emerald-500"><FiLogIn size={9}/></div>
                        <span className="text-[10px] font-bold text-gray-700">{d?.clockIn ? dayjs(d?.clockIn).format('hh:mm A') : "0:0"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-[100px]">
                        <div className="w-4 h-4 rounded flex items-center justify-center bg-slate-50 text-gray-500 border border-slate-200"><FiLogOut size={9}/></div>
                        <span className="text-[10px] font-bold text-gray-700">{d?.clockOut ? dayjs(d?.clockOut).format('hh:mm A') : "0:0"}</span>
                    </div>
                </div>
            )
        },
        {
            text: "Total Hours",
            dataField: "totalHours",
            formatter: (_, d) => (
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100 inline-flex items-center gap-1 whitespace-nowrap">
                    <FiClock size={10} />
                    {d?.totalHours ? `${d?.totalHours} hrs` : "0:0"}
                </span>
            ),
        },
        {
            text: "Status",
            dataField: "status",
            formatter: (value) => {
                const theme = getStatusTheme(value);
                return (
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-widest whitespace-nowrap ${theme.bg} ${theme.text} ${theme.border}`}>
                        {theme.label}
                    </span>
                )
            },
        }
    ];

    const tabOptions = [
        { id: 'all', label: 'All Records' },
        { id: 'present', label: 'In Time' },
        { id: 'late', label: 'Late Arrival' },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative">
            <div className="mb-2">
                <PageTitle title={i18n.t("Attendance Register")} />
            </div>
            
            <div className='flex xl:flex-row flex-col-reverse xl:gap-5 gap-4'>
                <div className='flex-1 xl:w-[calc(100%-350px)] min-w-0'>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100/80 overflow-hidden">
                        <Table
                            columns={columns}
                            data={data}
                            loading={loading}
                            onReload={getData}
                            indexed
                            pagination
                            shadow={false}
                            langCode={langCode}
                            onView={(value) => { setDetails(value); setOpen(true) }}
                        />
                    </div>
                </div>

                <div className='xl:w-[350px] shrink-0'>
                    <div className='bg-white rounded-xl shadow-sm border border-slate-100/80 p-5 sticky top-4'>
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                                    <FiUsers size={14} />
                                </div>
                                <div>
                                    <h3 className='text-sm font-bold text-gray-800 leading-tight'>{i18n?.t("Today's Pulse")}</h3>
                                    <span className="text-[10px] text-gray-400">{dayjs().format('MMMM D, YYYY')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 mb-4">
                            {tabOptions.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setSelectedTab(tab.id); getTodayData({ status: tab.id }); }}
                                    className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${
                                        selectedTab === tab.id
                                            ? 'bg-white shadow-sm text-[#F97316]'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="max-h-[500px] overflow-y-auto hide-scrollbar -mx-2 px-2">
                           <AttendanceTable data={todayData} />
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                open={open}
                onCancel={() => { setOpen(false); setDetails(null) }}
                footer={null}
                width={500}
                centered
                closeIcon={<div className="bg-black/20 hover:bg-black/40 p-1 rounded backdrop-blur-sm transition-all text-white absolute top-3 right-3"><FiX size={14}/></div>}
                styles={{ content: { padding: 0, overflow: 'hidden', borderRadius: '16px' } }}
                destroyOnClose
            >
                {details && (
                    <div className='w-full bg-slate-50 relative pb-5 rounded-2xl overflow-hidden'>
                        <div className="h-24 w-full bg-gradient-to-br from-[#F97316] to-[#FB923C] relative">
                             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                        </div>
                        
                        <div className='absolute top-10 left-1/2 -translate-x-1/2 z-10'>
                            <div className="p-1 bg-slate-50 rounded-full shadow-sm">
                                <div className="w-[70px] h-[70px] rounded-full overflow-hidden border-[3px] border-white bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-lg uppercase">
                                     {details?.employee?.image ? (
                                        <Image src={details.employee.image} alt="Employee" width={70} height={70} className="w-full h-full object-cover" />
                                     ) : (
                                        details?.employee?.name?.substring(0, 2)
                                     )}
                                </div>
                            </div>
                        </div>

                        <div className='mt-12 px-5 flex flex-col items-center text-center'>
                            <h2 className="text-xl font-bold text-gray-800 tracking-tight">{details?.employee?.name}</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                {dayjs(details?.createdAt).format('MMMM D, YYYY')}
                            </p>

                            <div className="w-full grid grid-cols-2 gap-3 mt-6">
                                <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col items-center">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 mb-1 flex items-center justify-center"><FiLogIn size={11}/></div>
                                    <span className="text-[10px] text-gray-400 font-bold tracking-wide uppercase">Punched In</span>
                                    <span className="text-sm font-bold text-gray-800">{details?.clockIn ? dayjs(details?.clockIn).format("hh:mm A") : "0:0"}</span>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col items-center">
                                    <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 text-gray-400 mb-1 flex items-center justify-center"><FiLogOut size={11}/></div>
                                    <span className="text-[10px] text-gray-400 font-bold tracking-wide uppercase">Punched Out</span>
                                    <span className="text-sm font-bold text-gray-800">{details?.clockOut ? dayjs(details?.clockOut).format("hh:mm A") : "0:0"}</span>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-xl p-3 col-span-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center"><FiClock size={14}/></div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">Total Time Logged</span>
                                            <span className="text-base font-black text-gray-800">{details?.totalHours || "0:0"}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">Session Status</span>
                                        <span className={`text-xs font-bold uppercase ${getStatusTheme(details?.status).text}`}>
                                            {getStatusTheme(details?.status).label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full bg-white border border-slate-100 rounded-xl p-3 mt-3">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-50 mb-2">
                                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                                         <FiPhone size={10} className="text-gray-400"/> {details?.employee?.phone || 'No Phone'}
                                     </div>
                                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                                         <FiMail size={10} className="text-gray-400"/> {details?.employee?.email || 'No Email'}
                                     </div>
                                </div>
                                <button 
                                    className="w-full bg-[#F97316]/5 hover:bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all" 
                                    onClick={() => router.push(`/admin/attendance/${details?.employee?._id}`)}
                                >
                                    <FiExternalLink size={12}/> View Deep Access Logs
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default page;
