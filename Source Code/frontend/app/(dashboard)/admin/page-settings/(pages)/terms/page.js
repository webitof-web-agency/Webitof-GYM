'use client';
import React, { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useI18n } from '../../../../../providers/i18n';
import { useFetch } from '../../../../../helpers/hooks';
import { fetchSinglePage, postPage } from '../../../../../helpers/backend';
import { HiddenInput } from '../../../../../../components/form/input';
import Button from '../../../../../../components/common/button';
import JodiEditor from '../../../../../../components/form/jodiEditor';
import { noSelected } from '../../../../../helpers/utils';
import { FiFileText, FiSave } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const TermsPage = ({ slug }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs : [fallbackLanguage];
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    const [selectedLang, setSelectedLang] = useState('en');
    const [loader, setLoader] = useState(false);

    useEffect(() => { setSelectedLang(langCode || availableLanguages[0]?.code || 'en'); }, [availableLanguages, langCode]);
    useEffect(() => { getPage({ slug: slug }); }, [slug]);
    useEffect(() => {
        form.setFieldsValue({ _id: page?._id, title: page?.title, slug: page?.slug || slug, content: page?.content });
    }, [page]);

    const handleSubmit = async (values) => {
        setLoader(true);
        try {
            const res = await postPage({
                _id: values?._id ? values?._id : undefined,
                title: values?.title || 'Terms & Condition',
                slug: values?.slug || page?.slug,
                content_type: 'json', content: values.content
            });
            if (res?.error === false) { message.success(res?.msg); getPage({ slug: slug }); }
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><FiFileText size={16} /></div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800 leading-tight">Terms of Service Editor</h3>
                        <p className="text-[11px] text-gray-500 font-medium">Legal usage rules and platform agreements</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((l, index) => (
                        <button key={index} onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wide transition-all border ${l.code === selectedLang ? 'bg-orange-500 text-white border-orange-500' : 'bg-transparent text-gray-500 border-gray-200 hover:bg-slate-50'}`}>
                            {l.name}
                        </button>
                    ))}
                </div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit} className="p-6">
                <HiddenInput name="_id" />
                <HiddenInput name="slug" />
                {availableLanguages.map((l, index) => (
                    <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                        <JodiEditor name={['content', l.code]} label={<span className="text-xs font-bold text-gray-700">Terms Document Content</span>} required={l.code === langCode} />
                    </div>
                ))}
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
                    <Button loading={loader} onClick={() => noSelected({ form, setSelectedLang })} type='submit' className="!px-6 !py-2 flex items-center gap-1.5 shadow-md shadow-orange-500/20 !font-semibold !rounded-lg !text-xs !bg-orange-500 hover:!shadow-orange-500/30 border-orange-500">
                        <FiSave size={13}/> {i18n.t('Publish Terms Document')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default TermsPage;
