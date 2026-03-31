'use client'
import React, { useEffect, } from 'react';
import { fetchBlogTrainerdetails } from '../../../../../../../helpers/backend';
import { useFetch } from '../../../../../../../helpers/hooks';
import { useI18n } from '../../../../../../../providers/i18n';
import { columnFormatter } from '../../../../../../../helpers/utils';
import Image from 'next/image';
import Button from '../../../../../../../../components/common/button';
import { useRouter } from 'next/navigation';

const BlogDetails = ({ params }) => {
    const i18n = useI18n()
    const [data, getData] = useFetch(fetchBlogTrainerdetails, {}, false);
    const {push} =useRouter()
    useEffect(() => {
        if (params?._id) {
            getData({ _id: params?._id })
        }
    }, [params?._id])

    return (
        <div className="bg-white">
            <div className='flex justify-between items-center mb-6'>
                <h3 className='text-xl font-bold text-slate-800 tracking-tight'>{i18n?.t("Blog Details")}</h3>
                <Button onClick={() => push('/trainer/blog')} type="button" className='!h-fit !py-2.5 !px-6 rounded-xl shadow-sm'>{i18n?.t("Back")}</Button>
            </div>
                <div className="container mx-auto block pb-10">
                    <div className="lg:pr-10 px-5">
                            <div className="">
                            <div className="w-full py-5">
                                <Image width={1000} height={1000} className="w-full rounded-md h-[400px] object-cover" src={data?.image || '/defaultimg.png'} alt="image" />
                            </div>
                            <div className="">
                                <h1 className=" font-bold text-2xl py-2 font-montserrat text-[#2b2b2b]">{columnFormatter(data?.title)}</h1>
                                <p className='description my-2 font-poppins'>
                                    {columnFormatter(data?.short_description)}
                                </p>
                                <div className="py-5 description text-secondary_text"
                                    dangerouslySetInnerHTML={{
                                        __html: columnFormatter(data?.details),
                                    }}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <h1 className='description'>{i18n.t("Tags")}:</h1>
                                    <div className="ps-5">
                                        <span className="font-semibold px-3 header_7">{
                                            data?.tags?.map((item) => (
                                                <span className='whitespace-pre' key={item?._id}>#{columnFormatter(item?.name)} </span>
                                            ))
                                        }</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default BlogDetails;
