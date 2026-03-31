'use client';
import { subscriptionHistory } from '../../../helpers/backend';
import { useFetch } from '../../../helpers/hooks';
import PageTitle from '../../components/common/page-title';
import { columnFormatter } from '../../../helpers/utils';
import dayjs from 'dayjs';
import Table from '../../components/form/table';
import { useState } from 'react';
import SubscriptionModal from './subscriptionDetails';
import { useCurrency } from '../../../contexts/site';
import { FiCalendar } from 'react-icons/fi';

const Page = () => {
    const [data, getData, { loading }] = useFetch(subscriptionHistory);
    const {currencySymbol} = useCurrency()
    const [details, setDetails] = useState(null)
    const [isVisible, setIsvisible] = useState(false);
    
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
        </div>
    );
};

export default Page;
