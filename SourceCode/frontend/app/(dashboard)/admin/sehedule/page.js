'use client';
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import Table from '../../components/form/table';
import { useAction, useFetch } from '../../../helpers/hooks';
import { delSchedule, fetchAdminSheduleList, fetchTrainers, postSchedule } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import { columnFormatter, noSelected } from '../../../helpers/utils';
import FormSelect from '../../components/form/select';
import PageTitle from '../../components/common/page-title';
import { FiPlus, FiCalendar, FiClock, FiUser, FiActivity, FiEdit2 } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const Sehedule = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { lang, languages, langCode } = useI18n();
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs
            : [fallbackLanguage];
    const [data, getData, { loading }] = useFetch(fetchAdminSheduleList);
    const [trainers] = useFetch(fetchTrainers);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
    }, [availableLanguages, langCode]);

    const columns = [
        {
            text: "Day of Week",
            dataField: "day",
            formatter: (_, d) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 border border-orange-100/50">
                        <FiCalendar size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-800">{d?.day}</span>
                </div>
            )
        },
        {
            text: "Time Frame",
            dataField: "time_slots",
            formatter: (_, d) => (
                <span className="text-[10px] font-bold text-gray-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded inline-flex items-center gap-1.5 uppercase shadow-sm">
                    <FiClock size={11} className="text-[#F97316]"/> {d?.time_slots}
                </span>
            )
        },
        {
            text: "Assigned Trainer",
            dataField: "trainer",
            formatter: (_, d) => (
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 capitalize">
                    <FiUser size={12} className="text-slate-400"/> {d?.trainer?.name || 'Unassigned'}
                </span>
            )
        },
        {
            text: "Event Name",
            dataField: "event",
            formatter: (_, d) => (
                <span className="text-xs text-gray-600 font-medium line-clamp-1 max-w-[200px]" title={columnFormatter(d?.event)}>
                    {columnFormatter(d?.event)}
                </span>
            )
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="mb-2">
                <PageTitle title={'Schedule Manager'} />
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
                            <FiPlus size={14} /> {i18n?.t("Draft Schedule")}
                        </Button>
                    }
                    onEdit={(values) => {
                        form.resetFields();
                        form.setFieldsValue({
                            ...values,
                            trainer: values?.trainer?._id,
                        });
                        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
                        setOpen(true);
                        setIsEdit(true);
                    }}
                    onDelete={delSchedule}
                    indexed
                    pagination={true}
                    lang={lang}
                    langCode={langCode}
                    shadow={false}
                />
            </div>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                         <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                              {isEdit ? <FiEdit2 size={15} /> : <FiCalendar size={15} />}
                         </div>
                         <span className="text-base font-bold text-gray-800 leading-tight">
                              {i18n?.t(isEdit ? "Edit Existing Schedule" : "Add New Schedule")}
                         </span>
                    </div>
                }
                footer={null}
                destroyOnClose={true}
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '24px' } }}
            >
                <div className="flex justify-start flex-wrap gap-2 mt-2 mb-4">
                    {availableLanguages.map((l, index) => (
                        <button
                            onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wide transition-all border ${
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
                    className="space-y-0"
                    onFinish={(values) => {
                        const multiLangFields = ['event'];
                        const formattedData = multiLangFields.reduce((acc, field) => {
                            acc[field] = {};
                            availableLanguages.forEach((lang) => {
                                if (values[field] && values[field][lang.code]) {
                                    acc[field][lang.code] = values[field][lang.code];
                                }
                            });
                            return acc;
                        }, {});
                        const finalData = {
                            _id: values?._id || "",
                            day: values?.day || "",
                            time_slots: values?.time_slots || "",
                            event: formattedData.event || {},
                            trainer: values?.trainer || ""
                        };

                        return useAction(
                            postSchedule,
                            { ...finalData },
                            () => { setOpen(false); getData(); }
                        );
                    }}
                >
                    {isEdit && <HiddenInput name="_id" />}
                    
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 mb-5 space-y-4">
                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2"><FiActivity size={12}/> Shift Core Details</h4>
                         
                         <div className="grid md:grid-cols-2 gap-4 grid-cols-1 place-items-start">
                             <div className="w-full">
                                 <FormSelect
                                     placeholder={"Select Day"}
                                     name="day"
                                     label={<span className="text-xs font-bold text-gray-700">Reporting Day</span>}
                                     required
                                     className="!w-full"
                                     options={[
                                         { label: i18n?.t('Saturday'), value: "Saturday" },
                                         { label: i18n?.t('Sunday'), value: "Sunday" },
                                         { label: i18n?.t('Monday'), value: "Monday" },
                                         { label: i18n?.t('Tuesday'), value: "Tuesday" },
                                         { label: i18n?.t('Wednesday'), value: "Wednesday" },
                                         { label: i18n?.t('Thursday'), value: "Thursday" },
                                         { label: i18n?.t('Friday'), value: "Friday" },
                                     ]}
                                 />
                             </div>
                             <div className="w-full">
                                 <FormSelect
                                     placeholder={'Select Time Block'}
                                     name="time_slots"
                                     label={<span className="text-xs font-bold text-gray-700">Session Window</span>}
                                     required
                                     className="!w-full"
                                     options={[
                                         { label: "9:00 am", value: "9:00 am" },
                                         { label: "10:00 am", value: "10:00 am" },
                                         { label: "11:00 am", value: "11:00 am" },
                                         { label: "12:00 pm", value: "12:00 pm" },
                                         { label: "1:00 pm", value: "1:00 pm" },
                                         { label: "2:00 pm", value: "2:00 pm" },
                                         { label: "3:00 pm", value: "3:00 pm" },
                                         { label: "4:00 pm", value: "4:00 pm" },
                                         { label: "5:00 pm", value: "5:00 pm" },
                                         { label: "6:00 pm", value: "6:00 pm" },
                                         { label: "7:00 pm", value: "7:00 pm" },
                                         { label: "8:00 pm", value: "8:00 pm" },
                                     ]}
                                 />
                             </div>
                         </div>
                         
                         <FormSelect
                             placeholder={'Assign Staff Member'}
                             name="trainer"
                             label={<span className="text-xs font-bold text-gray-700">Designated Trainer</span>}
                             required
                             className="!w-full"
                             options={trainers?.docs?.map((trainer) => ({
                                 label: trainer?.name,
                                 value: trainer?._id,
                             }))}
                         />
                    </div>
                    
                    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                         {availableLanguages.map((l, index) => (
                             <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                                 <FormInput
                                     name={['event', l.code]}
                                     label={<span className="text-xs font-bold text-gray-700">Display Event Title</span>}
                                     placeholder={'e.g. Morning Cardio'}
                                     key={index}
                                     required
                                 />
                             </div>
                         ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-gray-100">
                         <Button 
                            type="button" 
                            onClick={() => { setOpen(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                         >
                            Cancel
                         </Button>
                         <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg !text-xs transition-all'>
                            {isEdit ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                            {i18n.t(isEdit ? "Save Configuration" : "Deploy Schedule")}
                         </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Sehedule;

