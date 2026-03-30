"use client";
import { Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchSinglePage, postLocalMultipleImage, postPage } from '../../../../../helpers/backend';
import { useI18n } from '../../../../../providers/i18n';
import { useFetch } from '../../../../../helpers/hooks';
import { HiddenInput } from '../../../../../../components/form/input';
import MultipleImageInput from '../../../../../../components/form/multiImage';
import Button from '../../../../../../components/common/button';
import { FiImage, FiSave, FiInfo } from 'react-icons/fi';

const CompanyDetails = ({ slug }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    const [loader, setLoader] = useState(false);

    useEffect(() => { getPage({ slug: slug }); }, [slug]);

    useEffect(() => {
        if (page?._id) {
            form.setFieldsValue({
                _id: page._id, title: page.title, slug: page.slug,
                images: Array.isArray(page?.content?.company_details?.images)
                    ? page.content.company_details.images.filter(Boolean).map((image) => ({ url: image }))
                    : (page?.content?.company_details?.images ? [{ url: page.content.company_details.images }] : []),
            });
        }
    }, [page]);

    const handleUploadImages = async (imageFiles, imageName) => {
        const list = Array.isArray(imageFiles) ? imageFiles : [];
        const existingUrls = list.filter((i) => typeof i?.url === 'string' && !i?.originFileObj).map((i) => i.url);
        const newFiles = list.filter((i) => i?.originFileObj).map((i) => i.originFileObj);
        if (newFiles.length === 0) return existingUrls;
        const { data } = await postLocalMultipleImage({ images: newFiles, image_name: imageName });
        return [...existingUrls, ...(data || [])];
    };

    const onFinish = async (values) => {
        setLoader(true);
        try {
            const imageUploads = await handleUploadImages(values.images || [], 'images');
            const formData = {
                title: values.title || 'Company Details', slug: values.slug || page?.slug,
                content: { company_details: { images: imageUploads } },
                content_type: 'json',
            };
            if (values._id) formData._id = page._id;
            const res = await postPage(formData);
            if (res?.error === false) { message.success(res?.msg); getPage({ slug: slug }); }
            else { message.error("Failed to submit data"); }
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                    <FiImage size={16} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-800 leading-tight">Business Gallery Config</h3>
                    <p className="text-[11px] text-gray-500 font-medium">Upload structural showcase images (max 5)</p>
                </div>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish} className="p-6">
                <HiddenInput name="slug" />
                <HiddenInput name="_id" />

                <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-2 mb-4 text-[11px] text-blue-600 font-medium">
                        <FiInfo size={13} className="mt-0.5 shrink-0" />
                        Upload up to 5 facility, team & brand showcase images. They will appear as the company gallery on the contact and about pages.
                    </div>
                    <MultipleImageInput name="images" label={<span className="text-xs font-bold text-gray-700">Facility Showcase Gallery</span>} required={true} max={5} />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button type="submit" loading={loader} className="!px-6 !py-2 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 !font-semibold !rounded-lg !text-xs">
                        <FiSave size={13} /> {i18n?.t("Publish Gallery")}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CompanyDetails;
