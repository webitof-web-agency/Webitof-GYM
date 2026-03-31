"use client";
import { Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchSinglePage, postPage, postSingleImage } from '../../../../../helpers/backend';
import { useI18n } from '../../../../../providers/i18n';
import { useFetch } from '../../../../../helpers/hooks';
import FormInput, { HiddenInput } from '../../../../../../components/form/input';
import MultipleImageInput from '../../../../../../components/form/multiImage';
import { noSelected } from '../../../../../helpers/utils';
import Button from '../../../../../../components/common/button';
import { FiLayers, FiTarget, FiEye, FiStar, FiSave } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const AboutPageSetting = ({ slug }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { langCode, languages } = useI18n();
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs
            : [fallbackLanguage];
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    const [selectedLang, setSelectedLang] = useState();
    const [formValues, setFormValues] = useState({});
    const [loader, setLoader] = useState(false);

    useEffect(() => { getPage({ slug: slug }); }, [slug]);
    useEffect(() => { setSelectedLang(langCode || availableLanguages[0]?.code || 'en'); }, [availableLanguages, langCode]);

    const toUploadList = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value.map((v) => (typeof v === 'string' ? v : v?.url)).filter(Boolean).map((url) => ({ url }));
        if (typeof value === 'string') return [{ url: value }];
        if (typeof value?.url === 'string') return [{ url: value.url }];
        return [];
    };

    useEffect(() => {
        if (page?._id) {
            const initialFormValues = {
                _id: page._id, title: page.title, slug: page.slug,
                mission_image1: toUploadList(page?.content?.about_page?.mission?.mission_image1),
                mission_image2: toUploadList(page?.content?.about_page?.mission?.mission_image2),
                vision_image1: toUploadList(page?.content?.about_page?.vision?.vision_image1),
                vision_image2: toUploadList(page?.content?.about_page?.vision?.vision_image2),
                values_image1: toUploadList(page?.content?.about_page?.values?.values_image1),
                values_image2: toUploadList(page?.content?.about_page?.values?.values_image2),
            };
            availableLanguages.forEach((lang) => {
                initialFormValues.about_page = initialFormValues.about_page || {};
                initialFormValues.about_page.heading = initialFormValues.about_page.heading || {};
                initialFormValues.about_page.heading[lang.code] = page.content?.about_page?.heading?.[lang.code] || '';
                initialFormValues.about_page.description = initialFormValues.about_page.description || {};
                initialFormValues.about_page.description[lang.code] = page.content?.about_page?.description?.[lang.code] || '';
                initialFormValues.about_page.mission = initialFormValues.about_page.mission || {};
                initialFormValues.about_page.mission.text = initialFormValues.about_page.mission.text || {};
                initialFormValues.about_page.mission.text[lang.code] = page?.content?.about_page?.mission?.text?.[lang.code] || '';
                initialFormValues.about_page.vision = initialFormValues.about_page.vision || {};
                initialFormValues.about_page.vision.text = initialFormValues.about_page.vision.text || {};
                initialFormValues.about_page.vision.text[lang.code] = page?.content?.about_page?.vision?.text?.[lang.code] || '';
                initialFormValues.about_page.values = initialFormValues.about_page.values || {};
                initialFormValues.about_page.values.text = initialFormValues.about_page.values.text || {};
                initialFormValues.about_page.values.text[lang.code] = page?.content?.about_page?.values?.text?.[lang.code] || '';
            });
            setFormValues(initialFormValues);
            form.setFieldsValue(initialFormValues);
        }
    }, [page]);

    useEffect(() => { form.setFieldsValue(formValues); }, [selectedLang, formValues]);
    const handleValuesChange = (_, allValues) => { setFormValues(allValues); };

    const handleFinish = async (values) => {
        setLoader(true);
        try {
            const resolveImageUrl = async (imageField, imageName) => {
                const list = values?.[imageField];
                const first = Array.isArray(list) ? list[0] : undefined;
                if (first?.originFileObj) {
                    const { data } = await postSingleImage({ image: first.originFileObj, image_name: imageName });
                    return data;
                }
                if (typeof first?.url === 'string') return first.url;
                return '';
            };
            const [mi1, mi2, vi1, vi2, vl1, vl2] = await Promise.all([
                resolveImageUrl('mission_image1', 'about_page'), resolveImageUrl('mission_image2', 'about_page'),
                resolveImageUrl('vision_image1', 'about_page'), resolveImageUrl('vision_image2', 'about_page'),
                resolveImageUrl('values_image1', 'about_page'), resolveImageUrl('values_image2', 'about_page'),
            ]);
            const formData = {
                title: values?.title || 'About', slug: values?.slug || page?.slug,
                content: {
                    about_page: {
                        heading: values?.about_page?.heading,
                        description: values?.about_page?.description,
                        mission: { text: values?.about_page?.mission?.text, mission_image1: mi1, mission_image2: mi2 },
                        vision: { text: values?.about_page?.vision?.text, vision_image1: vi1, vision_image2: vi2 },
                        values: { text: values?.about_page?.values?.text, values_image1: vl1, values_image2: vl2 },
                    },
                },
                content_type: 'json',
            };
            if (values?._id) formData._id = page?._id;
            const res = await postPage(formData);
            if (res?.error === false) { message.success(res?.msg); getPage({ slug: slug }); }
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center"><FiLayers size={16} /></div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800 leading-tight">About Vision Config</h3>
                        <p className="text-[11px] text-gray-500 font-medium">Mission, vision & core values narrative</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((l, index) => (
                        <button key={index} onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wide transition-all border ${l.code === selectedLang ? 'bg-[#5572fc] text-white border-[#5572fc]' : 'bg-transparent text-gray-500 border-gray-200 hover:bg-slate-50'}`}>
                            {l.name}
                        </button>
                    ))}
                </div>
            </div>

            <Form form={form} layout="vertical" onValuesChange={handleValuesChange} onFinish={handleFinish} className="p-6">
                <HiddenInput name="slug" />
                <HiddenInput name="_id" />

                {/* Hero Section */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Hero Section</h4>
                    {availableLanguages.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <FormInput name={["about_page", "heading", l.code]} label={<span className="text-xs font-bold text-gray-700">Section Heading</span>} placeholder="Enter heading" />
                            <FormInput name={["about_page", "description", l.code]} label={<span className="text-xs font-bold text-gray-700">Page Description</span>} placeholder="Enter description" textArea />
                        </div>
                    ))}
                </div>

                {/* Mission / Vision / Values */}
                <div className="grid grid-cols-1 2xl:grid-cols-3 lg:grid-cols-2 gap-4 mb-4">
                    {[
                        { field: 'mission', label: 'Mission Statement', icon: <FiTarget size={13} />, img1: 'mission_image1', img2: 'mission_image2', color: 'blue' },
                        { field: 'vision', label: 'Vision Narrative', icon: <FiEye size={13} />, img1: 'vision_image1', img2: 'vision_image2', color: 'purple' },
                        { field: 'values', label: 'Core Values', icon: <FiStar size={13} />, img1: 'values_image1', img2: 'values_image2', color: 'emerald' },
                    ].map(({ field, label, icon, img1, img2, color }) => (
                        <div key={field} className={`bg-${color}-50/30 border border-${color}-100/50 rounded-xl p-4`}>
                            <h4 className={`text-[11px] font-bold text-${color}-600 uppercase tracking-widest flex items-center gap-1.5 mb-3`}>{icon} {label}</h4>
                            {availableLanguages.map((l, index) => (
                                <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                                    <FormInput name={["about_page", field, "text", l.code]} placeholder={`Enter ${field}`} textArea />
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <MultipleImageInput name={img1} label={<span className="text-[10px] font-bold text-gray-500">Image 1</span>} />
                                <MultipleImageInput name={img2} label={<span className="text-[10px] font-bold text-gray-500">Image 2</span>} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button type="submit" loading={loader} onClick={() => noSelected({ form, setSelectedLang })} className="!px-6 !py-2 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 !font-semibold !rounded-lg !text-xs">
                        <FiSave size={13} /> {i18n?.t("Publish Vision Config")}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AboutPageSetting;
