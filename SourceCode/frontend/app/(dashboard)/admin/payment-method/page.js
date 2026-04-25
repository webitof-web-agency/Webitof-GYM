"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useFetch } from '../../../helpers/hooks';
import { delPaymentMethod, fetchPaymentMethods } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';
import { FiPlus, FiCreditCard, FiCalendar, FiBox } from 'react-icons/fi';

const PaymentMethods = () => {
    const { push } = useRouter()
    const i18n = useI18n()
    const [paymentMethod, getPaymentMethod, { loading }] = useFetch(fetchPaymentMethods)
    
    const columns = [
        {
            text: 'Gateway Integrator',
            dataField: 'name',
            formatter: (name, d) => (
                 <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 text-gray-500">
                          <FiCreditCard size={18} />
                      </div>
                      <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-[13px] capitalize">{name}</span>
                          <span className="text-[10px] font-bold text-[#F97316] mt-0.5 tracking-widest uppercase flex items-center gap-1">
                              <FiBox size={10}/> Provider: {d?.type}
                          </span>
                      </div>
                 </div>
            )
        },
        {
            text: 'Date Registered',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
    ]

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="mb-2">
                <PageTitle title='Payment Core Gateways' />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={paymentMethod}
                    action={(
                        <Button onClick={() => push('/admin/payment-method/add')} className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap">
                            <FiPlus size={14} /> {i18n?.t("Map Gateway")}
                        </Button>
                    )}
                    onEdit={({ _id }) => push('/admin/payment-method/edit/' + _id)}
                    onDelete={delPaymentMethod}
                    onReload={getPaymentMethod}
                    loading={loading}
                    pagination
                    indexed
                    shadow={false}
                />
            </div>
        </div>
    );
};

export default PaymentMethods;
