'use client';
import { paySubscriptionDueByAdmin, subscriptionHistory, fetchUserPaymentMethods } from '../../../helpers/backend';
import { useFetch } from '../../../helpers/hooks';
import PageTitle from '../../components/common/page-title';
import { columnFormatter } from '../../../helpers/utils';
import dayjs from 'dayjs';
import Table from '../../components/form/table';
import { useState } from 'react';
import SubscriptionModal from './subscriptionDetails';
import { useCurrency } from '../../../contexts/site';
import { FiCalendar } from 'react-icons/fi';
import { Form, message, Modal } from 'antd';
import FormInput from '../../../../components/form/input';
import FormSelect from '../../components/form/select';

const Page = () => {
    const [data, getData, { loading }] = useFetch(subscriptionHistory);
    const [payMethods] = useFetch(fetchUserPaymentMethods);
    const {currencySymbol, getCurrencySymbol} = useCurrency()
    const [details, setDetails] = useState(null)
    const [isVisible, setIsvisible] = useState(false);
    const [payDueOpen, setPayDueOpen] = useState(false);
    const [dueSubscription, setDueSubscription] = useState(null);
    const [payDueForm] = Form.useForm();

    const getDueAmountFromSubscription = (subscription) => {
        const totalAmount = subscription?.payment?.amount ?? subscription?.price ?? 0;
        const currentPaid =
            subscription?.payment?.paid_amount ??
            (subscription?.payment?.status === 'paid' ? totalAmount : 0);
        const currentDue =
            subscription?.payment?.due_amount ?? Math.max(totalAmount - currentPaid, 0);
        return { totalAmount, currentPaid, currentDue };
    };
    
    const columns = [
        {
            text: 'Purchase Date',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: 'Member Subscriber',
            dataField: 'user',
            formatter: (_, d) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-xs truncate max-w-[180px] capitalize leading-tight">
                        {d?.user?.name ? d?.user?.name : "Deleted Account"}
                    </span>
                    {d?.user?.email && (
                        <span className="text-[10px] text-gray-400 font-medium tracking-wide truncate max-w-[180px] mt-0.5">
                            {d?.user?.email}
                        </span>
                    )}
                </div>
            ),
        },
        {
            text: 'Plan Breakdown',
            dataField: 'subscription',
            formatter: (_, d) => (
                <div className="flex flex-col">
                    <span className="font-bold text-[#5572fc] text-xs capitalize truncate max-w-[150px] leading-tight flex items-center gap-1">
                        {d?.subscription?.name ? columnFormatter(d?.subscription?.name) : "Deleted Plan"}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold tracking-wide mt-1 uppercase bg-slate-50 border border-slate-100 px-1.5 w-fit rounded">
                        COST: {currencySymbol}{d?.price}
                    </span>
                </div>
            ),
        },
        {
            text: 'Billing Lifecycle',
            dataField: 'period',
            formatter: (_, d) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-medium text-gray-500">
                        <span className="w-[30px] font-bold text-gray-400 uppercase">From</span>
                        <span className="bg-slate-50 px-1.5 rounded border border-slate-100">{dayjs(d?.start_date).format('DD MMM YYYY')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-medium text-gray-500">
                        <span className="w-[30px] font-bold text-gray-400 uppercase">To</span>
                        <span className="bg-slate-50 px-1.5 rounded border border-slate-100">{dayjs(d?.end_date).format('DD MMM YYYY')}</span>
                    </div>
                </div>
            )
        },
        {
            text: 'Live Status',
            dataField: 'status',
            formatter: (_, d) => (
                <div className="flex flex-col gap-1.5 items-start">
                    {d?.payment?.status === "paid" ? (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100/50">
                            PAID IN FULL
                        </span>
                    ) : d?.payment?.status === "partial" ? (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase bg-amber-50 text-amber-600 border border-amber-100/50">
                            PARTIAL PAID
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase bg-orange-50 text-orange-600 border border-orange-100/50">
                            PAYMENT PENDING
                        </span>
                    )}
                    
                    {d?.active ? (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100/50 shadow-sm shadow-emerald-100/50">
                            PLAN ACTIVE
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase bg-rose-50 text-rose-600 border border-rose-100/50 shadow-sm shadow-rose-100/50">
                            EXPIRED
                        </span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title={'Member Subscription History'} />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table 
                    data={data}
                    columns={columns}
                    loading={loading}
                    pagination
                    indexed
                    onReload={getData}
                    onView={(d) => {setDetails(d);setIsvisible(true)}}
                    actions={(d) => {
                        const dueInfo = getDueAmountFromSubscription(d);
                        if (dueInfo.currentDue <= 0) return null;
                        return (
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white transition-all duration-300 text-[11px] font-bold shadow-sm bg-white whitespace-nowrap"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDueSubscription(d);
                                    setPayDueOpen(true);
                                    payDueForm.setFieldsValue({
                                        paidAmount: dueInfo.currentDue,
                                        paymentMethod: d?.payment?.method || 'cash',
                                    });
                                }}
                            >
                                Pay Due
                            </button>
                        );
                    }}
                />
            </div>
            
            {details && (
                <SubscriptionModal 
                    subscriptionData={details} 
                    onClose={() => {
                        setDetails(null)
                        setIsvisible(false)
                    }} 
                    isVisible={isVisible}
                />
            )}

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
                            Pay
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">Pay Due Amount</span>
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
                            message.error('Subscription not found');
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
                        <span className="font-semibold text-gray-700">Due Amount:</span>{' '}
                        <span className="font-bold text-amber-600">
                            {getCurrencySymbol(dueSubscription?.currency) || currencySymbol}
                            {getDueAmountFromSubscription(dueSubscription).currentDue}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2">
                        <FormInput
                            name='paidAmount'
                            label='Paid Amount'
                            type='number'
                            placeholder='Enter paid amount'
                            required={true}
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
                            placeholder='Select Method'
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => {
                                setPayDueOpen(false);
                                setDueSubscription(null);
                                payDueForm.resetFields();
                            }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-sm shadow-amber-200/60 !font-semibold !rounded-lg block w-fit !text-xs !bg-amber-500 hover:!bg-amber-600'
                        >
                            Pay Due
                        </button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Page;
