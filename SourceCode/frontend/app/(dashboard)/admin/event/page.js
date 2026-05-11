'use client';
import dayjs from 'dayjs';
import { Modal, Switch, DatePicker, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../components/common/page-title';
import Table, { TableImage } from '../../components/form/table';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../components/form/input';
import MultipleImageInput from '../../components/form/multiImage';
import { useAction, useFetch } from '../../../helpers/hooks';
import { fetchEvents, postEvents, postSingleImage, deleteEvents } from '../../../helpers/backend';
import { columnFormatter, noSelected } from '../../../helpers/utils';
import { useI18n } from '../../../providers/i18n';
import { FiPlus, FiEdit2, FiCalendar, FiMapPin, FiImage, FiGlobe, FiCheckCircle } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const Page = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs
            : [fallbackLanguage];
    const [data, getData, { loading }] = useFetch(fetchEvents);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState();

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
    }, [availableLanguages, langCode]);

    const onFinish = async (values) => {
        if (values?.image[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postSingleImage({ image, image_name: 'event' });
            values.image = data;
        } else {
            values.image = values?.image[0]?.url;
        }
        const multiLangFields = ['name', 'description'];
        const formattedData = multiLangFields.reduce((acc, field) => {
            acc[field] = {};
            availableLanguages.forEach((lang) => {
                if (values[field] && values[field][lang.code]) {
                    acc[field][lang.code] = values[field][lang.code];
                }
            });
            return acc;
        }, {});
        const submitData = {
            ...formattedData,
            _id: values?._id,
            image: values?.image,
            name: values?.name,
            description: values?.description,
            location: values?.location,
            start_date: dayjs(values?.start_date),
            end_date: dayjs(values?.end_date),
            is_active: values?.is_active,
        };
        useAction(postEvents, submitData, () => {
            form.resetFields();
            setOpen(false);
            getData();
        });
    };

    const columns = [
        {
            text: 'Event',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50">
                        {d?.image
                            ? <TableImage url={d?.image} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><FiImage size={14} className="text-slate-300" /></div>
                        }
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-xs capitalize leading-tight line-clamp-1 max-w-[160px]">
                            {columnFormatter(d?.name)}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <FiMapPin size={9} /> {d?.location || '—'}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            text: 'Schedule',
            dataField: 'start_date',
            formatter: (_, d) => (
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded inline-flex items-center gap-1 w-fit">
                        <FiCalendar size={9} className="text-[#F97316]" />
                        <span className="font-bold text-gray-400">From</span> {dayjs(d?.start_date).format('DD MMM YYYY')}
                    </span>
                    <span className="text-[10px] text-gray-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded inline-flex items-center gap-1 w-fit">
                        <FiCalendar size={9} className="text-rose-400" />
                        <span className="font-bold text-gray-400">To</span> {dayjs(d?.end_date).format('DD MMM YYYY')}
                    </span>
                </div>
            ),
        },
        {
            text: 'Added',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title="Events Management" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    indexed
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
                            <FiPlus size={14} /> {i18n?.t('Add Event')}
                        </Button>
                    }
                    data={data?.docs}
                    columns={columns}
                    getData={getData}
                    onEdit={(values) => {
                        form.setFieldsValue({
                            ...values,
                            image: Array.isArray(values?.image) ? values?.image : [{ url: values?.image }],
                            start_date: dayjs(values?.start_date),
                            end_date: dayjs(values?.end_date),
                        });
                        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
                        setOpen(true);
                        setIsEdit(true);
                    }}
                    onReload={getData}
                    loading={loading}
                    onDelete={deleteEvents}
                />
            </div>

            <Modal
                destroyOnClose
                width={580}
                footer={null}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                            {isEdit ? <FiEdit2 size={15} /> : <FiCalendar size={15} />}
                        </div>
                        <span className="text-base font-bold text-gray-800 leading-tight">
                            {isEdit ? i18n?.t('Edit Event') : i18n?.t('Add New Event')}
                        </span>
                    </div>
                }
                open={open}
                onCancel={() => { setOpen(false); form.resetFields(); }}
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                {availableLanguages.length > 1 && (
                    <div className='flex items-center gap-2 mt-3 mb-1 bg-slate-50 p-1.5 rounded-xl shadow-inner border border-slate-100 overflow-x-auto'>
                        <div className="pl-2 pr-1 text-slate-400"><FiGlobe size={14} /></div>
                        {availableLanguages.map((l, index) => (
                            <button
                                type="button"
                                onClick={() => setSelectedLang(l.code)}
                                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                                    l.code === selectedLang
                                        ? 'bg-white text-[#F97316] shadow-sm border border-slate-200/50'
                                        : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
                                }`}
                                key={index}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>
                )}

                <Form form={form} onFinish={onFinish} layout='vertical' className='mt-3 space-y-0'>
                    {availableLanguages.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            {isEdit && <HiddenInput name='_id' />}

                            <div className="grid grid-cols-1 gap-0">
                                <MultipleImageInput label='Event Cover Image' name='image' required />
                                <FormInput label={`${i18n?.t('Event Name')} (${l.code.toUpperCase()})`} name={['name', l.code]} placeholder='e.g. Annual Fitness Gala' required />
                                <FormInput label={`${i18n?.t('Location')}`} name='location' required placeholder='e.g. City Gym Hall, Floor 2'
                                    prefix={<FiMapPin size={12} className="text-gray-400" />}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item label={<span className="text-xs font-bold text-gray-600">{i18n?.t('Start Date')}</span>} name='start_date' className="!mb-4">
                                    <DatePicker className="!w-full !rounded-lg" placeholder='Start Date' format='YYYY-MM-DD HH:mm' showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }} />
                                </Form.Item>
                                <Form.Item label={<span className="text-xs font-bold text-gray-600">{i18n?.t('End Date')}</span>} name='end_date' className="!mb-4">
                                    <DatePicker className="!w-full !rounded-lg" placeholder='End Date' format='YYYY-MM-DD HH:mm' showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }} />
                                </Form.Item>
                            </div>

                            <FormInput label={`${i18n?.t('Description')} (${l.code.toUpperCase()})`} textArea rows={4} name={['description', l.code]} required placeholder='Describe the event...' />

                            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <FiCheckCircle size={14} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-700">{i18n?.t('Event Active Status')}</span>
                                </div>
                                <Form.Item name='is_active' valuePropName='checked' className="!mb-0">
                                    <Switch size="small" />
                                </Form.Item>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                <Button type="button" onClick={() => { setOpen(false); form.resetFields(); }}
                                    className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs">
                                    Cancel
                                </Button>
                                <Button onClick={() => noSelected({ form, setSelectedLang })} type='submit'
                                    className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg !text-xs transition-all'>
                                    {isEdit ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                                    {isEdit ? i18n?.t('Save Changes') : i18n?.t('Create Event')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </Form>
            </Modal>
        </div>
    );
};

export default Page;

