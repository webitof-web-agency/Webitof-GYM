"use client"
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../../../components/common/page-title';
import { useActionConfirm, useFetch } from '../../../../../helpers/hooks';
import { addOrRemoveMarketingGroupUser, fetchMarketingGroupUserList, fetchUsers } from '../../../../../helpers/backend';
import Table from '../../../../components/form/table';
import Button from '../../../../../../components/common/button';
import { FiUsers, FiPlus, FiTrash2, FiMail, FiPhone, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { Modal } from 'antd';

const page = () => {
    const params = useParams()
    const router = useRouter()
    const [data, getData] = useFetch(fetchMarketingGroupUserList, {}, false)
    const [user, getUser, { loading }] = useFetch(fetchUsers);
    const [open, setOpen] = useState(false)
    
    useEffect(() => {
        getData({ groupId: params?._id })
    }, [params?._id])
    
    const columns = [
        {
            text: 'Member Identity',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center flex-shrink-0 text-[10px] uppercase">
                        {d?.name?.substring(0, 2)}
                    </div>
                    <span className="text-xs font-bold text-gray-800 capitalize leading-tight">{d?.name}</span>
                </div>
            ),
        },
        {
            text: 'Contact Methods',
            dataField: 'email',
            formatter: (_, d) => (
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
                        <FiMail size={9} className="text-gray-400" /> {d?.email || '—'}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
                        <FiPhone size={9} className="text-gray-400" /> {d?.phone || '—'}
                    </span>
                </div>
            ),
        },
        {
            text: 'Access Control',
            dataField: 'phone',
            formatter: (_, d) => (
                <button
                    onClick={() => {
                        useActionConfirm(addOrRemoveMarketingGroupUser, { _id: params?._id, userId: d?._id, delete: true }, getData, 'Are you sure you want to remove this user from the marketing group?', 'Yes, Remove')
                    }}
                    className="flex justify-center items-center w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors border border-rose-100/50"
                    title="Remove User"
                >
                    <FiTrash2 size={14} />
                </button>
            ),
        },
    ];

    const columns2 = [
        { 
            text: 'System User', 
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-gray-800 capitalize leading-tight line-clamp-1">{d?.name}</span>
                    <span className="text-[9px] font-bold text-[#5572fc] bg-[#5572fc]/10 px-1.5 py-0.5 rounded uppercase tracking-wider w-fit">{d?.role}</span>
                </div>
            ) 
        },
        { 
            text: 'Contact Info', 
            dataField: 'email',
            formatter: (_, d) => (
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-600 line-clamp-1">{d?.email}</span>
                    <span className="text-[9px] text-gray-400">{d?.phone}</span>
                </div>
            )
        },
        {
            text: 'Action',
            dataField: 'id',
            formatter: (_, d) => {
                const isAlreadyInGroup = data?.groups?.some(gUser => gUser._id === d._id);
                if (isAlreadyInGroup) {
                    return (
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-100 whitespace-nowrap w-fit">
                            <FiCheck size={10} /> Added
                        </span>
                    );
                }
                
                return (
                    <button
                        onClick={() => {
                            useActionConfirm(addOrRemoveMarketingGroupUser, { _id: params?._id, userId: d?._id }, getData, 'Are you sure you want to add this user to the group?', 'Yes, Add');
                        }}
                        className="flex items-center gap-1 bg-white hover:bg-[#5572fc]/10 text-gray-600 hover:text-[#5572fc] text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#5572fc]/30 transition-all whitespace-nowrap w-fit"
                    >
                        <FiPlus size={11} /> Add to Group
                    </button>
                );
            },
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.push('/admin/marketing-group')} 
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-gray-500 hover:bg-slate-50 hover:text-gray-800 transition-colors shadow-sm"
                    >
                        <FiArrowLeft size={16} />
                    </button>
                    <PageTitle title={data?.name ? `Manage: ${data?.name}` : 'Loading Group...'} className="!mb-0" />
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    onReload={getData}
                    data={data?.groups}
                    columns={columns}
                    noActions={true}
                    action={
                        <Button
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                            onClick={() => setOpen(true)}
                        >
                            <FiPlus size={14} /> Add User To Group
                        </Button>
                    }
                    shadow={false}
                />
            </div>
            
            <Modal
                destroyOnClose
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                            <FiUsers size={15} />
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">
                                Add System Users
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">Search and select users to join this group</span>
                        </div>
                    </div>
                }
                width={850}
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                <div className="mt-4 border border-slate-100 rounded-xl overflow-hidden">
                    <Table
                        columns={columns2}
                        data={user}
                        onReload={getUser}
                        indexed
                        pagination
                        noActions={true}
                        shadow={false}
                        tableClass="text-xs"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default page;