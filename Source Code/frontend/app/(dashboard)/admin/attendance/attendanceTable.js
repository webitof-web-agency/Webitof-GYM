import dayjs from 'dayjs';
import React from 'react';
import Image from 'next/image';
import { FiClock } from 'react-icons/fi';

const AttendanceTable = ({ data }) => {
    
    if (!data?.docs || data.docs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-300 shadow-sm mb-2">
                    <FiClock size={16} />
                </div>
                <span className="text-xs font-bold text-gray-500">No activity recorded yet</span>
                <span className="text-[10px] text-gray-400">Waiting for employee punches</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {data?.docs?.map((d) => (
                <div
                    key={d?._id}
                    className="flex items-center justify-between bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm hover:shadow-md hover:border-[#5572fc]/30 transition-all cursor-pointer group"
                >
                    <div className='flex items-center gap-3'>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-[9px] uppercase">
                            {d?.employee?.image ? (
                                <Image src={d?.employee?.image} alt={d?.employee?.name} width={32} height={32} className="w-full h-full object-cover" />
                            ) : (
                                d?.employee?.name?.substring(0, 2)
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-800 capitalize leading-tight group-hover:text-[#5572fc] transition-colors line-clamp-1">
                                {d?.employee?.name}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 mt-0.5 flex items-center gap-1 uppercase tracking-wide">
                                {d?.clockIn && d?.clockOut
                                    ? <><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> OUT AT {dayjs(d?.clockOut).format('hh:mm A')}</>
                                    : <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> IN AT {dayjs(d?.clockIn).format('hh:mm A')}</>}
                            </span>
                        </div>
                    </div>
                    {/* The punch indicator actions or other icons used to exist here, left flexible */}
                    <div className="px-1">
                         {d?.clockIn && d?.clockOut ? (
                            <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">{d?.totalHours || "—"}</span>
                         ) : (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">Active</span>
                         )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttendanceTable;