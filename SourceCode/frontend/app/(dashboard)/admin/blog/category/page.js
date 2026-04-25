"use client";

import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/common/page-title';
import Table from '../../../components/form/table';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import Button from '../../../../../components/common/button';
import { useAction, useFetch } from '../../../../helpers/hooks';
import { blogCategoryList, delCategory, postCategory } from '../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import { columnFormatter, noSelected } from '../../../../helpers/utils';
import dayjs from 'dayjs';
import { FiPlus, FiCalendar, FiFolder, FiEdit2 } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const BlogCategory = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(blogCategoryList);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState();
    const [open, setOpen] = useState(false);
    const [formData, setFromData] = useState([])
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs
            : [fallbackLanguage];

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en')
    }, [availableLanguages, langCode])

    const columns = [
        {
            text: 'Category Info',
            dataField: "name",
            formatter: (value) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0 border border-indigo-100/50">
                        <FiFolder size={15} />
                    </div>
                    <span className="text-xs font-bold text-gray-800 capitalize">{columnFormatter(value)}</span>
                </div>
            )
        },
        {
            text: 'Date Added',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        }
    ];

    const handleSubmit = (values) => {
        return useAction(
            values?._id ? postCategory : postCategory,
            {
                _id: values?._id,
                name: values?.name,
            },
            () => {
                setOpen(false);
                getData();
            }
        );
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="mb-2">
                <PageTitle title={i18n.t("Blog Categories")} />
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
                                setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
                                setOpen(true);
                                setIsEdit(false);
                            }}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} /> {i18n.t("Add Category")}
                        </Button>
                    }
                    onEdit={(values) => {
                        form.resetFields();
                        form.setFieldsValue({
                            ...values,
                        });
                        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
                        setOpen(true);
                        setIsEdit(true);
                    }}
                    onDelete={delCategory}
                    indexed
                    pagination
                    langCode={langCode}
                    shadow={false}
                />
            </div>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                            {isEdit ? <FiEdit2 size={15} /> : <FiFolder size={15} />}
                        </div>
                        <span className="text-base font-bold text-gray-800 leading-tight">
                            {i18n.t(isEdit ? "Edit Category" : "Add Category")}
                        </span>
                    </div>
                }
                footer={null}
                destroyOnClose={true}
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                <div className="flex justify-start flex-wrap gap-2 mt-2 mb-4">
                    {availableLanguages.map((l, index) => (
                        <button
                            onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wide transition-all border ${
                                l.code === selectedLang
                                ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                                : 'bg-transparent text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-gray-800'
                            }`}
                            key={index}
                        >
                            {l.name}
                        </button>
                    ))}
                </div>
                
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className='mt-3 space-y-0'
                >
                    {isEdit && <HiddenInput name="_id" />}
                    {availableLanguages.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <FormInput
                                name={['name', l.code]}
                                label={<span className="text-xs font-bold text-gray-700">Category Name</span>}
                                placeholder={i18n.t('Enter Name')}
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
                            />
                        </div>
                    ))}
                    
                    <div className="flex justify-end gap-2 pt-3 mt-4 border-t border-gray-100">
                         <Button 
                            type="button" 
                            onClick={() => { setOpen(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                         >
                            Cancel
                         </Button>
                         <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg !text-xs transition-all'>
                            {isEdit ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                            {i18n.t(isEdit ? "Save Changes" : "Create Category")}
                         </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogCategory;

