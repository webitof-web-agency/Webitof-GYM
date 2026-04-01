"use client";
import React, { useState } from "react";
import ServiceCard from "../(home-2)/components/serviceCard";
import { fetchServices } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { useI18n } from "../../../providers/i18n";
import { motion } from 'framer-motion';
import { Pagination } from "antd";
import { FiGrid } from "react-icons/fi";

const Services = () => {
    const [data, getData, { loading }] = useFetch(fetchServices, { limit: 6 });
    const i18n = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const onPageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
        getData({ page, limit: size });
    };

    return (
        <div className="container py-16 lg:py-24">
            {/* Section header */}
            <div className='mb-12'>
                <div className='inline-flex items-center gap-2 rounded-full border border-[#5572fc]/25 bg-[#5572fc]/8 px-4 py-1.5 mb-4'>
                    <FiGrid size={11} className='text-[#5572fc]' />
                    <span className='text-[11px] font-black text-[#5572fc] uppercase tracking-widest'>{i18n?.t('What We Offer')}</span>
                </div>
                <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className='text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight leading-tight'
                >
                    {i18n?.t("Services We're")} <span className='text-[#5572fc]'>{i18n?.t('Offering')}</span>
                </motion.h2>
            </div>

            {/* Cards grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {data?.docs?.map((service, index) => (
                    <ServiceCard key={service._id} data={service} index={index} />
                ))}
            </div>

            {/* Pagination */}
            {data?.totalDocs > pageSize && (
                <div className='flex justify-center mt-12'>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={data?.totalDocs}
                        onChange={onPageChange}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default Services;