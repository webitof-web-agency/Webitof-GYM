'use client';
import { Form } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../../../../providers/i18n';
import Image from 'next/image';
import Button from '../../../../../../components/common/button';
import { fetchTheme, updateTheme } from '../../../../../helpers/backend';
import { useActionConfirm, useFetch } from '../../../../../helpers/hooks';
import { FiCheckCircle, FiMonitor } from 'react-icons/fi';

const ThemeSetting = () => {
    const i18n = useI18n();
    const [allThemes, getAllThemes] = useFetch(fetchTheme);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const imageRefs = useRef([]);

    useEffect(() => {
        if (hoveredIndex !== null) {
            const img = imageRefs.current[hoveredIndex];
            let scrollAmount = 0;
            const scrollSpeed = 5;
            const scrollInterval = setInterval(() => {
                scrollAmount += scrollSpeed;
                if (scrollAmount >= img.scrollHeight - img.clientHeight) {
                    clearInterval(scrollInterval);
                } else {
                    img.scrollTop = scrollAmount;
                }
            }, 20);
            return () => clearInterval(scrollInterval);
        }
    }, [hoveredIndex]);

    const getPreviewSrc = (name) => {
        if (name === 'home1') return '/home1.png';
        if (name === 'home2') return '/home2.png';
        if (name === 'home3') return '/home3.png';
        if (name === 'home4') return '/home4.png';
        return '/home1.png';
    };

    if (!Array.isArray(allThemes)) {
        return (
            <div className="bg-white rounded-xl border border-slate-100/80 p-8 flex items-center justify-center">
                <div className="text-gray-400 text-sm font-medium animate-pulse">Loading themes...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FiMonitor size={16} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-800 leading-tight">Display Theme Activation</h3>
                    <p className="text-[11px] text-gray-500 font-medium">Hover to preview — click to activate as global layout</p>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {allThemes?.map((theme, index) => (
                        <div key={index}
                            className={`group relative rounded-xl cursor-pointer transition-all duration-200 overflow-hidden border-2 shadow-sm hover:shadow-md ${theme?.isDefault ? 'border-[#F97316] shadow-[#F97316]/20' : 'border-slate-200 hover:border-[#F97316]/40'}`}
                        >
                            {theme?.isDefault && (
                                <div className="absolute top-2 left-2 z-10 bg-[#F97316] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                                    <FiCheckCircle size={10} /> Active
                                </div>
                            )}
                            <div
                                className="h-[320px] relative overflow-hidden"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div
                                    ref={el => imageRefs.current[index] = el}
                                    className="absolute inset-0 overflow-y-scroll hide-scrollbar scrollbar-hide"
                                >
                                    <Image
                                        src={getPreviewSrc(theme?.name)}
                                        alt={`Theme ${theme?.name} Preview`}
                                        width={500}
                                        height={2000}
                                        className="object-cover w-full"
                                    />
                                </div>
                            </div>
                            <div className="bg-white border-t border-slate-100">
                                <div className="px-3 py-2 flex items-center justify-between bg-slate-50/60">
                                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">{theme?.name}</span>
                                </div>
                                <Button
                                    type='button'
                                    className={`!w-full !rounded-none !border-none !py-2.5 !text-xs !font-bold tracking-wide transition-all ${theme?.isDefault ? '!bg-[#F97316] !text-white' : '!bg-slate-100 !text-gray-600 hover:!bg-[#F97316]/10 hover:!text-[#F97316]'}`}
                                    onClick={() => {
                                        useActionConfirm(updateTheme, { _id: theme?._id }, getAllThemes, 'Are you sure you want to activate this theme?');
                                    }}
                                >
                                    {theme?.isDefault ? `✓ ${i18n?.t('Currently Active')}` : i18n?.t('Set as Default')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeSetting;

