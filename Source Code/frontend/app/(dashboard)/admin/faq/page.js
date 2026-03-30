"use client";
import React, { useEffect, useState } from 'react';
import { Form, message, Modal, Tooltip } from 'antd';

import { useFetch } from '../../../helpers/hooks';
import { delFaq, fetchFaq, postFaq } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import { columnFormatter, noSelected } from '../../../helpers/utils';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';
import { FiPlus, FiEdit2, FiHelpCircle, FiGlobe, FiCalendar } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const AdminFaq = () => {
    const i18n = useI18n()
    const [form] = Form.useForm();
    let { languages, langCode } = useI18n();
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs
            : [fallbackLanguage];
    const [data, getData, { loading }] = useFetch(fetchFaq);

    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en')
    }, [availableLanguages, langCode])

    const columns = [
        {
            text: 'Question',
            dataField: 'question',
            formatter: (question) => (
                <div className="flex flex-col gap-1 max-w-[280px]">
                    <span className="font-bold text-gray-800 text-xs leading-snug line-clamp-2">
                        {columnFormatter(question)}
                    </span>
                </div>
            ),
        },
        {
            text: 'Answer',
            dataField: 'answer',
            formatter: (answer) => (
                <Tooltip title={columnFormatter(answer)?.length > 60 ? columnFormatter(answer) : ''} placement="topLeft">
                    <span className="text-xs text-gray-500 leading-relaxed line-clamp-2 max-w-[280px] cursor-help">
                        {columnFormatter(answer)?.length > 60
                            ? columnFormatter(answer)?.slice(0, 60) + '...'
                            : columnFormatter(answer)}
                    </span>
                </Tooltip>
            ),
        },
        {
            text: 'Created',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
    ];

    const handleSubmit = (values) => {
        postFaq(values).then((res) => {
            if (res?.error === false) {
                message.success(res?.msg);
                setOpen(false);
                getData();
            }
        });
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title="Frequently Asked Questions" />
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
                            <FiPlus size={14} />
                            {i18n?.t("Add FAQ")}
                        </Button>
                    }
                    onEdit={(values) => {
                        form.resetFields();
                        form.setFieldsValue({ ...values });
                        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
                        setOpen(true);
                        setIsEdit(true);
                    }}
                    onDelete={delFaq}
                    indexed
                    pagination
                    langCode={langCode}
                />
            </div>

            <Modal
                destroyOnClose
                width={520}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                            {isEdit ? <FiEdit2 size={15} /> : <FiHelpCircle size={15} />}
                        </div>
                        <span className="text-base font-bold text-gray-800 block leading-tight">
                            {isEdit ? i18n?.t('Edit FAQ') : i18n?.t('Add New FAQ')}
                        </span>
                    </div>
                }
                open={open}
                onCancel={() => { setOpen(false); form.resetFields(); }}
                footer={null}
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                {availableLanguages.length > 1 && (
                    <div className='flex items-center gap-2 mt-3 mb-2 bg-slate-50 p-1.5 rounded-xl shadow-inner border border-slate-100 overflow-x-auto'>
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

                <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-3 space-y-0">
                    {isEdit && <HiddenInput name="_id" />}

                    {availableLanguages.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <FormInput
                                name={['question', l.code]}
                                label={`${i18n?.t('Question')} (${l.code.toUpperCase()})`}
                                required
                                placeholder="e.g. What are the gym timings?"
                            />
                            <FormInput
                                name={['answer', l.code]}
                                textArea
                                label={`${i18n?.t('Answer')} (${l.code.toUpperCase()})`}
                                required
                                placeholder="Write the answer here..."
                            />
                        </div>
                    ))}

                    <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={() => { setOpen(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            onClick={() => noSelected({ form, setSelectedLang })}
                            className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 hover:shadow-lg !font-semibold !rounded-lg !text-xs transition-all'
                        >
                            {isEdit ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                            {isEdit ? i18n?.t('Save Changes') : i18n?.t('Create FAQ')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminFaq;
