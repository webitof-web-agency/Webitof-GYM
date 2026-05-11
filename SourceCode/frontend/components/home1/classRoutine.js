"use client"
import BannerTitle from '../common/banner-title'
import { useFetch } from '../../app/helpers/hooks'
import { fetchShedule } from '../../app/helpers/backend'
import { useI18n } from '../../app/providers/i18n'
import { motion } from 'framer-motion'
import { Modal, Tooltip } from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiClock, FiMail, FiStar } from 'react-icons/fi'

const ClassRoutine = () => {
    const [schedule] = useFetch(fetchShedule)
    const [open, setOpen] = useState(false)
    const [trainer, setTrainer] = useState(null)
    const { push } = useRouter()
    const i18n = useI18n()
    const { langCode } = useI18n()

    const staticTimes = [
        '9:00 am', '10:00 am', '11:00 am', '12:00 pm', '1:00 pm',
        '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm',
        '7:00 pm', '8:00 pm'
    ]

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const findScheduleByTime = (time, day) => {
        const found = schedule?.find(sch => sch.time === time)
        const title = found?.[day]?.event[langCode] || '-'
        const trainer = found?.[day]?.trainer?.name || ''
        const data = found?.[day]?.trainer || ''
        return { title, trainer, data }
    }

    return (
        <div className="container w-full overflow-x-hidden">
            <BannerTitle className="items-center" title={i18n?.t("Our Schedule")} subtitle={i18n?.t("Class Schedule")} />

            <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-100 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)]">
                <table className="w-full min-w-[700px] border-collapse">
                    {/* Header */}
                    <thead>
                        <tr>
                            <th className="bg-[#F97316] text-white text-[11px] font-black uppercase tracking-widest px-5 py-4 text-left rounded-tl-2xl w-24">
                                <div className="flex items-center gap-1.5"><FiClock size={12} /> Time</div>
                            </th>
                            {days.map((day, i) => (
                                <th
                                    key={day}
                                    className={`text-[11px] font-black uppercase tracking-widest px-3 py-4 text-center ${i === days.length - 1 ? 'rounded-tr-2xl' : ''} ${day === 'Saturday' || day === 'Sunday' ? 'bg-[#F97316]/8 text-[#F97316]' : 'bg-slate-50 text-gray-500'}`}
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
                                <td className="border-b border-slate-100 px-5 py-3.5">
                                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#F97316] whitespace-nowrap">
                                        <FiClock size={11} /> {time}
                                    </span>
                                </td>

                                {/* Day cells */}
                                {days.map(day => {
                                    const { title, trainer, data } = findScheduleByTime(time, day)
                                    const isEmpty = title === '-'
                                    return (
                                        <td
                                            key={day}
                                            onClick={() => { if (!isEmpty) { setTrainer(data); setOpen(true) } }}
                                            className={`border-b border-slate-100 px-3 py-3 text-center text-[12px] transition-all duration-200 ${isEmpty ? 'text-slate-300 font-medium' : 'cursor-pointer group hover:bg-[#F97316]/6'}`}
                                        >
                                            {isEmpty ? '—' : (
                                                <>
                                                    {title.length > 18 ? (
                                                        <Tooltip title={i18n?.t(title)}>
                                                            <p className="font-bold text-gray-700 group-hover:text-[#F97316] transition-colors line-clamp-1">
                                                                {i18n?.t(title.substring(0, 18) + '...')}
                                                            </p>
                                                        </Tooltip>
                                                    ) : (
                                                        <p className="font-bold text-gray-700 group-hover:text-[#F97316] transition-colors">
                                                            {i18n?.t(title)}
                                                        </p>
                                                    )}
                                                    {trainer && (
                                                        <p className="text-[10px] text-gray-400 font-medium capitalize mt-0.5">{trainer}</p>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    )
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
                <div className="relative h-[90px] bg-gradient-to-r from-[#EA580C] to-[#F97316] flex items-end justify-center pb-0">
                    <div className="absolute bottom-[-44px] left-1/2 -translate-x-1/2 w-[88px] h-[88px] rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                        <Image
                            src={trainer?.image || '/defaultimg.jpg'}
                            alt={trainer?.name || 'Trainer'}
                            width={88}
                            height={88}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="pt-14 px-6 pb-5 text-center">
                    <h3 className="text-[16px] font-extrabold text-gray-800 capitalize">{trainer?.name || 'N/A'}</h3>
                    <div className="flex items-center justify-center gap-0.5 mt-1 mb-4">
                        {[1,2,3,4,5].map(s => <FiStar key={s} size={11} className="text-amber-400 fill-amber-400" />)}
                    </div>

                    <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2.5 text-[12px] text-gray-600">
                            <FiMail size={13} className="text-[#F97316] shrink-0" />
                            <span className="truncate font-medium">{trainer?.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[12px] text-gray-600">
                            <FiStar size={13} className="text-[#F97316] shrink-0" />
                            <span className="font-medium">{i18n?.t('Experience')}: {trainer?.experience || 'N/A'}</span>
                        </div>
                    </div>

                    {trainer?.about && (
                        <p className="text-[12px] text-gray-400 font-medium line-clamp-3 mt-4 text-left leading-relaxed">{trainer?.about}</p>
                    )}

                    <button
                        onClick={() => push(`/trainers/view/${trainer?._id}`)}
                        className="mt-5 w-full rounded-xl bg-[#F97316] py-2.5 text-[13px] font-bold text-white hover:bg-[#EA580C] transition-colors shadow-lg shadow-[#F97316]/25"
                    >
                        {i18n?.t('View Full Profile')}
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default ClassRoutine
