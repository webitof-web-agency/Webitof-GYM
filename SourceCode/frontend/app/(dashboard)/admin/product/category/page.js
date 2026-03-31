"use client"
import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import { allProductCategory, delProductCategory, postProductCategory } from '../../../../helpers/backend';
import { useAction, useFetch } from '../../../../helpers/hooks';
import Button from '../../../../../components/common/button';
import Table from '../../../components/form/table';
import PageTitle from '../../../components/common/page-title';
import { columnFormatter } from '../../../../helpers/utils';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { useI18n } from '../../../../providers/i18n';
import dayjs from 'dayjs';
import { FiPlus, FiEdit2, FiTag, FiGlobe, FiCalendar, FiBox } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const page = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    let { languages, langCode } = useI18n();

    const [open, setOpen] = useState(false);
    const [data, getData, { loading }] = useFetch(allProductCategory);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState();
    const [formData, setFromData] = useState([])
    
    const availableLanguages = Array.isArray(languages?.docs) && languages.docs.length > 0
        ? languages.docs
        : [fallbackLanguage];

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en')
    }, [availableLanguages, langCode])

    const columns = [
        {
            text: 'Category Info',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                         <FiBox size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm capitalize">{columnFormatter(d?.name)}</span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5 uppercase">ID: {d?._id?.substring(Math.max(0, d?._id?.length - 6))}</span>
                    </div>
                </div>
            ),
        },
        {
            text: 'Date Created',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
    ];

    const handleNoSelected = () => {
        const values = form.getFieldsValue();
        let firstEmptyLang = null;
        for (const lang of availableLanguages) {
             if (!values?.name?.[lang.code]) {
                 firstEmptyLang = lang.code;
                 break;
             }
        }
        if (firstEmptyLang && firstEmptyLang !== selectedLang) {
             setSelectedLang(firstEmptyLang);
             setTimeout(() => form.submit(), 100);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title="Product Categories" />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    action={
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setOpen(true);
                                setIsEdit(false);
                            }}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} />
                            {i18n.t("Add Category")}
                        </Button>
                    }
                    onEdit={(values) => {
                        form.resetFields();
                        form.setFieldsValue({
                            ...values,
                        });
                        setOpen(true);
                        setIsEdit(true);
                    }}
                    onDelete={delProductCategory}
                    indexed
                    pagination
                    langCode={langCode}
                />
            </div>
            
            <Modal
                destroyOnClose={true}
                width={500}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                            {isEdit ? <FiEdit2 size={16} /> : <FiTag size={16} />}
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">{isEdit ? i18n?.t('Edit Category') : i18n?.t('Add New Category')}</span>
                        </div>
                    </div>
                }
                open={open}
                onCancel={() => { setOpen(false); form.resetFields(); }}
                footer={null}
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                {availableLanguages.length > 1 && (
                    <div className='flex items-center justify-start gap-2 mb-2 mt-0 bg-slate-50 p-1.5 rounded-xl shadow-inner border border-slate-100 overflow-x-auto'>
                        <div className="pl-2 pr-1 text-slate-400"><FiGlobe size={14} /></div>
                        {availableLanguages.map((l, index) => (
                            <button
                                type="button"
                                onClick={() => setSelectedLang(l.code)}
                                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                                    l.code === selectedLang
                                        ? 'bg-white text-[#5572fc] shadow-sm border border-slate-200/50'
                                        : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
                                }`}
                                key={index}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>
                )}
                
                <Form
                    form={form}
                    layout="vertical"
                    className={`mt-2 space-y-2.5 ${availableLanguages.length <= 1 ? 'pt-0' : ''}`}
                    onFinish={(values) => {
                        const multiLangFields = ['name'];
                        const formattedData = multiLangFields.reduce((acc, field) => {
                            acc[field] = {};
                            availableLanguages.forEach(lang => {
                                if (values[field] && values[field][lang.code]) {
                                    acc[field][lang.code] = values[field][lang.code];
                                }
                            });
                            return acc;
                        }, {});
                        
                        return useAction(
                            values?._id ? postProductCategory : postProductCategory,
                            {
                                ...formattedData,
                                _id: values?._id
                            },
                            () => {
                                setOpen(false);
                                getData();
                            }
                        );
                    }}
                >
                    {isEdit && <HiddenInput name="_id" />}

                    {
                        availableLanguages.map((l, index) => (
                            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                                <div className="grid grid-cols-1 gap-y-2">
                                    <FormInput
                                        name={['name', l.code]}
                                        label={`${i18n?.t('Category Name')} (${l.code.toUpperCase()})`}
                                        key={index}
                                        required
                                        onBlur={(e) => {
                                            if (formData?.length === 0) {
                                                setFromData([{ lang: selectedLang, value: e.target.value }])
                                            } else {
                                                const uniqueData = formData?.filter((data) => data?.lang !== selectedLang)
                                                const moreData = [...uniqueData, { lang: selectedLang, value: e.target.value }]
                                                setFromData(moreData)
                                            }
                                        }}
                                        placeholder={`e.g. Whey Protein`}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                                    <Button
                                        type="button"
                                        onClick={() => { setOpen(false); form.resetFields(); }}
                                        className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type='submit'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNoSelected();
                                            form.submit();
                                        }}
                                        className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 !font-semibold !rounded-lg block w-fit !text-xs transition-all'
                                    >
                                        {isEdit ? <FiEdit2 size={14} /> : <FiPlus size={14} />}
                                        {isEdit ? i18n?.t('Save Changes') : i18n?.t('Create Category')}
                                    </Button>
                                </div>
                            </div>
                        ))
                    }
                </Form>
            </Modal>
        </div>
    );
};

export default page;
