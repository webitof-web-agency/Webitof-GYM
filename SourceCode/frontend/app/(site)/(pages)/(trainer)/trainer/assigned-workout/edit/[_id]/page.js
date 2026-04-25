'use client';
import React, { useEffect, useState } from 'react';
import { Form, Checkbox, DatePicker, Radio, notification } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAction, useFetch } from '../../../../../../../helpers/hooks';
import { fetchMembers, fetchServices, fetchTrainerGroupList, singleTrainerWorkout, updateTrainerWorkout } from '../../../../../../../helpers/backend';
import FormInput, { HiddenInput } from '../../../../../../../../components/form/input';
import { useI18n } from '../../../../../../../providers/i18n';
import FormSelect from '../../../../../../../../components/form/select';
import Button from '../../../../../../../../components/common/button';
import { columnFormatter, noSelected } from '../../../../../../../helpers/utils';
import dayjs from 'dayjs';

const Page = ({ params }) => {
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedWorkouts, setSelectedWorkouts] = useState([]);
    const [groupList, getGroupList] = useFetch(fetchTrainerGroupList);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedLang, setSelectedLang] = useState();
    const [serveices, getServeices] = useFetch(fetchServices);
    const { languages, langCode } = useI18n();
    const [selectedRadio, setSelectedRadio] = useState(1);
    const [data, getData] = useFetch(singleTrainerWorkout, {}, false);
    const [members, getMembers] = useFetch(fetchMembers, {}, false);
    const i18n = useI18n();
    const [form] = Form.useForm();
    const { push } = useRouter();

    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length
            ? languages.docs
            : [{ code: 'en', name: 'English' }];

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages?.[0]?.code || 'en');
    }, [langCode, languages]);



    useEffect(() => {
        if (params?._id) {
            getData({ _id: params?._id });
        }
    }, [params?._id]);

    useEffect(() => {
        if (data) {
            getMembers({ _id: data?.group?._id });
            let members = data?.members?.map(m => m._id) || [];
            form.setFieldsValue({
                ...data,
                start_date: dayjs(data?.start_date),
                end_date: dayjs(data?.end_date),
                group: data?.group?._id,
                selected_days: data?.selected_days || [],
                members: members,
                description: data?.description || {},
            });

            setSelectedDays(data?.selected_days || []);
            setSelectedWorkouts(data?.workouts?.map((item) => item?._id) || []);
        }
    }, [data]);
    const onFinish = (values) => {
        const multiLangFields = ['description'];
        const formattedData = multiLangFields.reduce((acc, field) => {
            acc[field] = {};
            availableLanguages.forEach((lang) => {
                if (values[field] && values[field][lang.code]) {
                    acc[field][lang.code] = values[field][lang.code];
                }
            });
            return acc;
        }, {});

        if (selectedDays.length === 0) {
            notification.error({ message: 'Please select days' });
            return;
        }
        if (selectedWorkouts.length === 0) {
            notification.error({ message: 'Please select workout' });
            return;
        }

        const payload = {
            ...formattedData,
            _id: values._id,
            start_date: dayjs(values?.start_date).format('YYYY-MM-DD'),
            end_date: dayjs(values?.end_date).format('YYYY-MM-DD'),
            group: values?.group,
            workouts: selectedWorkouts,
            selected_days: values?.selected_days,
            description: values?.description,
        };
        const payload2 = {
            ...formattedData,
            _id: values._id,
            start_date: dayjs(values?.start_date).format('YYYY-MM-DD'),
            end_date: dayjs(values?.end_date).format('YYYY-MM-DD'),
            members: values?.members,
            workouts: selectedWorkouts,
            selected_days: values?.selected_days,
            description: values?.description,
        };

        useAction(updateTrainerWorkout, selectedRadio === 2 ? payload2 : payload, () => {
            push('/trainer/assigned-workout');
            form.resetFields();
        });
    };

    const handleGroupChange = (value) => {
        getMembers({ _id: value });
    };

    const handleRadioChange = (e) => {
        setSelectedRadio(e.target.value);
        if (e.target.value === 1) {
            form.setFieldsValue({ members: [] });
        } else {
            setSelectedGroup(null);
        }
    };

    return (
        <div className="bg-white">
            <div className=''>
                <div className='flex justify-between items-center mb-6'>
                    <h3 className='text-xl font-bold text-slate-800 tracking-tight' >{i18n?.t("Edit Workout")}</h3>
                    <Button onClick={() => push('/trainer/assigned-workout')} type="button" className='!h-fit !py-2.5 !px-6 rounded-xl shadow-sm'>{i18n?.t("Back")}</Button>
                </div>
                <Form form={form} layout='horizontal' onFinish={onFinish}>
                    <div className="w-full sm:flex gap-6 my-4">
                        <Radio.Group onChange={handleRadioChange} value={selectedRadio}>
                            <Radio value={1}>{i18n?.t("Group")}</Radio>
                            <Radio value={2}>{i18n?.t("Member")}</Radio>
                        </Radio.Group>
                    </div>

                    <HiddenInput name="_id" />
                    <div className={`grid ${selectedRadio === 1 ? 'grid-cols-1' : 'md:grid-cols-2'} grid-cols-1 lg:gap-4 mb-4 gap-2`}>
                        <FormSelect
                            name="group"
                            label="Group"
                            options={groupList?.docs?.map(group => ({
                                label: columnFormatter(group?.name),
                                value: group?._id,
                            }))}
                            placeholder="Select group"
                            onChange={handleGroupChange}
                        />
                        {selectedRadio === 2 && (
                            <div className='multiselect'>
                                <FormSelect
                                    name="members"
                                    label="Members"
                                    multi={true}
                                    options={members?.docs?.[0]?.members?.map(m => ({
                                        label: m?.name,
                                        value: m?._id,
                                    })) || []}
                                    placeholder="Please select group first to add members"
                                    className='!overflow-auto'
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className='grid md:grid-cols-2 grid-cols-1 lg:gap-4 gap-2'>
                            <Form.Item name="start_date" label={i18n?.t('Start Date')} rules={[{ required: true, message: i18n?.t('Please select start date') }]}>
                                <DatePicker
                                    className="border pt-2 pb-[11px] rounded w-full"
                                    suffixIcon={<CalendarOutlined />}
                                />
                            </Form.Item>
                            <Form.Item name="end_date" label={i18n?.t('End Date')} rules={[{ required: true, message: i18n?.t('Please select end date') }]}>
                                <DatePicker
                                    className="border pt-2 pb-[11px] rounded w-full"
                                    suffixIcon={<CalendarOutlined />}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div className='relative mt-4 mb-14'>
                        <div className='flex gap-3 items-center z-50 absolute right-0'>

                            <div className='flex h-fit gap-3'>
                                {availableLanguages?.map((l, index) => (
                                    <div
                                        onClick={() => setSelectedLang(l.code)}
                                        className={`rounded-full cursor-pointer px-3 py-1 text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                                            ? 'bg-[#F97316] text-white '
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        key={index}
                                    >
                                        {l.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {availableLanguages?.map((l, index) => (
                            <div
                                className='selector-width w-full space-y-6'
                                key={index}
                                style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                            >
                                <div className='w-full gap-6 whitespace-pre sm:flex'>
                                    <FormInput
                                        required={true}
                                        name={['description', l.code]}
                                        textArea={true}
                                        rows={4}
                                        placeholder={i18n?.t('Description')}
                                        label={i18n?.t('Description')}
                                    />
                                </div>

                            </div>
                        ))}
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 lg:gap-4 gap-2 mt-5'>
                        <div className='mb-4 rounded border'>
                            <div className='rounded-t bg-[#F97316] p-3 text-white'>
                                <h3 className='text-lg font-semibold'>{i18n?.t("Select Day")}</h3>
                            </div>
                            <div className='p-[26px] '>
                                <Form.Item name='selected_days'>
                                    <Checkbox.Group
                                        value={selectedDays}
                                        onChange={(checkedValues) => setSelectedDays(checkedValues)}
                                    >
                                        {['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                                            <div className='flex items-center space-x-4 capitalize' key={day}>
                                                <Checkbox value={day}></Checkbox>
                                                <li>{i18n?.t(day)}</li>
                                            </div>
                                        ))}
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                        </div>
                        <div className='mb-4 rounded border'>
                            <div className='rounded-t bg-[#F97316] p-3 text-white'>
                                <h3 className='text-lg font-semibold'>{i18n?.t("Select Workouts")}</h3>
                            </div>
                            <div className='p-[26px]  overflow-y-auto h-[35vh] hide-scrollbar'>
                                {
                                    <Form.Item>
                                        <Checkbox.Group
                                            value={selectedWorkouts}
                                            onChange={(checkedValues) => setSelectedWorkouts(checkedValues)}
                                        >
                                            {serveices?.docs?.map((feat) => (
                                                <div className='flex items-center space-x-4' key={feat._id}>
                                                    <Checkbox value={feat._id}></Checkbox>
                                                    <li>{columnFormatter(feat?.name)}</li>
                                                </div>
                                            ))}
                                        </Checkbox.Group>
                                    </Form.Item>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='mt-6 flex justify-start'>
                        <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">{i18n?.t("Submit")}</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Page;
