"use client";
import React from 'react';
import { FaUsers, FaBell } from 'react-icons/fa';
import Image from 'next/image';
import { FaPeopleGroup } from 'react-icons/fa6';
import { fetchTrainerGroupList, fetchTrainerNotice } from '../../../../helpers/backend';
import { useFetch } from '../../../../helpers/hooks';
import TrainerTable from '../../../../../components/form/trainerTable';
import { useI18n } from '../../../../providers/i18n';
import { useRouter } from 'next/navigation';
import { columnFormatter } from '../../../../helpers/utils';

const TrainerDashboard = () => {
  const [data, getData] = useFetch(fetchTrainerGroupList)
  const [notice] = useFetch(fetchTrainerNotice);
  const i18n = useI18n();
  const { push } = useRouter();
  const columns = [
    {
      text: i18n?.t("Photo"),
      dataField: "image",
      formatter: (_, d) => <Image src={d?.image ? d?.image : "/defaultimg.jpg"} width={50} height={50} alt={d?.name || "image"} className='rounded-full sm:w-[56px] sm:h-[56px] w-[40px] h-[40px]' />,
    },
    {
      text: i18n?.t("Group Name"),
      dataField: "name",
      formatter: (_, d) => <span>{columnFormatter(d?.name)}</span>,
    },
    {
      text: i18n?.t("Group Members"),
      dataField: "members",
      formatter: (_, d) => <span>{d?.members?.length}</span>,
    },

  ];
  return (
    <div className="w-full">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Groups Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#5572fc] to-indigo-600 rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
            <FaPeopleGroup className="text-9xl text-white" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-white/80 font-medium text-sm mb-1 uppercase tracking-wider">{i18n?.t("Total Groups")}</p>
              <h3 className="text-white font-bold text-4xl drop-shadow-sm">{data?.docs?.length || 0}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner text-white">
              <FaPeopleGroup className="text-3xl" />
            </div>
          </div>
        </div>

        {/* Notice Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
            <FaBell className="text-9xl text-white" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-white/80 font-medium text-sm mb-1 uppercase tracking-wider">{i18n?.t("Recent Notices")}</p>
              <h3 className="text-white font-bold text-4xl drop-shadow-sm">{notice?.docs?.length || 0}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner text-white">
              <FaBell className="text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200/80 bg-white">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#5572fc] rounded-full inline-block"></span>
            {i18n?.t("Group List")}
          </h2>
        </div>
        <div className="p-4 sm:p-6 bg-white">
          <TrainerTable
            data={data}
            columns={columns}
            onReload={getData}
            onView={(data) => push(`/trainer/group/list/${data?._id}`)}
            noHeader
            pagination
          />
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
