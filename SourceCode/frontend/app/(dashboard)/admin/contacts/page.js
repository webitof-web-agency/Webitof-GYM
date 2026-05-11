"use client"
import React from 'react'
import { Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useFetch } from "../../../helpers/hooks";
import { delContact, fetchContact } from "../../../helpers/backend";
import Table from "../../components/form/table";
import PageTitle from "../../components/common/page-title";
import dayjs from 'dayjs';
import { FiUser, FiMail, FiCalendar, FiMessageSquare, FiCornerUpRight, FiEye } from 'react-icons/fi';

const Page = () => {
    const router = useRouter()
    const [contact, getContact, { loading, error }] = useFetch(fetchContact)

    const columns = [
        {
            dataField: 'name',
            text: 'Contact',
            formatter: (name, d) => (
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-800 text-xs capitalize flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center flex-shrink-0">
                            <FiUser size={10} />
                        </span>
                        {name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 ml-7">
                        <FiMail size={9} />
                        {d?.email}
                    </span>
                </div>
            ),
        },
        {
            dataField: 'subject',
            text: 'Subject',
            formatter: (subject) => (
                <Tooltip title={subject?.length > 40 ? subject : ''} placement="topLeft">
                    <span className="text-xs text-gray-700 font-medium flex items-start gap-1.5 cursor-help max-w-[220px]">
                        <FiMessageSquare size={11} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">
                            {subject?.length > 40 ? subject?.slice(0, 40) + '...' : subject}
                        </span>
                    </span>
                </Tooltip>
            ),
        },
        {
            text: 'Status',
            dataField: 'status',
            formatter: (_, d) => (
                d?.status === false ? (
                    <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase border bg-orange-50 text-orange-600 border-orange-100/50">
                        Awaiting Reply
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase border bg-emerald-50 text-emerald-600 border-emerald-100/50">
                        Replied
                    </span>
                )
            ),
        },
        {
            text: 'Received',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            dataField: '_id',
            text: 'Action',
            formatter: (_id, data) => (
                <button
                    type="button"
                    onClick={() => router.push(`/admin/contacts/${_id}`)}
                    className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        data?.status === false
                            ? 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20 hover:bg-[#F97316] hover:text-white'
                            : 'bg-slate-50 text-gray-600 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                    {data?.status === false ? <><FiCornerUpRight size={11} /> Reply</> : <><FiEye size={11} /> View</>}
                </button>
            ),
        },
    ]

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title="Contact Messages" />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={contact}
                    pagination
                    noActions
                    indexed
                    shadow={false}
                    onDelete={delContact}
                    onReload={getContact}
                    error={error}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export default Page

