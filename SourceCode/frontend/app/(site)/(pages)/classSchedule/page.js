'use client';
import React, { useState } from 'react';
import BasicBar from '../../../../components/common/basic-bar';
import { fetchShedule } from '../../../helpers/backend';
import { useFetch } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';
import { motion } from 'framer-motion';
import { Modal, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiClock, FiMail, FiStar } from 'react-icons/fi';

const Page = () => {
    const [schedule] = useFetch(fetchShedule);
    const i18n = useI18n();
    const { langCode } = useI18n();
    const { push } = useRouter();
    const [open, setOpen] = useState(false);
    const [trainer, setTrainer] = useState(null);

    const staticTimes = [
        '9:00 am', '10:00 am', '11:00 am', '12:00 pm', '1:00 pm',
        '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm',
        '7:00 pm', '8:00 pm',
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const findScheduleByTime = (time, day) => {
        const found = schedule?.find((sch) => sch.time === time);
        const title = found?.[day]?.event[langCode] || '-';
        const trainerName = found?.[day]?.trainer?.name || '';
        const trainerData = found?.[day]?.trainer || '';
        return { title, trainer: trainerName, data: trainerData };
    };

    return (
        <div>
            <BasicBar heading={i18n?.t('Class Schedule')} subHeading={i18n?.t('Class Schedule')} />

            <div className='container py-16 lg:py-24'>
                {/* Page header */}
                <div className='mb-10'>
                    <div className='inline-flex items-center gap-2 rounded-full border border-[#5572fc]/25 bg-[#5572fc]/8 px-4 py-1.5 mb-4'>
                        <FiClock size={11} className='text-[#5572fc]' />
                        <span className='text-[11px] font-black text-[#5572fc] uppercase tracking-widest'>{i18n?.t('Weekly Timetable')}</span>
                    </div>
                    <h1 className='text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight leading-tight'>
                        {i18n?.t('Our Class')} <span className='text-[#5572fc]'>{i18n?.t('Schedule')}</span>
                    </h1>
                    <p className='text-[13px] text-gray-500 font-medium mt-3 max-w-xl'>
                        {i18n?.t('Click on any session to view the trainer details. Weekend sessions are highlighted.')}
                    </p>
                </div>

                {/* Table */}
                <div className='overflow-x-auto rounded-2xl border border-slate-100 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)]'>
                    <table className='w-full min-w-[700px] border-collapse'>
                        {/* Header */}
                        <thead>
                            <tr>
                                <th className='bg-[#5572fc] text-white text-[11px] font-black uppercase tracking-widest px-5 py-4 text-left rounded-tl-2xl w-24'>
                                    <div className='flex items-center gap-1.5'><FiClock size={12} /> {i18n?.t('Time')}</div>
                                </th>
                                {days.map((day, i) => (
                                    <th
                                        key={day}
                                        className={`text-[11px] font-black uppercase tracking-widest px-3 py-4 text-center ${i === days.length - 1 ? 'rounded-tr-2xl' : ''} ${day === 'Saturday' || day === 'Sunday' ? 'bg-[#5572fc]/8 text-[#5572fc]' : 'bg-slate-50 text-gray-500'}`}
                                    >
                                        {i18n?.t(day)}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {staticTimes.map((time, rowIdx) => (
                                <motion.tr
                                    key={rowIdx}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ duration: 0.4, delay: rowIdx * 0.03 }}
                                    className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                                >
                                    {/* Time cell */}
                                    <td className='border-b border-slate-100 px-5 py-3.5'>
                                        <span className='flex items-center gap-1.5 text-[12px] font-bold text-[#5572fc] whitespace-nowrap'>
                                            <FiClock size={11} /> {time}
                                        </span>
                                    </td>

                                    {/* Day cells */}
                                    {days.map((day) => {
                                        const { title, trainer, data } = findScheduleByTime(time, day);
                                        const isEmpty = title === '-';
                                        return (
                                            <td
                                                key={day}
                                                onClick={() => { if (!isEmpty && data) { setTrainer(data); setOpen(true); } }}
                                                className={`border-b border-slate-100 px-3 py-3 text-center text-[12px] transition-all duration-200 ${isEmpty ? 'text-slate-300 font-medium' : 'cursor-pointer group hover:bg-[#5572fc]/6'}`}
                                            >
                                                {isEmpty ? '—' : (
                                                    <>
                                                        {title.length > 18 ? (
                                                            <Tooltip title={i18n?.t(title)}>
                                                                <p className='font-bold text-gray-700 group-hover:text-[#5572fc] transition-colors line-clamp-1'>
                                                                    {i18n?.t(title.substring(0, 18) + '…')}
                                                                </p>
                                                            </Tooltip>
                                                        ) : (
                                                            <p className='font-bold text-gray-700 group-hover:text-[#5572fc] transition-colors capitalize'>
                                                                {i18n?.t(title)}
                                                            </p>
                                                        )}
                                                        {trainer && (
                                                            <p className='text-[10px] text-gray-400 font-medium capitalize mt-0.5'>{trainer}</p>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        );
                                    })}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Trainer modal */}
                <Modal
                    open={open}
                    onCancel={() => setOpen(false)}
                    footer={null}
                    closable={false}
                    width={320}
                    styles={{ content: { borderRadius: '20px', padding: 0, overflow: 'hidden' } }}
                >
                    {/* Header banner */}
                    <div className='relative h-[90px] bg-gradient-to-r from-[#4461eb] to-[#5572fc] flex items-end justify-center pb-0'>
                        <div className='absolute bottom-[-44px] left-1/2 -translate-x-1/2 w-[88px] h-[88px] rounded-full border-4 border-white shadow-lg overflow-hidden bg-white'>
                            <Image
                                src={trainer?.image || '/defaultimg.jpg'}
                                alt={trainer?.name || 'Trainer'}
                                width={88}
                                height={88}
                                className='object-cover w-full h-full'
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className='pt-14 px-6 pb-5 text-center'>
                        <h3 className='text-[16px] font-extrabold text-gray-800 capitalize'>{trainer?.name || 'N/A'}</h3>
                        <div className='flex items-center justify-center gap-0.5 mt-1 mb-4'>
                            {[1, 2, 3, 4, 5].map(s => <FiStar key={s} size={11} className='text-amber-400 fill-amber-400' />)}
                        </div>

                        <div className='space-y-2 text-left'>
                            <div className='flex items-center gap-2.5 text-[12px] text-gray-600'>
                                <FiMail size={13} className='text-[#5572fc] shrink-0' />
                                <span className='truncate font-medium'>{trainer?.email || 'N/A'}</span>
                            </div>
                            <div className='flex items-center gap-2.5 text-[12px] text-gray-600'>
                                <FiStar size={13} className='text-[#5572fc] shrink-0' />
                                <span className='font-medium'>{i18n?.t('Experience')}: {trainer?.experience || 'N/A'}</span>
                            </div>
                        </div>

                        {trainer?.about && (
                            <p className='text-[12px] text-gray-400 font-medium line-clamp-3 mt-4 text-left leading-relaxed'>{trainer?.about}</p>
                        )}

                        <button
                            onClick={() => push(`/trainers/view/${trainer?._id}`)}
                            className='mt-5 w-full rounded-xl bg-[#5572fc] py-2.5 text-[13px] font-bold text-white hover:bg-[#4461eb] transition-colors shadow-lg shadow-[#5572fc]/25'
                        >
                            {i18n?.t('View Full Profile')}
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Page;
