"use client"
import { Image } from 'antd';
import React, { useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { singleProductAdmin } from "../../../../../helpers/backend";
import { useFetch } from '../../../../../helpers/hooks';
import { useI18n } from '../../../../../providers/i18n';
import { useCurrency } from '../../../../../contexts/site';
import { FiBox, FiTag, FiFileText, FiImage, FiLayers, FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const page = ({ params }) => {
    const i18n = useI18n()
    const router = useRouter()
    let { langCode } = useI18n();
    const [data, getData] = useFetch(singleProductAdmin, {}, false)
    const {currencySymbol} = useCurrency()
    
    const resolveLocalizedValue = (value) => {
        if (!value) return '-';
        if (typeof value === 'string') return value;
        return value?.[langCode] || value?.en || Object.values(value)?.[0] || '-';
    };
    
    const productTitle = resolveLocalizedValue(data?.product?.name);
    const productDescription = resolveLocalizedValue(data?.product?.description);
    const productShortDescription = resolveLocalizedValue(data?.product?.short_description);
    const productCategory = resolveLocalizedValue(data?.product?.category?.name);

    useEffect(() => {
        getData({ _id: params?.id })
    }, [params?.id, getData])

    return (
        <div className="max-w-[1200px] mx-auto pb-10 animate-fade-in relative">
            <div className="flex items-center gap-4 mb-5">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-lg shadow-sm text-gray-500 hover:text-[#F97316] hover:border-[#F97316] transition-all"
                >
                    <FaArrowLeft size={14} />
                </button>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-none relative top-[1px]">Product View</h1>
            </div>

            {/* Profile Header Block */}
            <div className='w-full bg-white relative pb-6 rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden mb-6 mt-2'>
                <div className="h-32 w-full bg-gradient-to-br from-[#F97316] to-[#FB923C] relative">
                     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                     <div className="absolute bottom-3.5 left-[160px] z-10 w-[calc(100%-180px)] pr-4">
                         <h2 className="text-2xl font-bold text-white tracking-wide leading-none drop-shadow-sm truncate">{productTitle !== '-' ? productTitle : "Loading Details..."}</h2>
                     </div>
                </div>
                
                <div className='absolute top-16 left-8 z-10'>
                    <div className="p-1.5 bg-white rounded-2xl shadow-md w-fit">
                        <Image
                            src={data?.product?.thumbnail_image || "/defaultimg.jpg"}
                            width={110}
                            height={110}
                            alt='product thumbnail'
                            className='!w-[110px] !h-[110px] rounded-xl object-cover border-[3px] border-slate-50'
                        />
                    </div>
                </div>

                <div className='pt-3 pl-[160px] pr-8 pb-4 flex justify-between items-start'>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-[#F97316]/10 text-[#F97316] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                            <FiBox size={10} />
                            {productCategory}
                        </span>
                        {data?.product?.is_active ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                PUBLISHED
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-100/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                HIDDEN
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm mt-0.5 relative -top-[1px]">
                            {currencySymbol}{data?.product?.price}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                
                {/* Product Specifications Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100/80 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center font-bold">
                            <FiTag size={16} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-none">{i18n?.t("Product Metrics")}</h3>
                    </div>

                    <div className="grid grid-cols-1 divide-y divide-gray-50 text-sm">
                        <div className="flex justify-between items-center py-3">
                            <span className="text-gray-500 font-medium">SKU / Refernce ID</span>
                            <span className="font-mono font-bold text-gray-700 text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{data?.product?._id}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-gray-500 font-medium">Current Stock Level</span>
                            <span className={`font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wide ${
                                data?.product?.quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                                {data?.product?.quantity} Available
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-gray-500 font-medium">Category Binding</span>
                            <span className="font-bold text-gray-800 capitalize">{productCategory}</span>
                        </div>
                        <div className="flex justify-between items-start py-3">
                            <span className="text-gray-500 font-medium w-1/3">Short Intro</span>
                            <span className="font-medium text-gray-800 w-2/3 text-right text-xs leading-relaxed">{productShortDescription}</span>
                        </div>
                    </div>
                </div>

                {/* Gallery Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100/80 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 border border-orange-100/50 flex items-center justify-center font-bold">
                            <FiImage size={16} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-none">{i18n?.t("Media Gallery")}</h3>
                    </div>
                    
                    {data?.product?.images?.length > 0 ? (
                        <div className='grid grid-cols-3 gap-3'>
                            {data?.product?.images?.map((imageUrl, index) => (
                                <div key={index} className="rounded-xl overflow-hidden shadow-sm border border-slate-100 relative group aspect-square">
                                    <Image
                                        src={imageUrl}
                                        alt={`gallery-${index}`}
                                        className='object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500'
                                        preview={true}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                             <FiImage size={24} className="text-slate-300 mb-2" />
                             <span className="text-xs font-semibold text-slate-400">No additional media uploaded</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Extended Info Block */}
            <div className="grid lg:grid-cols-2 gap-6">
                 
                {/* Variants Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5 h-fit">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100/80 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 border border-purple-100/50 flex items-center justify-center font-bold">
                            <FiLayers size={16} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-none">{i18n?.t("Product Variants")}</h3>
                    </div>

                    {data?.product?.variants?.length > 0 ? (
                        <div className="rounded-xl border border-slate-100 overflow-hidden">
                            <table className='w-full text-sm text-left'>
                                <thead className='text-xs text-gray-500 uppercase bg-slate-50 border-b border-slate-100'>
                                    <tr>
                                        <th className='px-4 py-3 font-bold'>Variant Spec</th>
                                        <th className='px-4 py-3 font-bold'>Valuation</th>
                                        <th className='px-4 py-3 font-bold text-right'>Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {data?.product?.variants?.map((variant, index) => (
                                        <tr key={index} className='hover:bg-slate-50/50 transition-colors'>
                                            <td className='px-4 py-3 font-bold text-gray-700 capitalize'>
                                                {resolveLocalizedValue(variant?.name)}
                                            </td>
                                            <td className='px-4 py-3 font-medium text-gray-600'>
                                                {currencySymbol}{variant?.price}
                                            </td>
                                            <td className='px-4 py-3 text-right'>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                                                    variant?.in_stock ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-rose-50 text-rose-600 border border-rose-100/50'
                                                }`}>
                                                    {variant?.in_stock ? 'IN STOCK' : 'DEPLETED'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                             <FiLayers size={24} className="text-slate-300 mb-2" />
                             <span className="text-xs font-semibold text-slate-400">Single Variant Product</span>
                        </div>
                    )}
                </div>

                {/* Description Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5 h-fit">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100/80 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 border border-orange-100/50 flex items-center justify-center font-bold">
                            <FiFileText size={16} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-none">{i18n?.t("Extended Details")}</h3>
                    </div>
                    
                    {productDescription && productDescription !== '-' ? (
                        <div 
                            className="prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-800 prose-headings:font-bold prose-a:text-[#F97316] prose-strong:text-gray-800 pt-2"
                            dangerouslySetInnerHTML={{ __html: productDescription }} 
                            style={{ whiteSpace: 'pre-line' }} 
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                             <FiFileText size={24} className="text-slate-300 mb-2" />
                             <span className="text-xs font-semibold text-slate-400">No extensive description provided</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default page;
