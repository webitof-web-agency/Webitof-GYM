'use client';
import React, { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useI18n } from '../../../../../providers/i18n';
import { useFetch } from '../../../../../helpers/hooks';
import FormInput, { HiddenInput } from '../../../../../../components/form/input';
import Button from '../../../../../../components/common/button';
import { fetchSinglePage, postPage } from '../../../../../helpers/backend';
import { noSelected } from '../../../../../helpers/utils';
import { FiMapPin, FiSave, FiPhoneCall, FiMail, FiType } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const ContactPage = ({ slug }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs : [fallbackLanguage];
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    const [formValues, setFormValues] = useState({});
    const [selectedLang, setSelectedLang] = useState('en');
    const [loader, setLoader] = useState(false);

    useEffect(() => { setSelectedLang(langCode || availableLanguages[0]?.code || 'en'); }, [availableLanguages, langCode]);
    useEffect(() => { getPage({ slug: slug }); }, [slug]);
    useEffect(() => {
        if (page?._id) {
            const initialFormValues = { _id: page._id, title: page.title, slug: page.slug, map: page.content.map || '' };
            availableLanguages.forEach((lang) => {
                ['heading', 'address', 'email', 'phone'].forEach(field => {
                    initialFormValues[field] = initialFormValues[field] || {};
                    initialFormValues[field][lang.code] = page.content[field]?.[lang.code] || '';
                });
            });
            setFormValues(initialFormValues);
            form.setFieldsValue(initialFormValues);
        }
    }, [page]);
    useEffect(() => { form.setFieldsValue(formValues); }, [selectedLang, formValues]);
    const handleValuesChange = (_, allValues) => { setFormValues(allValues); };

    const handleSubmit = async (values) => {
        setLoader(true);
        try {
            const multiLangFields = ['heading', 'address', 'email', 'phone'];
            const content = multiLangFields.reduce((acc, field) => {
                acc[field] = {};
                availableLanguages.forEach((lang) => {
                    if (values[field]?.[lang.code]) acc[field][lang.code] = values[field][lang.code];
                });
                return acc;
            }, {});
            content.map = values.map;
            const res = await postPage({
                title: values.title || 'Contact Us', slug: values.slug || page?.slug,
                content, content_type: 'json', _id: values?._id ? values?._id : undefined
            });
            if (res?.error === false) { message.success(res?.msg); getPage({ slug: slug }); }
            else message.error(res?.msg || 'Failed to submit data.');
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center"><FiPhoneCall size={16} /></div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800 leading-tight">Support Line Config</h3>
                        <p className="text-[11px] text-gray-500 font-medium">Helpdesk routing, address & map binding</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((l, index) => (
                        <button key={index} onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wide transition-all border ${l.code === selectedLang ? 'bg-[#F97316] text-white border-[#F97316]' : 'bg-transparent text-gray-500 border-gray-200 hover:bg-slate-50'}`}>
                            {l.name}
                        </button>
                    ))}
                </div>
            </div>

            <Form form={form} layout="vertical" onValuesChange={handleValuesChange} onFinish={handleSubmit} className="p-6">
                <HiddenInput name="slug" />
                <HiddenInput name="_id" />

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-3"><FiType size={12}/> Localized Contact Details</h4>
                    {availableLanguages.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <FormInput label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1"><FiType size={11}/> Page Heading</span>} name={['heading', l.code]} placeholder="Enter Heading" />
                                <FormInput label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1"><FiMail size={11}/> Email Address</span>} name={['email', l.code]} placeholder="Enter Email" />
                                <FormInput label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1"><FiMapPin size={11}/> Physical Address</span>} name={['address', l.code]} placeholder="Enter Address" />
                                <FormInput label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1"><FiPhoneCall size={11}/> Phone Number</span>} name={['phone', l.code]} placeholder="Enter Phone" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-orange-50/30 border border-orange-100/50 rounded-xl p-4 mb-4">
                    <h4 className="text-[11px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5 mb-3"><FiMapPin size={12}/> Google Map Embed URI</h4>
                    <FormInput name={'map'} placeholder="Paste your Google Maps embed URL here..." label={<span className="text-xs font-bold text-gray-700">Map Iframe Source</span>} />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button loading={loader} onClick={() => noSelected({ form, setSelectedLang })} type='submit' className="!px-6 !py-2 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg !text-xs">
                        <FiSave size={13}/> {i18n?.t('Publish Contact Config')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ContactPage;

