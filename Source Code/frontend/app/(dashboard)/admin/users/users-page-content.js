'use client';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Form, message, Modal, Select } from 'antd';
import Image from 'next/image';
import { useAction, useFetch } from '../../../helpers/hooks';
import {
    addUser,
    buySubscriptionByAdmin,
    employeePasswordChange,
    fetchUserPaymentMethods,
    fetchUsers,
    removeUser,
    subscriptionPlan,
} from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import PhoneNumberInput from '../../components/form/phoneNumberInput';
import FormSelect from '../../components/form/select';
import { useCurrency } from '../../../contexts/site';
import { columnFormatter } from '../../../helpers/utils';
import FormPassword from '../../../../components/form/password';
import { FiUser, FiCalendar, FiUnlock, FiPlus, FiShield, FiRefreshCw, FiFilter } from 'react-icons/fi';

const UsersPageContent = () => {
    const [form] = Form.useForm();
    const [resetForm] = Form.useForm();
    const router = useRouter();
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchUsers, { role: 'user' });
    const [payMethods] = useFetch(fetchUserPaymentMethods);
    const [subscriptions] = useFetch(subscriptionPlan);
    const { currencies } = useCurrency();
    const [open, setOpen] = useState(false);
    const [renue, setRenue] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [employeId, setEmployeId] = useState('');

    const columns = [
        {
            text: 'Profile',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 bg-white">
                        <Image src={d?.image || "/defaultimg.jpg"} alt={d?.name} width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-xs">{d?.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{d?.email}</span>
                    </div>
                </div>
            )
        },
        { 
            text: 'Contact Info', 
            dataField: 'phone',
            formatter: (_, d) => (
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700 font-medium">{d?.phone}</span>
                </div>
            )
        },
        {
            text: 'Registered At',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: 'Subscription',
            dataField: 'hasSubscription',
            formatter: (_, d) => (
                <div className="flex items-center">
                    {d?.hasSubscription ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold capitalize bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                            Active
                        </span>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true);
                                setRenue(true);
                                setEmployeId(d?._id);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold capitalize bg-rose-50 text-rose-600 border border-rose-100/50 hover:bg-rose-500 hover:text-white transition-colors group"
                        >
                            <FiRefreshCw size={10} className="group-hover:animate-spin" />
                            Renew
                        </button>
                    )}
                </div>
            ),
        }
    ];

    const handleResetPassword = async (values) => {
        const submitData = {
            _id: employeId,
            confirm_password: values?.confirm_password,
            new_password: values?.password
        };
        return useAction(
            employeePasswordChange,
            submitData,
            () => {
                setIsReset(false);
                getData();
                resetForm.resetFields();
            },
            i18n.t('Password Changed Successfully')
        );
    };

    const filteredData = {
        ...data,
        docs: data?.docs?.filter((user) => user.role !== 'admin' && user.role !== 'trainer'),
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title={'Member List'} />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    loading={loading}
                    data={filteredData}
                    onReload={getData}
                    indexed
                    pagination
                    onView={(item) => {
                        router.push(`/admin/users/view/${item._id}`);
                    }}
                    action={(
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <FiFilter size={12} /> Filter
                                </span>
                                <Select
                                    allowClear
                                    className="!h-8 min-w-[130px] shadow-sm rounded-lg"
                                    placeholder={<span className='text-xs font-medium text-gray-500'>{i18n?.t('All Statuses')}</span>}
                                    onClear={() => getData({ subscription: undefined })}
                                    onChange={(value) => getData({ subscription: value })}
                                >
                                    <Select.Option value={undefined}>{i18n?.t('All')}</Select.Option>
                                    <Select.Option value={'active'}>{i18n?.t('Active')}</Select.Option>
                                    <Select.Option value={'inactive'}>{i18n?.t('Inactive')}</Select.Option>
                                </Select>
                            </div>
                            <Button
                                onClick={() => setOpen(true)}
                                className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                            >
                                <FiPlus size={14} />
                                {i18n?.t('Add Member')}
                            </Button>
                        </div>
                    )}
                    actions={(d) => (
                        <button
                            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#5572fc]/30 text-[#5572fc] hover:bg-[#5572fc] hover:text-white transition-all duration-300 text-[11px] font-bold shadow-sm bg-white whitespace-nowrap'
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
                    onDelete={removeUser}
                />
            </div>

            <Modal
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setRenue(false);
                    setEmployeId(null);
                    form.resetFields();
                }}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className={`w-8 h-8 rounded-lg ${renue ? 'bg-orange-100 text-orange-500' : 'bg-[#5572fc]/10 text-[#5572fc]'} flex items-center justify-center`}>
                            {renue ? <FiRefreshCw size={16} /> : <FiUser size={16} />}
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">{renue ? i18n?.t('Renew Subscription') : i18n?.t('Add Member')}</span>
                        </div>
                    </div>
                }
                footer={null}
                destroyOnClose={true}
                className="custom-modal rounded-xl"
                width={500}
                styles={{ content: { padding: '20px' } }}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={async (values) => {
                        if (renue) {
                            const { error, msg } = await buySubscriptionByAdmin({
                                user: employeId,
                                subscription: values?.subscription,
                                paymentMethod: values?.paymentMethod,
                                subscriptionType: values?.subscriptionType,
                                currency: values?.currency,
                            });
                            if (error === false) {
                                message.success(msg);
                                setRenue(false);
                                setEmployeId(undefined);
                                setOpen(false);
                                getData();
                                form.resetFields();
                            }
                        } else {
                            const { error, msg, data: createdUser } = await addUser({
                                name: values?.name,
                                phone: values?.phone,
                                email: values?.email,
                                password: values?.password,
                            });
                            if (error === true) {
                                message.error(msg);
                                return;
                            }
                            if (error === false) {
                                await buySubscriptionByAdmin({
                                    user: createdUser?._id,
                                    subscription: values?.subscription,
                                    paymentMethod: values?.paymentMethod,
                                    subscriptionType: values?.subscriptionType,
                                    currency: values?.currency,
                                });
                                message.success(msg);
                                setOpen(false);
                                getData();
                                form.resetFields();
                            }
                        }
                    }}
                    className='mt-4 space-y-3'
                >
                    {!renue && (
                        <>
                            <FormInput name='name' label="Full Name" required={true} placeholder={"e.g. John Doe"} />
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3'>
                                <PhoneNumberInput name='phone' label={i18n?.t('Phone Number')} required={true} />
                                <FormInput name='email' label={'Email Address'} required={true} placeholder={"e.g. user@gym.com"} />
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3'>
                                <FormPassword name='password' label={'Password'} required={true} placeholder={"Enter Password"} />
                                <FormPassword name='confirm_password' label={'Confirm Password'} required={true} confirm placeholder={"Verify Password"} />
                            </div>
                            <div className="py-2.5">
                                <h3 className='text-xs font-bold text-gray-500 uppercase tracking-widest'>{i18n?.t('Subscription Details')}</h3>
                                <hr className="mt-2 border-gray-100" />
                            </div>
                        </>
                    )}
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 mt-1'>
                        <FormSelect
                            name='subscription'
                            label={'Subscription'}
                            options={subscriptions?.docs?.map((sub) => ({
                                label: columnFormatter(sub?.name),
                                value: sub?._id,
                            }))}
                            placeholder={'Select Subscription'}
                        />
                        <FormSelect
                            name='subscriptionType'
                            label={'Subscription Type'}
                            options={[
                                { label: 'Yearly', value: 'yearly' },
                                { label: 'Monthly', value: 'monthly' },
                            ]}
                            placeholder={'Select Duration'}
                        />
                        <FormSelect
                            name='paymentMethod'
                            label='Payment Method'
                            options={[
                                ...(payMethods?.docs?.map((method) => ({
                                    label: method?.name,
                                    value: method?.type,
                                })) || []),
                                { label: 'Cash', value: 'cash' },
                            ]}
                            placeholder={'Select Method'}
                        />
                        <FormSelect
                            name='currency'
                            label={'Currency'}
                            options={currencies?.map((currency) => ({
                                label: currency?.name,
                                value: currency?.code,
                            }))}
                            placeholder={'Select Currency'}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                setRenue(false);
                                setEmployeId(null);
                                form.resetFields();
                            }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-sm shadow-[#5572fc]/20 !font-semibold !rounded-lg block w-fit !text-xs'
                        >
                            {renue ? <FiRefreshCw size={14} /> : <FiPlus size={14} />}
                            {renue ? i18n?.t('Confirm Renew') : i18n?.t('Save Details')}
                        </Button>
                    </div>
                </Form>
            </Modal>
            
            <Modal
                open={isReset}
                onCancel={() => {
                    setIsReset(false);
                    resetForm.resetFields();
                }}
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
                width={360}
                styles={{ content: { padding: '20px' } }}
            >
                <Form form={resetForm} onFinish={handleResetPassword} layout='vertical' className='mt-3 space-y-3'>
                    <div className="bg-yellow-50/50 p-2.5 rounded-lg border border-yellow-100/50 mb-4 flex gap-2 items-start">
                       <span className="text-yellow-500 mt-0.5"><FiShield size={14}/></span>
                       <div>
                           <p className="text-[11px] text-yellow-700 font-medium leading-relaxed">You are resetting the password for a member.</p>
                       </div>
                    </div>

                    <HiddenInput name='_id' />
                    
                    <div className="space-y-3">
                        <FormPassword
                            name='password'
                            label={i18n.t('New Password')}
                            placeholder={i18n.t('Enter New Password')}
                            rules={[{ required: true, message: i18n.t('Please enter password') }]}
                        />
                        <FormPassword 
                            label={i18n.t('Confirm New Password')} 
                            confirm={true} 
                            name='confirm_password' 
                            placeholder={i18n.t('Verify Password')} 
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={() => { setIsReset(false); resetForm.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </Button>
                        <Button type='submit' loading={loading} className="!px-5 !py-1.5 shadow-md shadow-[#5572fc]/20 !font-semibold !rounded-lg block w-fit !text-xs">
                            {i18n?.t('Reset Pass')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default UsersPageContent;
