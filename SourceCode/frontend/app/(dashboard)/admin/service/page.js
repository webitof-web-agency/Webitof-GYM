"use client";
import React, { useEffect, useState } from 'react';
import { Form, Modal, Tooltip } from 'antd';
import PageTitle from '../../components/common/page-title';
import Table from '../../components/form/table';
import { useAction, useFetch } from '../../../helpers/hooks';
import { delService, fetchServices, postService, postSingleImage } from '../../../helpers/backend';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import MultipleImageInput from '../../../../components/form/multiImage';
import { columnFormatter, noSelected } from '../../../helpers/utils';
import { useI18n } from '../../../providers/i18n';
import dayjs from 'dayjs';
import Image from 'next/image';
import { FiPlus, FiCalendar, FiBox, FiEdit2, FiImage, FiCompass } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const AdminService = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    let { languages, langCode } = useI18n();
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs
            : [fallbackLanguage];
    const [open, setOpen] = useState(false);
    const [data, getData, { loading }] = useFetch(fetchServices);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');
    const [formLoader, setFormLoader] = useState(false);

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en')
    }, [availableLanguages, langCode])

    const columns = [
        {
            text: 'Service Module', 
            dataField: "name", 
            formatter: (name, d) => (
                 <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 relative group">
                          {d?.icon ? (
                              <Image src={d?.icon} alt="icon" width={40} height={40} className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300"><FiBox/></div>
                          )}
                      </div>
                      <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-[13px] capitalize">{name?.[langCode] || name?.en || 'Unnamed'}</span>
                          <span className="text-[9px] font-bold text-[#5572fc] mt-0.5 tracking-widest uppercase">Offered Value</span>
                      </div>
                 </div>
            ) 
        },
        {
            text: 'Date Initialized',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: "Primary Marketing Image", 
            dataField: "image",
            formatter: (_, d) => (
                <div className="flex space-x-1">
                    {d?.image ? (
                        <div className="w-16 h-10 rounded border border-slate-200 overflow-hidden relative shadow-sm">
                             <Image src={d?.image} alt="hero" fill className="object-cover" />
                        </div>
                    ) : <span className="text-[10px] text-gray-400 font-bold bg-slate-50 px-2 py-1 border border-slate-100 rounded-md">Empty Media</span>}
                </div>
            ),
        },
        {
            text: "Brief Summary", 
            dataField: "description",
            formatter: (description) => (
                <div className='text-xs text-gray-600 font-medium line-clamp-2 max-w-[250px] leading-relaxed'>
                    <Tooltip title={description?.[langCode]?.length > 40 ? description?.[langCode] : ''}>
                        <span className='cursor-help italic'>
                            "{description?.[langCode]?.length > 40 ? description?.[langCode]?.slice(0, 40) + '...' : (description?.[langCode] || description?.en || '')}"
                        </span>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="mb-2">
                <PageTitle title="Service Portfolios" />
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
                            <FiPlus size={14} /> {i18n.t("Add Service")}
                        </Button>
                    }
                    onEdit={(values) => {
                        form.resetFields();
                        form.setFieldsValue({
                            name: values.name,
                            description: values.description,
                            icon: values?.icon ? [{ uid: '-1', name: 'icon.png', status: 'done', url: values.icon }] : [],
                            image: values?.image ? [{ uid: '-1', name: 'image.png', status: 'done', url: values.image }] : [],
                            _id: values._id,
                        });
                        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
                        setOpen(true);
                        setIsEdit(true);
                    }}
                    onDelete={delService}
                    indexed
                    pagination
                    langCode={langCode}
                    shadow={false}
                />
            </div>

            <Modal
                width={700}
                open={open}
                onCancel={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                         <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                              {isEdit ? <FiEdit2 size={15} /> : <FiBox size={15} />}
                         </div>
                         <span className="text-base font-bold text-gray-800 leading-tight">
                              {i18n.t(isEdit ? "Edit Existing Service" : "Format New Service Layout")}
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
                                l?.code === selectedLang
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                : 'bg-transparent text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-gray-800'
                            }`}
                            key={index}
                        >
                            {l?.name}
                        </button>
                    ))}
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    className="space-y-0"
                    onFinish={async (values) => {
                        setFormLoader(true);
                        try {
                            if (values?.icon[0]?.originFileObj) {
                                const image = values?.icon[0]?.originFileObj;
                                const { data } = await postSingleImage({ image: image, image_name: "service" });
                                values.icon = data;
                            } else {
                                values.icon = values?.icon[0]?.url ? values?.icon[0]?.url : values?.icon;
                            }

                            if (values?.image[0]?.originFileObj) {
                                const image = values?.image[0]?.originFileObj;
                                const { data } = await postSingleImage({ image: image, image_name: "service" });
                                values.image = data;
                            } else {
                                values.image = values?.image[0]?.url ? values?.image[0]?.url: values?.image;
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

                            const payload = {
                                _id: values?._id,
                                ...values,
                                ...formattedData
                            };
                            
                            await useAction(postService, payload, () => {
                                setOpen(false);
                                getData();
                            });
                        } finally {
                            setFormLoader(false);
                        }
                    }}
                >
                    {isEdit && <HiddenInput name="_id" />}

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-5">
                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2"><FiCompass size={12}/> Content Parameters</h4>
                         {availableLanguages.map((l, index) => (
                             <div key={index} style={{ display: l?.code === selectedLang ? 'block' : 'none' }}>
                                 <FormInput 
                                    placeholder={("e.g. Bodybuilding")} 
                                    label={<span className="text-xs font-bold text-gray-700">Service Name</span>} 
                                    name={['name', l?.code]} 
                                    required 
                                 />
                                 <div className="mt-2">
                                     <FormInput 
                                        placeholder={("Short promotional snippet for this service slot...")} 
                                        label={<span className="text-xs font-bold text-gray-700">Display Description</span>} 
                                        name={['description', l?.code]} 
                                        required 
                                        textArea 
                                     />
                                 </div>
                             </div>
                         ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 grid-cols-1 pt-2">
                         <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-3"><FiBox size={12}/> Service Icon Tracker</h4>
                              <MultipleImageInput name={"icon"} required />
                         </div>
                         <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-3"><FiImage size={12}/> Hero Feature Panel</h4>
                              <MultipleImageInput name={"image"} required />
                         </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-gray-100">
                         <Button 
                            type="button" 
                            onClick={() => { setOpen(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                         >
                            Cancel
                         </Button>
                         <Button type='submit' loading={formLoader} onClick={() => noSelected({ form, setSelectedLang })} className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 !font-semibold !rounded-lg !text-xs transition-all'>
                            {isEdit ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                            {i18n.t(isEdit ? "Update Directory" : "Deploy Slot")}
                         </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminService;
