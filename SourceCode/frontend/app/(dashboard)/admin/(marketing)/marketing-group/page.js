"use client"
import React from 'react';
import PageTitle from '../../../components/common/page-title';
import Group from './group';
import { useFetch } from '../../../../helpers/hooks';
import { fetchMarketingGroupList } from '../../../../helpers/backend';

const page = () => {
    const [data, getData, { loading }] = useFetch(fetchMarketingGroupList);
    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title={"Marketing Groups"} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                 <Group data={data} getData={getData} loading={loading} />
            </div>
        </div>
    )
}

export default page;