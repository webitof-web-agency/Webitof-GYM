'use client';
import React, { useState } from 'react';
import { Pagination, Select } from 'antd';
import BasicBar from '../../../../components/common/basic-bar';
import ShopCard from '../../../../components/home1/shopCard';
import { useFetch } from '../../../helpers/hooks';
import { allProductCategory, allProducts } from '../../../helpers/backend';
import { columnFormatter } from '../../../helpers/utils';
import { useI18n } from '../../../providers/i18n';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';


const Shop = () => {
    const [allproducts, getAllProducts, { loading }] = useFetch(allProducts, { limit: 8 });
    const [category] = useFetch(allProductCategory);
    const i18n = useI18n();
    let { langCode } = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getAllProducts({ page, limit: pageSize });
    };

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };


    const searchBarVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className=''>
            <BasicBar heading={i18n?.t('Shop')} subHeading={i18n?.t('Shop')} />
            <div className='container lg:my-[120px] md:my-20 my-10'>
                <motion.div
                    variants={searchBarVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-white rounded-2xl flex md:flex-row flex-col items-center w-full shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden"
                >
                    {/* Search Input */}
                    <div className='flex items-center flex-1 w-full px-5 py-1 md:py-0'>
                        <FiSearch size={20} className='text-gray-400 min-w-5 shrink-0' />
                        <input
                            name="search"
                            type="search"
                            autoComplete="off"
                            placeholder={i18n?.t("Search brands and products...")}
                            className="w-full pl-4 py-4 text-gray-700 font-medium text-sm focus:outline-none bg-transparent placeholder:text-gray-400"
                            onChange={e => {
                                if (e.target.value.length === 0) {
                                    getAllProducts({ langCode: langCode })
                                } else {
                                    getAllProducts({ search: e.target.value, langCode: langCode })
                                }
                            }}
                        />
                    </div>
                    
                    {/* Divider for desktop */}
                    <div className="hidden md:block w-px h-8 bg-slate-100 mx-2"></div>
                    
                    {/* Category Selector */}
                    <div className="flex items-center w-full md:w-auto px-5 py-2 md:py-0 bg-slate-50/50 md:bg-transparent border-t border-slate-100 md:border-t-0">
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]/10 border border-[#F97316]/20 shrink-0 mr-3'>
                            <FiFilter size={14} className='text-[#F97316]' />
                        </div>
                        <Select
                            onChange={value => { getAllProducts({ category: value, langCode: langCode }) }}
                            defaultValue=""
                            bordered={false}
                            className="w-full md:w-48 !font-bold text-[13px]"
                            dropdownStyle={{ borderRadius: '12px', padding: '8px' }}
                            options={[
                                { value: '', label: i18n?.t('All Categories') },
                                ...(category?.docs?.map(c => ({
                                    value: columnFormatter(c?.name),
                                    label: columnFormatter(c?.name)
                                })) || [])
                            ]}
                        />
                    </div>
                </motion.div>

                <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:gap-6 gap-2 mt-14'>
                    {allproducts?.docs?.length ? (
                        allproducts?.docs?.map(product => (
                            <motion.div
                                variants={slideVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <ShopCard key={product._id} data={product} getData={getAllProducts} />
                            </motion.div>

                        ))
                    ) : (
                        <div className='col-span-full text-center'>{i18n?.t('No products found')}</div>
                    )}
                </div>
                <Pagination
                    align="center"
                    className="!mt-[50px]"
                    current={currentPage}
                    pageSize={pageSize}
                    total={allproducts?.totalDocs}
                    onChange={onPageChange}
                />

            </div>
        </section>
    );
};

export default Shop;

