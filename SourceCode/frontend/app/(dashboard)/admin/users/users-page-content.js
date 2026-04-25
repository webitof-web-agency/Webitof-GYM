'use client';
import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Form, message, Modal, Select } from 'antd';
import Image from 'next/image';
import { useAction, useFetch } from '../../../helpers/hooks';
import {
    addUser,
    adminUpdateUser,
    buySubscriptionByAdmin,
    employeePasswordChange,
    fetchUserPaymentMethods,
    fetchUsers,
    removeUser,
    subscriptionPlan,
    subscriptionHistory,
    paySubscriptionDueByAdmin,
    fetchAdminDueUsers,
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
import { FiUser, FiCalendar, FiUnlock, FiPlus, FiShield, FiRefreshCw, FiFilter, FiEdit2 } from 'react-icons/fi';

const UsersPageContent = () => {
    const [form] = Form.useForm();
    const [resetForm] = Form.useForm();
    const [payDueForm] = Form.useForm();
    const router = useRouter();
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchUsers, { role: 'user' });
    const [payMethods] = useFetch(fetchUserPaymentMethods);
    const [subscriptions] = useFetch(subscriptionPlan);
    const { currencies, currencySymbol, convertAmoutnWithCurrency, getCurrencySymbol } = useCurrency();
    const [open, setOpen] = useState(false);
    const [renue, setRenue] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState('');
    const [isReset, setIsReset] = useState(false);
    const [employeId, setEmployeId] = useState('');
    const [payDueOpen, setPayDueOpen] = useState(false);
    const [dueSubscription, setDueSubscription] = useState(null);
    const [payDueLoading, setPayDueLoading] = useState(false);
    const selectedSubscriptionId = Form.useWatch('subscription', form);
    const selectedSubscriptionType = Form.useWatch('subscriptionType', form);
    const selectedCurrency = Form.useWatch('currency', form);

    const selectedPlan = subscriptions?.docs?.find((sub) => sub?._id === selectedSubscriptionId);
    const basePrice =
        selectedSubscriptionType === 'yearly'
            ? selectedPlan?.yearly_price
            : selectedSubscriptionType === 'monthly'
                ? selectedPlan?.monthly_price
                : undefined;
    const displayCurrencySymbol = selectedCurrency ? getCurrencySymbol(selectedCurrency) : currencySymbol;
    const displayPrice =
        basePrice !== undefined && basePrice !== null
            ? selectedCurrency
                ? convertAmoutnWithCurrency(basePrice, selectedCurrency)
                : basePrice
            : undefined;

    const getDueAmountFromSubscription = (subscription) => {
        const totalAmount = subscription?.payment?.amount ?? subscription?.price ?? 0;
        const currentPaid =
            subscription?.payment?.paid_amount ??
            (subscription?.payment?.status === 'paid' ? totalAmount : 0);
        const currentDue =
            subscription?.payment?.due_amount ?? Math.max(totalAmount - currentPaid, 0);
        return { totalAmount, currentPaid, currentDue };
    };

    const handleOpenPayDue = async (userId) => {
        setPayDueLoading(true);
        try {
            const response = await subscriptionHistory({ user: userId, page: 1, limit: 10 });
            const history = response?.data?.docs || [];
            const dueRecord = history.find((record) => getDueAmountFromSubscription(record).currentDue > 0);
            if (!dueRecord) {
                message.warning(i18n?.t('No due amount found for this member'));
                setPayDueLoading(false);
                return;
            }
            const dueInfo = getDueAmountFromSubscription(dueRecord);
            setDueSubscription(dueRecord);
            setPayDueOpen(true);
            payDueForm.setFieldsValue({
                paidAmount: dueInfo.currentDue,
                paymentMethod: dueRecord?.payment?.method || 'cash',
            });
        } catch (error) {
            message.error(i18n?.t('Failed to load due subscription'));
        } finally {
            setPayDueLoading(false);
        }
    };

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
                                setIsEdit(false);
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

    const [dueUsers, setDueUsers] = useState(new Set());

    const filteredDocs = useMemo(
        () => data?.docs?.filter((user) => user.role !== 'admin' && user.role !== 'trainer') || [],
        [data?.docs]
    );
    const filteredUserIds = useMemo(
        () => filteredDocs.map((user) => String(user?._id)).filter(Boolean),
        [filteredDocs]
    );
    const filteredUserIdsSignature = useMemo(
        () => filteredUserIds.join('|'),
        [filteredUserIds]
    );

    const filteredData = useMemo(
        () => ({ ...(data || {}), docs: filteredDocs }),
        [data, filteredDocs]
    );

    React.useEffect(() => {
        if (filteredUserIds.length === 0) {
            setDueUsers((prev) => (prev.size ? new Set() : prev));
            return;
        }

        fetchAdminDueUsers({ userIds: filteredUserIds })
            .then((res) => {
                if (res?.error === false) {
                    const nextDueSet = new Set(res?.data?.map((item) => String(item?._id)));
                    setDueUsers((prev) => {
                        const prevSignature = Array.from(prev).sort().join('|');
                        const nextSignature = Array.from(nextDueSet).sort().join('|');
                        return prevSignature === nextSignature ? prev : nextDueSet;
                    });
                    return;
                }
                setDueUsers((prev) => (prev.size ? new Set() : prev));
            })
            .catch(() => {
                setDueUsers((prev) => (prev.size ? new Set() : prev));
            });
    }, [filteredUserIdsSignature]);

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
                                onClick={() => {
                                    setRenue(false);
                                    setIsEdit(false);
                                    setEmployeId(null);
                                    setEditingMemberId('');
                                    form.resetFields();
                                    setOpen(true);
                                }}
                                className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                            >
                                <FiPlus size={14} />
                                {i18n?.t('Add Member')}
                            </Button>
                        </div>
                    )}
                    actions={(d) => (
                        <div className='flex items-center gap-2'>
                            <button
                                className='flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-lg shadow-sm text-gray-500 hover:text-[#F97316] hover:border-[#F97316] hover:bg-[#F97316]/10 transition-all'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingMemberId(d?._id);
                                    setIsEdit(true);
                                    setRenue(false);
                                    form.setFieldsValue({
                                        name: d?.name,
                                        email: d?.email,
                                        phone: d?.phone,
                                        password: undefined,
                                        confirm_password: undefined,
                                        subscription: undefined,
                                        subscriptionType: undefined,
                                        paymentMethod: undefined,
                                        currency: undefined,
                                        paidAmount: undefined,
                                    });
                                    setOpen(true);
                                }}
                                title={i18n.t('Edit')}
                            >
                                <FiEdit2 size={13} />
                            </button>
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
                            {dueUsers.has(String(d?._id)) && (
                                <button
                                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white transition-all duration-300 text-[11px] font-bold shadow-sm bg-white whitespace-nowrap'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenPayDue(d?._id);
                                    }}
                                    disabled={payDueLoading}
                                >
                                    <FiRefreshCw size={12} />
                                    {i18n.t('Pay Due')}
                                </button>
                            )}
                        </div>
                    )}
                    onDelete={removeUser}
                />
            </div>

            <Modal
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setRenue(false);
                    setIsEdit(false);
                    setEmployeId(null);
                    setEditingMemberId('');
                    form.resetFields();
                }}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className={`w-8 h-8 rounded-lg ${renue ? 'bg-orange-100 text-orange-500' : 'bg-[#F97316]/10 text-[#F97316]'} flex items-center justify-center`}>
                            {renue ? <FiRefreshCw size={16} /> : <FiUser size={16} />}
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">{renue ? i18n?.t('Renew Subscription') : isEdit ? i18n?.t('Edit Member') : i18n?.t('Add Member')}</span>
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
                                paidAmount: values?.paidAmount,
                            });
                            if (error === false) {
                                message.success(msg);
                                setRenue(false);
                                setEmployeId(undefined);
                                setOpen(false);
                                getData();
                                form.resetFields();
                            }
                        } else if (isEdit) {
                            const { error, msg } = await adminUpdateUser({
                                _id: editingMemberId,
                                role: 'user',
                                name: values?.name,
                                phone: values?.phone,
                                email: values?.email,
                            });
                            if (error === false) {
                                message.success(msg);
                                setOpen(false);
                                setIsEdit(false);
                                setEditingMemberId('');
                                getData();
                                form.resetFields();
                            } else {
                                message.error(msg);
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
                                    paidAmount: values?.paidAmount,
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
                            {!isEdit && (
                                <>
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
                        </>
                    )}
                    {!isEdit && (
                        <>
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
                                <FormInput
                                    name='paidAmount'
                                    label='Paid Amount'
                                    type='number'
                                    placeholder='Enter paid amount (optional)'
                                />
                            </div>
                            <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 text-[11px] text-gray-600">
                                <span className="font-semibold text-gray-700">Plan Price:</span>{' '}
                                {selectedPlan && selectedSubscriptionType ? (
                                    <span className="font-bold text-[#F97316]">
                                        {displayCurrencySymbol}{displayPrice}
                                        <span className="ml-1 text-[10px] font-semibold text-gray-500 uppercase">
                                            {selectedSubscriptionType}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="text-gray-400">Select a plan and type to see price</span>
                                )}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">
                                Leave Paid Amount empty to mark as fully paid. Enter a smaller amount to mark as partial payment.
                            </p>
                        </>
                    )}
                    
                    <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                setRenue(false);
                                setIsEdit(false);
                                setEmployeId(null);
                                setEditingMemberId('');
                                form.resetFields();
                            }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-sm shadow-[#F97316]/20 !font-semibold !rounded-lg block w-fit !text-xs'
                        >
                            {renue ? <FiRefreshCw size={14} /> : isEdit ? <FiEdit2 size={14} /> : <FiPlus size={14} />}
                            {renue ? i18n?.t('Confirm Renew') : isEdit ? i18n?.t('Save Changes') : i18n?.t('Save Details')}
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
                        <Button type='submit' loading={loading} className="!px-5 !py-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg block w-fit !text-xs">
                            {i18n?.t('Reset Pass')}
                        </Button>
                    </div>
                </Form>
            </Modal>

            <Modal
                open={payDueOpen}
                onCancel={() => {
                    setPayDueOpen(false);
                    setDueSubscription(null);
                    payDueForm.resetFields();
                }}
                footer={null}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                            <FiRefreshCw size={16} />
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">{i18n?.t('Pay Due Amount')}</span>
                        </div>
                    </div>
                }
                destroyOnClose={true}
                className="rounded-xl"
                width={420}
                styles={{ content: { padding: '20px' } }}
            >
                <Form
                    form={payDueForm}
                    layout="vertical"
                    onFinish={async (values) => {
                        if (!dueSubscription?._id) {
                            message.error(i18n?.t('Subscription not found'));
                            return;
                        }
                        const { error, msg } = await paySubscriptionDueByAdmin({
                            subscriptionId: dueSubscription._id,
                            paidAmount: values?.paidAmount,
                            paymentMethod: values?.paymentMethod,
                        });
                        if (error === false) {
                            message.success(msg);
                            setPayDueOpen(false);
                            setDueSubscription(null);
                            payDueForm.resetFields();
                            getData();
                        } else {
                            message.error(msg);
                        }
                    }}
                    className="mt-3 space-y-3"
                >
                    <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 text-[11px] text-gray-600">
                        <span className="font-semibold text-gray-700">{i18n?.t('Due Amount')}:</span>{' '}
                        <span className="font-bold text-amber-600">
                            {getCurrencySymbol(dueSubscription?.currency) || currencySymbol}
                            {getDueAmountFromSubscription(dueSubscription).currentDue}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2">
                        <FormInput
                            name='paidAmount'
                            label={i18n?.t('Paid Amount')}
                            type='number'
                            placeholder={i18n?.t('Enter paid amount')}
                            required={true}
                        />
                        <FormSelect
                            name='paymentMethod'
                            label={i18n?.t('Payment Method')}
                            options={[
                                ...(payMethods?.docs?.map((method) => ({
                                    label: method?.name,
                                    value: method?.type,
                                })) || []),
                                { label: 'Cash', value: 'cash' },
                            ]}
                            placeholder={i18n?.t('Select Method')}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={() => {
                                setPayDueOpen(false);
                                setDueSubscription(null);
                                payDueForm.resetFields();
                            }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            {i18n?.t('Cancel')}
                        </Button>
                        <Button
                            type='submit'
                            className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-sm shadow-amber-200/60 !font-semibold !rounded-lg block w-fit !text-xs !bg-amber-500 hover:!bg-amber-600'
                        >
                            <FiRefreshCw size={14} />
                            {i18n?.t('Pay Due')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default UsersPageContent;

