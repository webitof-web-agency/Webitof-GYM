'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import TeamCard from './teamCard';
import BannerTitle from '../common/banner-title';
import { useFetch } from '../../app/helpers/hooks';
import { fetchTrainerList } from '../../app/helpers/backend';
import { useI18n } from '../../app/providers/i18n';
import { motion } from 'framer-motion';
import { useCurrency } from '../../app/contexts/site';

const Team = () => {
    const i18n = useI18n();
    const [data, getData] = useFetch(fetchTrainerList, { limit: 10 });
    const {findDefaultTheme} = useCurrency()
    const [SwiperComponents, setSwiperComponents] = useState(null);

    const swiperRef = useRef(null);
    useEffect(() => {
        let mounted = true;
        import('swiper/react').then((react) => {
            if (!mounted) {
                return;
            }
            setSwiperComponents({ Swiper: react.Swiper, SwiperSlide: react.SwiperSlide });
        });
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.update();
        }
    }, []);
    const goNext = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };
    const goPrev = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    if (!SwiperComponents) {
        return (
            <div className='container h-fit overflow-x-hidden'>
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-48 rounded bg-gray-100 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const { Swiper, SwiperSlide } = SwiperComponents;

    return (
        <div className='container h-fit overflow-x-hidden'>
            <div className='flex justify-between items-center '>
                <BannerTitle home3={findDefaultTheme} subtitle={i18n?.t('team')} title={i18n?.t("meet the pros")} className={''} />
                <div className='flex items-center gap-6 mt-6 '>
                    <button onClick={goPrev} className='w-[40px] h-[40px] rounded-full box-shadow flex items-center justify-center text-[#F97316] hover:bg-[#F97316] hover:text-white duration-500'><MdKeyboardArrowLeft size={30} /></button>
                    <button onClick={goNext} className='w-[40px] h-[40px] rounded-full box-shadow flex items-center justify-center text-[#F97316] hover:bg-[#F97316] hover:text-white duration-500'><MdKeyboardArrowRight size={30} /></button>
                </div>
            </div>
            <div className='overflow-hidden mt-10'>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    pagination={{
                        clickable: true,
                    }}
                    breakpoints={{
                        415: {
                            slidesPerView: 2,
                            spaceBetween: 10
                        },
                        600: {
                            slidesPerView: 2,
                            spaceBetween: 24
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 24
                        },
                    }}
                    className='!p-1'
                    ref={swiperRef}
                >
                    {data?.docs?.map((team, index) => (
                        <SwiperSlide key={team._id} className='' >
                            <motion.div
                                variants={slideVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                key={index} exit="exit"
                                >

                                <TeamCard team={team} />
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Team;

