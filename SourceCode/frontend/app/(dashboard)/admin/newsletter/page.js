'use client';

import React from 'react';
import Table from '../../components/form/table'
import { useFetch } from '../../../helpers/hooks';
import { delAdminNewsletter, fetchAdminNewsletter } from '../../../helpers/backend';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';
import { FiMail, FiCalendar } from 'react-icons/fi';

const Page = () => {
  const [data, getData, { loading }] = useFetch(fetchAdminNewsletter);

  const columns = [
    {
      text: 'Subscriber Email',
      dataField: 'email',
      formatter: (_, d) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center flex-shrink-0">
            <FiMail size={12} />
          </div>
          <span className="text-xs font-bold text-gray-700">{d?.email}</span>
        </div>
      ),
    },
    {
      text: 'Subscribed On',
      dataField: 'createdAt',
      formatter: (_, d) => (
        <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
          <FiCalendar className="text-gray-400" size={10} />
          {dayjs(d?.createdAt).format('DD MMM YYYY')}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
      <div className="mb-4">
        <PageTitle title="Newsletter Subscribers" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
        <Table
          data={data}
          indexed
          pagination
          columns={columns}
          loading={loading}
          onReload={getData}
          onDelete={delAdminNewsletter}
          shadow={false}
        />
      </div>
    </div>
  );
}

export default Page
