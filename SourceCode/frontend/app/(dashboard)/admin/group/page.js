'use client';
import { Form, Modal, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchGroups, delGroup, addGroup, groupTrainers, postSingleImage } from '../../../helpers/backend';
import { useAction, useFetch } from '../../../helpers/hooks';
import Table, { TableImage } from '../../components/form/table';
import { useI18n } from '../../../providers/i18n';
import { columnFormatter } from '../../../helpers/utils';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import FormSelect from '../../../../components/form/select';
import MultipleImageInput from '../../../../components/form/multiImage';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';
import { FiPlus, FiTrash2, FiUsers, FiEdit2, FiGlobe, FiCalendar } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const page = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchGroups);
    const [trainers] = useFetch(groupTrainers);
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [formData, setFromData] = useState([]);
    
    const availableLanguages = Array.isArray(languages?.docs) && languages.docs.length > 0
        ? languages.docs
        : [fallbackLanguage];

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
    }, [availableLanguages, langCode]);

    const columns = [
        {
            text: 'Image & Name',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 bg-white">
                         <TableImage url={d?.image ? d?.image : '/defaultimg.jpg'} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-xs">{columnFormatter(d?.name)}</span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">ID: {d?._id?.substring(Math.max(0, d?._id?.length - 6))}</span>
                    </div>
                </div>
            ),
        },
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: 'Status',
            dataField: 'status',
            formatter: (_, d) => (
                <div className="flex items-center">
                    {d?.status ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold capitalize bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold capitalize bg-rose-50 text-rose-600 border border-rose-100/50">
                            Inactive
                        </span>
                    )}
                </div>
            ),
        },
    ];

    const onFinish = async (values) => {
        if (values?.image?.[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postSingleImage({ image: image, image_name: 'feature' });
            values.image = data;
        } else {
            values.image = values?.image?.[0]?.url;
        }
        
        const multiLangFields = ['name', 'facilities'];
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
            facilities: values?.facilities,
            assign_trainers: values?.assign_trainers,
            status: values?.status,
        };
        
        useAction(addGroup, submitData, () => {
            setOpen(false);
            getData();
            form.resetFields();
        });
    };

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
                <PageTitle title={'Group / Batch List'} />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    action={
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    setIsEdit(false);
                                    setOpen(true);
                                }}
                                className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                            >
                                <FiPlus size={14} />
                                {i18n?.t('Add Group')}
                            </Button>
                        </div>
                    }
                    onEdit={(values) => {
                        form.setFieldsValue({
                            ...values,
                            assign_trainers: values?.assign_trainers?.map((t) => t?._id),
                            name: values?.name,
                            image: Array.isArray(values?.image)
                                ? values?.image
                                : [{ url: values?.image }],
                            facilities: values?.facilities,
                            status: values?.status,
                        });
                        setOpen(true);
                        setIsEdit(true);
                    }}
                    data={data}
                    columns={columns}
                    onDelete={delGroup}
                    indexed
                    pagination
                    onReload={getData}
                    loading={loading}
                />
            </div>

            <Modal
                open={open}
                onCancel={() => {
                    setOpen(false);
                    form.resetFields();
                }}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                            {isEdit ? <FiEdit2 size={16} /> : <FiUsers size={16} />}
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">{isEdit ? i18n?.t('Edit Group') : i18n?.t('Add New Group')}</span>
                        </div>
                    </div>
                }
                footer={null}
                destroyOnClose={true}
                className="custom-modal rounded-xl"
                width={550}
                styles={{ content: { padding: '20px' } }}
            >
                {availableLanguages.length > 1 && (
                    <div className='flex items-center justify-start gap-2 mb-2 mt-0 bg-slate-50 p-1.5 rounded-xl shadow-inner border border-slate-100 overflow-x-auto'>
                        <div className="pl-2 pr-1 text-slate-400"><FiGlobe size={14} /></div>
                        {availableLanguages.map((l, index) => (
                            <button
                                type='button'
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
                
                <Form form={form} layout='vertical' onFinish={onFinish} className={`mt-2 space-y-2.5 ${availableLanguages.length <= 1 ? 'pt-0' : ''}`}>
                    {availableLanguages.map((l, index) => (
                        <div
                            key={index}
                            style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                            className="space-y-2.5"
                        >
                            {isEdit && <HiddenInput name='_id' />}
                            
                            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 mb-1">
                                <MultipleImageInput label={'Group Cover Image'} name={'image'} required />
                            </div>

                            <div className="grid grid-cols-1 gap-y-2">
                                <FormInput
                                    name={['name', l.code]}
                                    label={`${i18n?.t('Group Name')} (${l.code.toUpperCase()})`}
                                    placeholder={i18n?.t('e.g. Morning Yoga Batch')}
                                    required
                                    onBlur={(e) => {
                                        if (formData?.length === 0) {
                                            setFromData([{ lang: selectedLang, value: e.target.value }]);
                                        } else {
                                            const uniqueData = formData?.filter((data) => data?.lang !== selectedLang);
                                            setFromData([...uniqueData, { lang: selectedLang, value: e.target.value }]);
                                        }
                                    }}
                                />

                                <div className="py-0">
                                    <h3 className='text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2'>{i18n?.t('Facilities & Perks')}</h3>
                                    <Form.List name={'facilities'}>
                                        {(fields, { add, remove }) => (
                                            <div className='space-y-2'>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <div key={key} className='flex items-start gap-x-2'>
                                                        <div className='w-full'>
                                                            <FormInput
                                                                {...restField}
                                                                name={[name, l.code]}
                                                                placeholder={i18n?.t('e.g. Free Towels')}
                                                                rules={[{ required: true, message: i18n?.t('Please provide a facility') }]}
                                                                className="!mb-0"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(name)}
                                                            className='w-10 h-10 mt-0 flex-shrink-0 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300'
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type='button'
                                                    onClick={() => add()}
                                                    className='w-full border-2 border-dashed border-slate-200 hover:border-[#5572fc] bg-slate-50 hover:bg-[#5572fc]/5 text-gray-500 hover:text-[#5572fc] transition-all duration-300 rounded-lg py-2.5 text-xs font-bold flex items-center justify-center gap-1.5'
                                                >
                                                    <FiPlus size={14} />
                                                    {i18n?.t('Add Facility')}
                                                </button>
                                            </div>
                                        )}
                                    </Form.List>
                                </div>
                            </div>
                            
                            <div className="pt-2 border-t border-slate-100">
                                <div className="mb-2">
                                    <FormSelect
                                        placeholder={i18n?.t('Select Trainers')}
                                        name={'assign_trainers'}
                                        label={i18n?.t('Assign Trainers')}
                                        required
                                        options={trainers?.map((trainer) => ({
                                            label: trainer.name,
                                            value: trainer._id,
                                        }))}
                                        multi={true}
                                    />
                                </div>
                                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-700">Group Status</span>
                                        <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-none">Toggle to activate or deactivate</span>
                                    </div>
                                    <Form.Item name='status' valuePropName='checked' className="mb-0 !p-0 hidden-margins">
                                        <Switch />
                                    </Form.Item>
                                </div>
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
                                    {isEdit ? i18n?.t('Save Changes') : i18n?.t('Create Group')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </Form>
            </Modal>
        </div>
    );
};

export default page;
