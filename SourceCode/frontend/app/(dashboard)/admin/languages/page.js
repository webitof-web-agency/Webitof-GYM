"use client";
import React from 'react';
import { Switch } from 'antd';
import { useRouter } from 'next/navigation';
import { PiTranslate } from "react-icons/pi";
import Button from '../../../../components/common/button';
import Table from '../../components/form/table';
import { useActionConfirm, useFetch } from '../../../helpers/hooks';
import { delLanguage, fetchLanguages, postLanguage } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';
import { FiPlus, FiGlobe, FiCalendar, FiFlag, FiLayers, FiSettings, FiCheckCircle } from 'react-icons/fi';

const Languages = () => {
    const i18n = useI18n()
    const { push } = useRouter()
    const [languages, getLanguages, { loading }] = useFetch(fetchLanguages)
    
    let columns = [
        { 
            text: 'Dialect Identity', 
            dataField: 'name',
            formatter: (name, d) => (
                 <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 relative group text-2xl">
                          {d?.flag ? (
                              <span>{d?.flag}</span>
                          ) : (
                              <FiGlobe className="text-slate-300" size={18} />
                          )}
                      </div>
                      <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-[13px] capitalize">{name}</span>
                          <span className="text-[9px] font-bold text-[#F97316] mt-0.5 tracking-widest uppercase flex items-center gap-1">
                              <FiSettings size={9}/> Locale Code: {d?.code}
                          </span>
                      </div>
                 </div>
            ) 
        },
        {
            text: 'System Activation',
            dataField: 'active',
            formatter: (_, d) => (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                         <Switch
                             checked={d?.active}
                             onChange={async (e) => await useActionConfirm(postLanguage, { _id: d._id, active: e }, getLanguages, ('Are you sure you want to change status?'), 'Yes, Change')}
                             size="small"
                             className="bg-gray-300 shadow-sm"
                         />
                         <span className="text-[10px] font-bold text-gray-500 uppercase">Live Translation</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <Switch
                             checked={d?.default}
                             onChange={async (e) => await useActionConfirm(postLanguage, { _id: d._id, default: e }, getLanguages, ('Are you sure you want to change default language?'), 'Yes, Change')}
                             size="small"
                             className="bg-gray-300 shadow-sm"
                         />
                         <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1"><FiCheckCircle size={10}/> Default Mode</span>
                    </div>
                </div>
            )
        },
        {
            text: 'Layout Constraints', 
            dataField: 'rtl', 
            formatter: (_, d) => (
                <span className={`text-[10px] font-bold uppercase border px-2.5 py-1 rounded inline-flex items-center gap-1.5 shadow-sm ${d?.rtl ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    <FiLayers size={11} /> {d?.rtl ? 'Right-To-Left (RTL)' : 'Left-To-Right (LTR)'}
                </span>
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

    let actions = ({ _id }) => (
        <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[#F97316] hover:bg-[#F97316]/5 hover:border-[#F97316]/30 transition-all duration-300 text-[11px] font-bold shadow-sm bg-white whitespace-nowrap"
            title="Edit Translations" 
            onClick={(e) => { e.stopPropagation(); push('/admin/languages/translations/' + _id); }}
        >
            <PiTranslate size={14} /> Translate Strings
        </button>
    )

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="mb-2">
                <PageTitle title='Localization Registry' />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={{
                        ...languages,
                        docs: languages?.docs?.map(doc => ({
                            ...doc,
                            disableDelete: doc.code === 'en' ? 1 : 0,
                        })),
                    }}
                    onReload={getLanguages}
                    loading={loading}
                    pagination
                    indexed
                    action={(
                        <Button onClick={() => push('/admin/languages/add')} className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap">
                            <FiPlus size={14} /> {i18n?.t("Add Dictionary")}
                        </Button>
                    )}
                    onEdit={({ _id }) => push('/admin/languages/edit/' + _id)}
                    onDelete={delLanguage}
                    actions={actions}
                    shadow={false}
                />
            </div>
        </div>
    );
};

export default Languages;
