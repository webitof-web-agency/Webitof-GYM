import React, { useState } from 'react';
import PageTitle from '../../../../components/common/page-title';
import dayjs from 'dayjs';
import { delMarketingMail } from '../../../../../helpers/backend';
import Table from '../../../../components/form/table';
import { FaCheck } from 'react-icons/fa';
import { IoCloseSharp } from "react-icons/io5";
import { getStatusClass } from '../../../../../helpers/utils';
import EmailDetails from './emailDetails';
import { FiClock, FiMessageSquare, FiUsers, FiMail, FiCheck, FiX, FiEye } from 'react-icons/fi';

const CommonMail = ({ data, getData, title, isScheduled=false }) => {
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState(null);

    const columns = [
        {
            text: isScheduled ? 'Scheduled Date' : 'Sent Date',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiClock className="text-gray-400" size={10} />
                    {dayjs(isScheduled ? d?.scheduled_date : d?.scheduled_date ? d?.scheduled_date : d?.createdAt).format('DD MMM YYYY, hh:mm A')}
                </span>
            ),
        },
        {
            text: "Campaign Details",
            dataField: "subject",
            formatter: (value, d) => (
                <div className="flex flex-col gap-1 max-w-[240px]">
                    <span className="font-bold text-gray-800 text-xs leading-snug line-clamp-1 flex items-center gap-1.5">
                        <FiMessageSquare size={10} className="text-[#5572fc] flex-shrink-0" />
                        {value || 'No Subject'}
                    </span>
                    <span 
                        className="text-[10px] text-gray-500 line-clamp-1 ml-4" 
                        dangerouslySetInnerHTML={{ __html: d?.content || 'No content provided.' }}
                    />
                </div>
            ),
        },
        {
            text: "Audience Target",
            dataField: "audience",
            formatter: (_, d) => {
                const targets = [];
                if (d?.individual_mail) targets.push("1 Individual");
                if (d?.group) targets.push(`Group: ${d.group.name.length > 10 ? d.group.name.substring(0, 10) + "..." : d.group.name}`);
                if (d?.user) targets.push("Members");
                if (d?.subscriber) targets.push("Subscribers");
                if (d?.trainer) targets.push("Trainers");
                if (d?.employee) targets.push("Employees");

                return (
                    <div className="flex flex-wrap items-center gap-1 max-w-[180px]">
                        {targets.length > 0 ? (
                            targets.slice(0, 2).map((t, idx) => (
                                <span key={idx} className="text-[9px] font-bold text-gray-600 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 whitespace-nowrap">
                                    {t}
                                </span>
                            ))
                        ) : (
                            <span className="text-[9px] font-bold text-gray-400 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5">None</span>
                        )}
                        {targets.length > 2 && (
                            <span className="text-[9px] font-bold text-[#5572fc] bg-[#5572fc]/10 rounded px-1.5 py-0.5">+{targets.length - 2}</span>
                        )}
                    </div>
                );
            },
        },
        {
            text: "Status",
            dataField: "status",
            formatter: (_, d) => {
                const isActive = d?.status === "success" || d?.status === "active";
                const isPending = d?.status === "pending";
                const isFailed = d?.status === "failed";
                
                let style = "bg-slate-50 text-slate-600 border-slate-200";
                if (isActive) style = "bg-emerald-50 text-emerald-600 border-emerald-100";
                if (isPending) style = "bg-orange-50 text-orange-600 border-orange-100";
                if (isFailed) style = "bg-rose-50 text-rose-600 border-rose-100";

                return (
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold uppercase border tracking-widest ${style}`}>
                        {d?.status}
                    </span>
                );
            },
        },
        {
            dataField: '_id',
            text: 'Action',
            formatter: (_id, data) => (
                <button
                    type="button"
                    onClick={() => { setOpen(true); setDetails(data); }}
                    className="flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-gray-600 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all w-fit"
                >
                    <FiEye size={12} /> View
                </button>
            ),
        },
    ];

    return (
        <div className="flex flex-col w-full h-full">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                    <FiMail size={15} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 leading-tight">{title}</h2>
                    <p className="text-[10px] text-gray-500 mt-0.5">View and manage a history of this email campaign list</p>
                </div>
            </div>
            
            <div className="p-0 border-t border-slate-100/50">
                <Table
                    shadow={false}
                    data={data}
                    columns={columns}
                    pagination
                    indexed={false}
                    noActions={true}
                    onDelete={delMarketingMail}
                    onReload={getData}
                    className="!rounded-none"
                    tableClass="!border-0 text-xs"
                />
            </div>

            {open && details && (
                <EmailDetails open={open} setOpen={setOpen} details={details} />
            )}
        </div>
    );
};

export default CommonMail;