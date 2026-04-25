"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { fetchBlog } from '../../../../../helpers/backend';
import { useFetch } from '../../../../../helpers/hooks';
import { useI18n } from '../../../../../providers/i18n';
import { columnFormatter } from '../../../../../helpers/utils';
import PageTitle from '../../../../components/common/page-title';
import CommentSection from '../../../../../(site)/(pages)/blog/view/[_id]/comment';
import { FiArrowLeft, FiCalendar, FiTag, FiFolder } from 'react-icons/fi';
import dayjs from 'dayjs';

const AdminBlogView = () => {
    const params = useParams();
    const router = useRouter();
    const [data, getData] = useFetch(fetchBlog, {}, false);
    const i18n = useI18n();

    useEffect(() => {
        if (params?._id) getData({ _id: params._id });
    }, [params?._id]);

    const imageSrc = typeof data?.image === 'string' ? data.image : '';

    return (
        <div className="max-w-[1200px] mx-auto space-y-4 animate-fade-in relative z-0 pb-10">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-start gap-4">
                    <button 
                        onClick={() => router.push('/admin/blog')} 
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-gray-500 hover:bg-slate-50 hover:text-gray-800 transition-colors shadow-sm shrink-0"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <div className="flex flex-col pt-0.5">
                        <PageTitle title="Blog Article Verification" className="!mb-0 !pb-0" />
                        <span className="text-[11px] text-gray-500 font-medium">Verify production rendering structure and comments tracking</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
                {imageSrc ? (
                    <div className="relative w-full h-[300px] md:h-[450px]">
                        <Image
                            fill
                            className="object-cover"
                            src={imageSrc}
                            alt="blog cover header"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                         <div className="absolute bottom-6 left-6 right-6 lg:left-10 lg:right-10 flex items-center gap-3">
                              <span className="bg-[#F97316] text-white px-3 py-1 rounded text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-md">
                                  <FiFolder size={12}/> {columnFormatter(data?.category?.name) || 'Category'}
                              </span>
                              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                                  <FiCalendar size={12}/> {data?.createdAt ? dayjs(data?.createdAt).format('MMMM DD, YYYY') : '--'}
                              </span>
                         </div>
                    </div>
                ) : (
                    <div className="w-full h-[200px] bg-slate-50 border-b border-slate-100 flex items-center justify-center text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-widest">{i18n?.t('No Cover Image Initialized')}</span>
                    </div>
                )}
                
                <div className="p-6 md:p-10">
                     <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
                         {columnFormatter(data?.title)}
                     </h1>
                     
                     {data?.short_description && (
                         <div className="border-l-4 border-[#F97316] pl-4 py-1 mb-6">
                            <p className="text-lg text-gray-600 font-medium leading-relaxed italic">
                                "{columnFormatter(data?.short_description)}"
                            </p>
                         </div>
                     )}
                     
                     <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 mt-8 font-medium leading-[1.8]"
                          dangerouslySetInnerHTML={{ __html: columnFormatter(data?.details) }}
                     />
                     
                     {data?.tags && data.tags.length > 0 && (
                         <div className="mt-10 pt-6 border-t border-slate-100 flex items-center flex-wrap gap-2">
                             <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mr-2 flex items-center gap-1">
                                 <FiTag size={12}/> Associated Indices:
                             </span>
                             {data.tags.map((item) => (
                                 <span key={item?._id} className="bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full text-xs font-bold transition-all hover:bg-orange-100 cursor-default">
                                     #{columnFormatter(item?.name)?.replace(/\s+/g, '')}
                                 </span>
                             ))}
                         </div>
                     )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 p-6 md:p-10 !mt-6">
                <CommentSection commentsList={data?.comments} blogId={params?._id} getData={getData} />
            </div>
        </div>
    );
};

export default AdminBlogView;
