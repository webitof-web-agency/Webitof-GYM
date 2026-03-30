'use client';
import { useState } from 'react';
import { Rate, Switch } from 'antd';
import { delAdminTestimonial, detailsTestimonial, fetchAdminTestimonial, postAdminTestimonial } from '../../../helpers/backend';
import { useActionConfirm, useFetch } from '../../../helpers/hooks';
import Table from '../../components/form/table';
import { useI18n } from '../../../providers/i18n';
import TestimonialModal from './testimonialDetails';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';
import { FiCalendar, FiStar } from 'react-icons/fi';

const Page = () => {
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchAdminTestimonial);
    const [details, getDetails] = useFetch(detailsTestimonial, {}, false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    const columns = [
        {
            text: 'Reviewer',
            dataField: 'user',
            formatter: (_, d) => (
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-800 text-xs capitalize">{d?.user?.name || 'Anonymous'}</span>
                    {d?.user?.email && (
                        <span className="text-[10px] text-gray-400 font-medium truncate max-w-[160px]">{d?.user?.email}</span>
                    )}
                </div>
            ),
        },
        {
            text: 'Rating',
            dataField: 'rating',
            formatter: (_, d) => (
                <div className="flex items-center gap-2">
                    <Rate className='!text-[#5572fc] !text-xs' disabled defaultValue={d?.rating} />
                    <span className="text-[10px] font-bold text-gray-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                        {d?.rating}.0
                    </span>
                </div>
            ),
        },
        {
            text: 'Review',
            dataField: 'description',
            formatter: (_, d) => (
                <span className="text-xs text-gray-600 line-clamp-2 max-w-[220px] leading-relaxed">
                    {d?.description || '—'}
                </span>
            ),
        },
        {
            text: 'Submitted',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: 'Visibility',
            dataField: 'active',
            formatter: (_, d) => (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-1.5 px-2.5 w-fit gap-3">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">{d?.active ? 'VISIBLE' : 'HIDDEN'}</span>
                    <Switch
                        size="small"
                        checked={d?.active}
                        onChange={async (e) => {
                            await useActionConfirm(postAdminTestimonial, { _id: d._id, active: e });
                            getData();
                        }}
                        className="!m-0"
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title="Testimonial Reviews" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    indexed
                    pagination
                    onDelete={delAdminTestimonial}
                    onView={(data) => {
                        getDetails({ _id: data._id });
                        openModal();
                    }}
                />
            </div>

            {details && (
                <TestimonialModal
                    visible={isModalVisible}
                    onClose={closeModal}
                    testimonial={details}
                />
            )}
        </div>
    );
};

export default Page;
