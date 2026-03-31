'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from 'antd';
import { fetchPermissions, postPermissions, singleRole } from '../../../../../helpers/backend';
import { useAction, useFetch } from '../../../../../helpers/hooks';
import { useUser } from '../../../../../contexts/user';
import Table from '../../../../components/form/table';
import Button from '../../../../../../components/common/button';
import PageTitle from '../../../../components/common/page-title';
import { FiArrowLeft, FiSave, FiShield } from 'react-icons/fi';

const havePermission = (permission, permissions) => {
    return Array.isArray(permissions) ? permissions.includes(permission) : false;
};

const RolePermission = ({params}) => {
    const [elements] = useFetch(fetchPermissions);
    const [role, getRoles] = useFetch(singleRole, {}, false);
    const { user } = useUser();
    const { push } = useRouter();
    const [update, setUpdate] = useState(false);
    const reload = () => setUpdate(!update);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        if (params?._id) {
            getRoles({ _id: params?._id });
        }
    }, [params?._id]);

    useEffect(() => {
        if (role?._id) {
            setPermissions(role?.permissions);
        }
    }, [role?._id]);

    const isChecked = (data) => {
        if (data?.child) {
            for (let c of data.child) {
                if (permissions?.includes(c?.permission)) {
                    return true;
                }
            }
        }
        if (permissions.includes(data?.permission)) {
            return true;
        }
        return false;
    };

    const handleChange = (e, data) => {
        if (e.target.checked === true) {
            if (data.child) {
                setPermissions([...permissions, ...data?.child?.map((d) => d.permission)]);
            } else {
                permissions.push(data.permission);
            }
        } else {
            let p = data?.child ? data?.child?.map((d) => d.permission) : [data.permission];
            setPermissions(permissions?.filter((d) => !p.includes(d)));
        }
        reload();
    };

    const currentPermissions = Array.isArray(user?.permission)
        ? user.permission
        : Array.isArray(user?.roles)
            ? user.roles.flatMap((role) => role?.permissions || [])
            : [];
    const admin = user?.role === 'admin';
    
    const Check = ({ d }) => (
        <label className="flex items-center justify-start cursor-pointer w-full h-full py-1">
            <Checkbox onChange={(e) => handleChange(e, d)} checked={isChecked(d)} className="scale-110 custom-checkbox-brand" />
        </label>
    );

    const columns = [
        { 
            text: '#', 
            dataField: '', 
            formatter: (_, d) => <div className="w-8"><Check d={d} /></div> 
        },
        { 
            text: 'System Module', 
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700 capitalize">{d?.name}</span>
                </div>
            )
        },
        {
            text: 'Create',
            dataField: '',
            formatter: (_, data) =>
                data.child &&
                (admin || havePermission(`${data?.permission}_create`, currentPermissions)) && (
                    <Check d={data?.child?.find((d) => d.permission === `${data?.permission}_create`)} />
                ),
        },
        {
            text: 'Edit',
            dataField: '',
            formatter: (_, data) =>
                data.child &&
                (admin || havePermission(`${data?.permission}_edit`, currentPermissions)) && (
                    <Check d={data?.child?.find((d) => d.permission === `${data?.permission}_edit`)} />
                ),
        },
        {
            text: 'Delete',
            dataField: '',
            formatter: (_, data) =>
                data.child &&
                (admin || havePermission(`${data?.permission}_delete`, currentPermissions)) && (
                    <Check d={data?.child?.find((d) => d.permission === `${data?.permission}_delete`)} />
                ),
        },
        {
            text: 'View',
            dataField: '',
            formatter: (_, data) =>
                data.child &&
                (admin || havePermission(`${data?.permission}_view`, currentPermissions)) && (
                    <Check d={data?.child?.find((d) => d.permission === `${data?.permission}_view`)} />
                ),
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-start gap-4">
                    <button 
                        onClick={() => push('/admin/hrm/roles')} 
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-gray-500 hover:bg-slate-50 hover:text-gray-800 transition-colors shadow-sm shrink-0"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <div className="flex flex-col pt-0.5">
                        <PageTitle title={role?.name ? `Role: ${role?.name}` : 'Loading...'} className="!mb-0 !pb-0" />
                        <span className="text-[11px] text-gray-500 font-medium">Configure access control arrays based on the available system modules</span>
                    </div>
                </div>
                <Button 
                    onClick={async () => {
                        return useAction(postPermissions, { role: params?._id, permissions }, () => {
                            push('/admin/hrm/roles');
                        });
                    }}
                    className="flex items-center gap-1.5 !px-6 !py-2.5 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !rounded-xl text-xs font-bold shrink-0"
                >
                    <FiSave size={14} /> Save Authorization Rules
                </Button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#5572fc]">
                        <FiShield size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">Global Module Matrix</span>
                    </div>
                </div>
                <Table
                    pagination={false}
                    noActions={true}
                    columns={columns}
                    shadow={false}
                    className="!rounded-none"
                    tableClass="!border-t-0 text-xs"
                    data={elements
                        ?.filter((d) => {
                            if (admin) return true;
                            if (havePermission(d.permission, currentPermissions)) return true;
                            if (d?.child) {
                                for (let c of d.child) {
                                    if (havePermission(c.permission, currentPermissions)) return true;
                                }
                            }
                            return false;
                        })
                        ?.map((d) => {
                            return {
                                ...d,
                                child: d?.child
                                    ? admin
                                        ? d.child
                                        : d.child?.filter((d) =>
                                              havePermission(d.permission, currentPermissions)
                                          )
                                    : undefined,
                            };
                        })}
                />
            </div>
        </div>
    );
};

export default RolePermission;
