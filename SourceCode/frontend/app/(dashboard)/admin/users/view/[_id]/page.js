'use client';
import dayjs from 'dayjs';
import Image from 'next/image';
import { Empty } from 'antd';
import React, { useEffect } from 'react';
import { fetchMemberDetails } from '../../../../../helpers/backend';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../../../providers/i18n';
import { useCurrency } from '../../../../../contexts/site';
import Button from '../../../../../../components/common/button';
import { useFetch } from '../../../../../helpers/hooks';
import { FiUser, FiMail, FiMapPin, FiPhone, FiHash, FiCalendar, FiArrowLeft, FiTag, FiClock, FiActivity, FiBriefcase, FiCreditCard, FiShield } from 'react-icons/fi';
import PageTitle from '../../../../components/common/page-title';

const page = ({ params }) => {
    const [data, getData] = useFetch(fetchMemberDetails, {}, false);
    const router = useRouter();
    const i18n = useI18n();
    const { currencySymbol, convertAmount } = useCurrency();

    useEffect(() => {
        if (params?._id) {
            getData({ _id: params?._id });
        }
    }, [params?._id]);

    return (
        <div className="max-w-[1200px] mx-auto space-y-4 animate-fade-in relative pb-10">
            <div className='flex justify-between items-center mb-4'>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.back()} 
                        className="w-8 h-8 flex justify-center items-center rounded-lg bg-white border border-slate-200 shadow-sm text-gray-500 hover:text-[#5572fc] hover:border-[#5572fc] transition-colors"
                    >
                        <FiArrowLeft size={16} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight leading-none pt-0.5">{i18n?.t("Member Profile Details")}</h2>
                </div>
            </div>

            {data?.member?._id ? (
                <>
                    <div className='w-full bg-white relative pb-6 rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden'>
                        <div className="h-32 w-full bg-gradient-to-br from-[#5572fc] to-[#7f93ff] relative">
                             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                             
                             <div className="absolute bottom-3.5 left-[150px] z-10 w-[calc(100%-180px)]">
                                 <h2 className="text-2xl font-bold text-gray-900 tracking-wide leading-none drop-shadow-sm truncate">{data?.member?.name}</h2>
                             </div>
                        </div>
                        
                        <div className='absolute top-16 left-8 z-10'>
                            <div className="p-1.5 bg-white rounded-full shadow-md w-fit">
                                <Image
                                    src={data?.member?.image || "/defaultimg.jpg"}
                                    width={100}
                                    height={100}
                                    alt='profile image'
                                    className='w-[100px] h-[100px] rounded-full object-cover border-[3px] border-slate-50'
                                />
                            </div>
                        </div>

                        <div className='pt-3 pl-[150px] pr-8 pb-4 flex justify-between items-start'>
                            <div className="mb-2">
                                <span className="inline-flex items-center gap-1 bg-[#5572fc]/10 text-[#5572fc] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                    <FiBriefcase size={10} />
                                    GYM MEMBER
                                </span>
                            </div>
                        </div>

                        <div className='mt-2 px-8 grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            <div className="w-full bg-slate-50/50 rounded-xl border border-slate-100 p-5">
                                <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                                    <FiUser className="text-[#5572fc]" size={16} />
                                    <h3 className="text-sm font-bold text-gray-700 tracking-wide uppercase">{i18n?.t('Personal Information')}</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-y-3">
                                    {[
                                        { label: i18n?.t("Email"), value: data?.member.email, icon: <FiMail /> },
                                        { label: i18n?.t("Phone"), value: data?.member.phone, icon: <FiPhone /> },
                                        { label: i18n?.t("Address"), value: data?.member.address, icon: <FiMapPin /> },
                                        { label: i18n?.t("Date Of Birth"), value: data?.member?.dob ? dayjs(data?.member.dob).format('DD MMM YYYY') : null, icon: <FiCalendar /> },
                                        { label: i18n?.t("Gender"), value: data?.member.gender, icon: <FiUser /> }
                                    ].map((item, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between group pt-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-gray-400 group-hover:text-[#5572fc] group-hover:border-[#5572fc]/30 transition-colors">
                                                    {item.icon}
                                                </div>
                                                <span className="text-[11px] font-semibold text-gray-500 uppercase">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-800 mt-1 sm:mt-0">{item.value || "N/A"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="w-full bg-slate-50/50 rounded-xl border border-slate-100 p-5">
                                <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                                    <FiShield className="text-[#5572fc]" size={16} />
                                    <h3 className="text-sm font-bold text-gray-700 tracking-wide uppercase">{i18n?.t('Current Subscription')}</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-y-3">
                                    {[
                                        { label: i18n?.t("Membership"), value: data?.subscription?.[0]?.subscription_type || "N/A", icon: <FiTag /> },
                                        { label: i18n?.t("Member ID"), value: data?.subscription?.[0]?.uid || data?.member?.uid, icon: <FiHash /> },
                                        { label: i18n?.t("Price"), value: data?.subscription?.[0]?.price ? currencySymbol + convertAmount(data?.subscription[0]?.price) : "N/A", icon: <FiCreditCard /> },
                                        { label: i18n?.t("Start Date"), value: data?.subscription?.[0]?.start_date ? dayjs(data?.subscription[0]?.start_date).format('DD MMM YYYY') : null, icon: <FiCalendar /> },
                                        { label: i18n?.t("End Date"), value: data?.subscription?.[0]?.end_date ? dayjs(data?.subscription[0]?.end_date).format('DD MMM YYYY') : null, icon: <FiClock /> },
                                        { label: i18n?.t("Status"), value: data?.subscription?.[0]?.active ? "Active" : "Inactive", icon: <FiActivity /> }
                                    ].map((item, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between group pt-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-gray-400 group-hover:text-[#5572fc] group-hover:border-[#5572fc]/30 transition-colors">
                                                    {item.icon}
                                                </div>
                                                <span className="text-[11px] font-semibold text-gray-500 uppercase">{item.label}</span>
                                            </div>
                                            {item.label === i18n?.t("Status") ? (
                                                <span className={`text-[10px] font-bold mt-1 sm:mt-0 px-2 py-0.5 rounded-md border ${item.value === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                                                    {item.value}
                                                </span>
                                            ) : (
                                                <span className="text-sm font-bold text-gray-800 mt-1 sm:mt-0">{item.value || "N/A"}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-full bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden'>
                        <div className="px-6 py-4 border-b border-gray-100 bg-white">
                            <h2 className='text-base font-bold text-slate-800 tracking-tight'>{i18n?.t('Subscription History')}</h2>
                        </div>

                        <div className='overflow-x-auto'>
                            <table className="w-full text-left">
                                <thead className="bg-[#f8f9fa] border-b border-gray-100 text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-3 whitespace-nowrap text-[11px] font-semibold tracking-wider">{i18n?.t('Title')}</th>
                                        <th className="px-6 py-3 whitespace-nowrap text-[11px] font-semibold tracking-wider">{i18n?.t('Price')}</th>
                                        <th className="px-6 py-3 whitespace-nowrap text-[11px] font-semibold tracking-wider">{i18n?.t('Joining Date')}</th>
                                        <th className="px-6 py-3 whitespace-nowrap text-[11px] font-semibold tracking-wider">{i18n?.t('Expire Date')}</th>
                                        <th className="px-6 py-3 whitespace-nowrap text-[11px] font-semibold tracking-wider text-right">{i18n?.t('Status')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/80 bg-white">
                                    {data?.subscription?.length > 0 ? (
                                        data?.subscription.map(sub => (
                                            <tr key={sub?._id} className="hover:bg-gray-50/60 transition-colors duration-200 group">
                                                <td className="px-6 py-3.5 whitespace-nowrap text-gray-800 font-bold text-sm capitalize">
                                                    {sub?.subscription_type || "N/A"}
                                                </td>
                                                <td className="px-6 py-3.5 whitespace-nowrap text-gray-700 font-medium text-sm">
                                                    {currencySymbol}{convertAmount(sub?.price) || "N/A"}
                                                </td>
                                                <td className="px-6 py-3.5 whitespace-nowrap text-gray-500 font-medium text-sm">
                                                    {sub?.start_date ? dayjs(sub?.start_date).format('DD MMM YYYY') : "N/A"}
                                                </td>
                                                <td className="px-6 py-3.5 whitespace-nowrap text-gray-500 font-medium text-sm">
                                                    {sub?.end_date ? dayjs(sub?.end_date).format('DD MMM YYYY') : "N/A"}
                                                </td>
                                                <td className="px-6 py-3.5 whitespace-nowrap text-right">
                                                    {sub?.active ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold capitalize bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold capitalize bg-rose-50 text-rose-600 border border-rose-100/50">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-10 text-center text-gray-400 font-medium text-sm">
                                                {i18n?.t('No subscription history available')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <Empty className="py-12 bg-white rounded-2xl shadow-sm border border-slate-100/80" />
            )}
        </div>
    );
};

export default page;