'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { Form, Modal } from 'antd';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import {
    addUserEmployee,
    deleteEmployee,
    employeePasswordChange,
    fetchRoleList,
    fetchUserEmployee,
    updateUserEmployee,
} from '../../../../helpers/backend';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import Table from '../../../components/form/table';
import { useAction, useFetch } from '../../../../helpers/hooks';
import PhoneNumberInput from '../../../../../components/form/phoneNumberInput';
import FormPassword from '../../../../../components/form/password';
import FormSelect from '../../../../../components/form/select';
import { FiUser, FiMail, FiPhone, FiCalendar, FiPlus, FiBriefcase, FiShield, FiUnlock } from 'react-icons/fi';
import Image from 'next/image';

const EmployeePageContent = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchUserEmployee);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [employeId, setEmployeId] = useState('');
    const [role] = useFetch(fetchRoleList);

    const columns = [
        {
            text: 'Employee Profile',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-[10px] uppercase">
                        {d?.image ? (
                            <Image src={d?.image} alt={d?.name} width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                            d?.name?.substring(0, 2)
                        )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-800 text-xs capitalize leading-tight">{d?.name}</span>
                    </div>
                </div>
            )
        },
        {
            text: 'Contact Info',
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
            )
        },
        {
            text: 'System Role',
            dataField: 'role',
            formatter: (_, d) => (
                <span className="text-[9px] font-bold text-[#F97316] bg-[#F97316]/10 px-2 py-1 rounded-md uppercase tracking-wider whitespace-nowrap">
                    {d?.permission?.name || 'No Role'}
                </span>
            ),
        },
        {
            text: 'Registered At',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        }
    ];

    const onFinish = async (values) => {
        return useAction(
            values?._id?.length > 5 ? updateUserEmployee : addUserEmployee,
            { ...values },
            () => {
                setOpen(false);
                setIsEdit(false);
                getData();
                form.resetFields();
            },
            values?._id ? i18n.t('Employee updated successfully') : i18n.t('Employee added Successfully')
        );
    };

    const handleResetPassword = async (values) => {
        values._id = employeId;

        return useAction(
            employeePasswordChange,
            {
                ...values,
                new_password: values?.password,
                confirm_password: values?.confirm_password,
            },
            () => {
                setIsReset(false);
                getData();
                form.resetFields();
            },
            i18n.t('Password Changed Successfully')
        );
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title={i18n.t('Manage Employees')} />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    action={
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setOpen(true);
                                setIsEdit(false);
                            }}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} />
                            {i18n?.t('Add Employee')}
                        </Button>
                    }
                    actions={(d) => (
                        <button
                            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F97316]/30 text-[#F97316] hover:bg-[#F97316] hover:text-white transition-all duration-300 text-[11px] font-bold shadow-sm bg-white whitespace-nowrap'
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsReset(true);
                                setEmployeId(d?._id);
                            }}
                        >
                            <FiUnlock size={12} />
                            {i18n.t('Reset Pass')}
                        </button>
                    )}
                    indexed
                    onDelete={deleteEmployee}
                    onEdit={(values) => {
                        setIsEdit(true);
                        setOpen(true);
                        if (values?._id) {
                            form.setFieldsValue({
                                ...values,
                                name: values?.name,
                                email: values?.email,
                                phone: values?.phone,
                                permission: values?.permission?._id,
                                _id: values?._id,
                                image: values?.image,
                            });
                        }
                    }}
                    pagination
                />
            </div>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center text-[#F97316]">
                            <FiBriefcase size={16} />
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">
                                {isEdit ? i18n?.t('Edit Employee') : i18n?.t('Add New Employee')}
                            </span>
                        </div>
                    </div>
                }
                footer={null}
                destroyOnClose={true}
                className="custom-modal rounded-xl"
                width={550}
                styles={{ content: { padding: '20px' } }}
            >
                <Form form={form} onFinish={onFinish} layout='vertical' className='mt-4 space-y-0'>
                    <HiddenInput name='_id' />
                    <div className='grid grid-cols-1 gap-x-3 gap-y-0'>
                        <FormInput placeholder={i18n.t('e.g. John Doe')} name='name' label="Full Name" required={true} />
                        <FormSelect
                            placeholder={i18n.t('Select System Role')}
                            required={true}
                            name='permission'
                            label="Assigned Role"
                            options={role?.docs?.map((d) => ({
                                label: d.name,
                                value: d._id,
                            }))}
                        />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0 mt-3'>
                        <FormInput placeholder={i18n.t('e.g. employee@gym.com')} type='email' name='email' label="Email Address" required={true} />
                        <PhoneNumberInput placeholder={i18n.t('Enter Phone Number')} name='phone' label="Phone Number" required={true} />
                    </div>
                    {!isEdit && (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0 mt-3'>
                            <FormPassword placeholder={i18n.t('Create Password')} name='password' label="Initial Password" type={'password'} required={true} />
                            <FormPassword placeholder={i18n.t('Verify Password')} name='confirm_password' confirm label="Confirm Password" required={true} />
                        </div>
                    )}
                    <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={() => { setOpen(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </Button>
                        <Button type='submit' loading={loading} className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-sm shadow-[#F97316]/20 !font-semibold !rounded-lg block w-fit !text-xs'>
                            {isEdit ? i18n?.t('Save Changes') : <><FiPlus size={14} /> {i18n?.t('Create Employee')}</>}
                        </Button>
                    </div>
                </Form>
            </Modal>

            <Modal
                open={isReset}
                onCancel={() => { setIsReset(false); form.resetFields(); }}
                footer={null}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <FiShield size={16} />
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">{i18n?.t('Security Reset')}</span>
                        </div>
                    </div>
                }
                destroyOnClose={true}
                maskClosable={false}
                className="rounded-xl"
                width={380}
                styles={{ content: { padding: '20px' } }}
            >
                <Form onFinish={handleResetPassword} layout='vertical' className='mt-3'>
                    <div className="bg-yellow-50/50 p-2.5 rounded-lg border border-yellow-100/50 mb-4 flex gap-2 items-start">
                       <span className="text-yellow-500 mt-0.5"><FiShield size={14}/></span>
                       <div>
                           <p className="text-[11px] text-yellow-700 font-medium leading-relaxed">You are resetting the password for a system employee. Provide credentials securely.</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                        <FormPassword placeholder={i18n.t('Enter New Password')} name='password' label="New Password" type={'password'} required={true} />
                        <FormPassword placeholder={i18n.t('Verify Password')} name='confirm_password' label="Confirm Password" confirm={true} required={true} />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={() => { setIsReset(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </Button>
                        <Button type='submit' loading={loading} className="!px-5 !py-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg block w-fit !text-xs">
                            {i18n?.t('Reset Pass')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default EmployeePageContent;

