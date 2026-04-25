'use client'
import React, { useEffect } from 'react';
import { useFetch } from '../../../../../../../helpers/hooks';
import { fetchNutritionDetail } from '../../../../../../../helpers/backend';
import dayjs from "dayjs"
import { useI18n } from '../../../../../../../providers/i18n';
import Button from '../../../../../../../../components/common/button';
import { useRouter } from 'next/navigation';

const Details = ({ params }) => {
    const [data, getData] = useFetch(fetchNutritionDetail, {}, false);
   const i18n = useI18n();
   const {push} =useRouter()
    useEffect(() => {
        getData({ _id: params?._id });
    }, [params?._id]);
    return (
        <div className='bg-white w-full'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-slate-800 tracking-tight' >{i18n?.t("View nutrition schedule")}</h2>
                <Button onClick={() => push('/trainer/nutrition-schedule')} type="button" className='!h-fit !py-2.5 !px-6 rounded-xl shadow-sm'>{i18n?.t("Back")}</Button>
            </div>
            <div className='w-[684px] md:w-full overflow-x-scroll mt-5 pb-8'>
                <div className='grid grid-cols-5 w-full px-5 bg-[#F97316] text-white font-medium text-base py-4 '>
                    <p className='whitespace-pre text-center'>{i18n?.t('Day Name')}</p>
                    <p className='whitespace-pre text-center'>{i18n?.t('Type')}</p>
                    <p className='whitespace-pre text-center'>{i18n?.t('Description')}</p>
                    <p className='whitespace-pre text-center'>{i18n?.t('Start Date')}</p>
                    <p className='whitespace-pre text-center'>{i18n?.t('End Date')}</p>
                </div>
                <div className='grid grid-cols-5 w-full  font-medium text-base   '>
                    <div className='flex flex-col text-center items-center border-[1px] text-base font-medium text-[#534C4C] capitalize py-4 gap-[14px] border-[#D9D9D9]'>{data?.selected_days?.map(day => (<span>{day}</span>))}</div>
                    <div className='flex flex-col text-center items-center border-[1px] text-base font-medium text-[#534C4C] capitalize py-4 gap-[14px] border-[#D9D9D9]'>{data?.nutrition?.map(day => (<span>{day?.type}</span>))}</div>
                    <div className='flex flex-col text-center items-center  border-[1px] text-base font-medium text-[#534C4C] capitalize py-4 gap-[14px] border-[#D9D9D9]'>{data?.nutrition?.map(day => (<span>{day?.description}</span>))}</div>
                    <div className='flex flex-col text-center items-center border-[1px] text-base font-medium text-[#534C4C] capitalize py-4 gap-[14px] border-[#D9D9D9]'>{dayjs(data?.start_date)?.format('DD-MM-YYYY')}</div>
                    <div className='flex flex-col text-center items-center border-[1px] text-base font-medium text-[#534C4C] capitalize py-4 gap-[14px] border-[#D9D9D9]'>{dayjs(data?.end_date)?.format('DD-MM-YYYY')}</div>
                </div>
            </div>
        </div>
    );
};

export default Details;