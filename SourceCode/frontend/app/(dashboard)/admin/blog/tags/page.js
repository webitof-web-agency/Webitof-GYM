"use client";
import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAction, useFetch } from '../../../../helpers/hooks';
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import Table from '../../../components/form/table';
import Button from '../../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { delTag, fetchTagsList, postTag } from '../../../../helpers/backend';
import { columnFormatter, noSelected } from '../../../../helpers/utils';
import dayjs from 'dayjs';
import { FiPlus, FiCalendar, FiTag, FiEdit2 } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const BlogTags = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchTagsList);
    let { languages, langCode } = useI18n();
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState();
    const [open, setOpen] = useState(false);
    
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs
            : [fallbackLanguage];

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en')
    }, [availableLanguages, langCode])

    const columns = [
        {
            text: 'Tag Identifier',
            dataField: "name",
            formatter: (value) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 border border-orange-100/50 transform -rotate-12">
                        <FiTag size={15} />
                    </div>
                    <span className="text-xs font-bold text-gray-800 lowercase tracking-wide">#{columnFormatter(value)?.replace(/\s+/g, '')}</span>
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
        const formattedData = {};
        availableLanguages.forEach((lang) => {
            const v = values?.name?.[lang.code];
            if (v) formattedData[lang.code] = v;
        });

        return useAction(
            values?._id ? postTag : postTag,
            {
                name: formattedData,
                _id: values?._id,
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
                <PageTitle title={("Blog Tags")} />
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
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} /> {i18n?.t("Create Tag")}
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
                    onDelete={delTag}
                    indexed
                    pagination
                    shadow={false}
                />
            </div>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center transform -rotate-12">
                            {isEdit ? <FiEdit2 size={15} /> : <FiTag size={15} />}
                        </div>
                        <span className="text-base font-bold text-gray-800 leading-tight">
                            {i18n.t(isEdit ? "Edit Blog Tag" : "Create Blog Tag")}
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
                                ? 'bg-orange-50 text-orange-600 border-orange-200'
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
                    className="mt-3 space-y-0"
                >
                    {isEdit && <HiddenInput name="_id" />}
                    
                    <div>
                        {availableLanguages.map((l, index) => (
                            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                                <FormInput
                                    name={['name', l.code]}
                                    label={<span className="text-xs font-bold text-gray-700">Tag Value</span>}
                                    key={index}
                                    required={true}
                                    placeholder={"e.g. fitness"}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-3 mt-4 border-t border-gray-100">
                         <Button 
                            type="button" 
                            onClick={() => { setOpen(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                         >
                            Cancel
                         </Button>
                         <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 !font-semibold !rounded-lg !text-xs transition-all'>
                            {isEdit ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                            {i18n.t(isEdit ? "Save Changes" : "Create Tag")}
                         </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogTags;
