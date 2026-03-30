"use client"
import React, { useEffect } from 'react';
import { useFetch } from '../../../../../../../helpers/hooks';
import { fetchMembers } from '../../../../../../../helpers/backend';
import ListItem from './listItem';
import { Empty } from 'antd';
import Button from '../../../../../../../../components/common/button';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../../../../../providers/i18n';

const FitnessGroupsTable = ({ params }) => {
    const [data, getData] = useFetch(fetchMembers, {}, false)
    const router = useRouter()
    const i18n = useI18n();
 
    useEffect(() => {
        if (params?._id) {
            getData({ _id: params?._id })
        }
    }, [params?._id])

    return (
        <div className="bg-white w-full overflow-x-auto">
            <div className='flex justify-between items-center mb-6'>
                <h3 className='text-xl font-bold text-slate-800 tracking-tight' >{i18n?.t("View Group Member")}</h3>
                <Button onClick={() => router.back()} type="button" className='!h-fit !py-2.5 !px-6 rounded-xl shadow-sm'>{i18n?.t("Back")}</Button>
            </div>
            <div className='w-full overflow-x-scroll hide-scrollbar '>
                {
                    data?.docs?.[0]?.members?.length > 0 ? <ListItem data={data} /> : <Empty />
                }
            </div>
        </div>
    );
}

export default FitnessGroupsTable;
