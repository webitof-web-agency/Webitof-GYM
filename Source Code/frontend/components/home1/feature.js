'use client';
import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { motion } from 'framer-motion';
import BannerTitle from '../common/banner-title';
import FeatureCard from './featureCard';
import { useFetch } from '../../app/helpers/hooks';
import { fetchFeatures } from '../../app/helpers/backend';
import { useI18n } from '../../app/providers/i18n';

const Features = () => {
  const [data] = useFetch(fetchFeatures);
  const i18n = useI18n();
  const [SwiperComponents, setSwiperComponents] = useState(null);
  const [SwiperModules, setSwiperModules] = useState(null);
  const slideVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([import('swiper/react'), import('swiper/modules')]).then(([react, modules]) => {
      if (!mounted) {
        return;
      }
      setSwiperComponents({ Swiper: react.Swiper, SwiperSlide: react.SwiperSlide });
      setSwiperModules({ Pagination: modules.Pagination, Autoplay: modules.Autoplay });
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!SwiperComponents || !SwiperModules) {
    return (
      <div className='relative max-w-[1320px] px-4 md:px-0 mx-auto lg:my-[120px] my-[60px] overflow-x-hidden'>
        <BannerTitle className={"items-center"} title={i18n?.t('why choose us ?')} subtitle={i18n?.t('Features')} />
        <div className='grid gap-6 mt-10 md:grid-cols-2 lg:grid-cols-4'>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { Swiper, SwiperSlide } = SwiperComponents;
  const { Pagination, Autoplay } = SwiperModules;

  return (
    <div className='relative max-w-[1320px] px-4 md:px-0 mx-auto lg:my-[120px] my-[60px] overflow-x-hidden'>
      <BannerTitle className={"items-center"} title={i18n?.t('why choose us ?')} subtitle={i18n?.t('Features')} />
      <div className='overflow-hidden mt-10'>
        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          loop={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 24
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24
            },
          }}
          modules={[Pagination, Autoplay]}
          className="!pb-16 !px-3 !pt-5"
        >
          {data?.docs?.map((feature) => (
            <SwiperSlide key={feature._id}>
              <motion.div
                variants={slideVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <FeatureCard feature={feature} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Features;
