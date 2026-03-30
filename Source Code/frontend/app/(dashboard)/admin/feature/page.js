'use client';
import { Form, Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import { useAction, useFetch } from '../../../helpers/hooks';
import { fetchFeatures, addFeature, delFeature, postSingleImage } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import { noSelected } from '../../../helpers/utils';
import MultipleImageInput from '../../components/form/multiImage';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';
import Image from 'next/image';
import { FiPlus, FiCalendar, FiBox, FiEdit2, FiStar, FiImage } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const Page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    let { languages, langCode } = useI18n();
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs
            : [fallbackLanguage];
    const [data, getData, { loading }] = useFetch(fetchFeatures);
    const [open, setOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [selectedLang, setSelectedLang] = useState('en');
    const [formLoader, setFormLoader] = useState(false);

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
    }, [availableLanguages, langCode]);

    const columns = [
        {
            text: 'Platform Feature',
            dataField: 'name',
            formatter: (name, d) => (
                 <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 relative group p-1">
                          {d?.image ? (
                              <Image src={d?.image} alt="feature icon" width={40} height={40} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300"><FiStar/></div>
                          )}
                      </div>
                      <span className="font-bold text-gray-800 text-[13px] capitalize">{name?.[langCode] || name?.en || 'Unnamed Feature'}</span>
                 </div>
            ),
        },
        {
            text: 'Date Registered',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: 'System Impact Details',
            dataField: 'description',
            formatter: (value) => (
                <div className='text-xs text-gray-600 font-medium line-clamp-2 max-w-[300px] leading-relaxed'>
                    <Tooltip title={value?.[langCode]?.length > 50 ? value?.[langCode] : ''}>
                        <span className='cursor-help italic'>
                            "{value?.[langCode]?.length > 50 ? value?.[langCode]?.slice(0, 50) + '...' : (value?.[langCode] || value?.en || '')}"
                        </span>
                    </Tooltip>
                </div>
            )
        },
    ];

    const handleSubmit = async (values) => {
        setFormLoader(true);
        try {
            let imageUrl = editingFeature?.image || '';
            if (values?.image?.[0]?.originFileObj) {
                const image = values.image[0].originFileObj;
                const { data } = await postSingleImage({ image, image_name: 'feature' });
                imageUrl = data;
            } else if (values?.image?.[0]?.url) {
                imageUrl = values.image[0].url;
            }

            const multiLangFields = ['name', 'description'];
            const formattedData = multiLangFields.reduce((acc, field) => {
                acc[field] = {};
                availableLanguages.forEach((lang) => {
                    if (values?.[field]?.[lang.code]) {
                        acc[field][lang.code] = values[field][lang.code];
                    }
                });
                return acc;
            }, {});

            const submitData = {
                ...formattedData,
                _id: editingFeature?._id || undefined,
                image: imageUrl,
            };

            await useAction(addFeature, submitData, () => {
                setOpen(false);
                getData();
                form.resetFields();
                setEditingFeature(null);
            });
        } finally {
            setFormLoader(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="mb-2">
                <PageTitle title={'Core Features Config'} />
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
                                setEditingFeature(null);
                                form.resetFields();
                                setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
                                setOpen(true);
                            }}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} /> {i18n.t('Register Feature')}
                        </Button>
                    }
                    onDelete={delFeature}
                    onEdit={(feature) => {
                        setEditingFeature(feature);
                        form.resetFields();
                        form.setFieldsValue({
                            image: [{ url: feature.image }],
                            name: feature.name,
                            description: feature.description,
                        });
                        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
                        setOpen(true);
                    }}
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
                         <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
                              {editingFeature ? <FiEdit2 size={15} /> : <FiStar size={15} />}
                         </div>
                         <span className="text-base font-bold text-gray-800 leading-tight">
                              {i18n?.t(editingFeature ? 'Reconfigure Feature Module' : 'Stage New Feature Block')}
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
                                ? 'bg-pink-50 text-pink-600 border-pink-200'
                                : 'bg-transparent text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-gray-800'
                            }`}
                            key={index}
                        >
                            {l.name}
                        </button>
                    ))}
                </div>
                
                <Form form={form} layout='vertical' onFinish={handleSubmit} className="space-y-0">
                     {editingFeature && <HiddenInput name="_id" />}
                     
                     <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2"><FiBox size={12}/> Module Identifiers</h4>
                          
                          {availableLanguages.map((l, index) => (
                              <div
                                  key={index}
                                  style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                              >
                                  <FormInput
                                      placeholder={i18n?.t('Name of the feature...')}
                                      name={['name', l.code]}
                                      label={<span className="text-xs font-bold text-gray-700">Display Identity</span>}
                                      key={`name-${index}`}
                                      required={true}
                                  />
                                  <div className="mt-2">
                                      <FormInput
                                          placeholder={i18n?.t('Brief promotional overview...')}
                                          name={['description', l.code]}
                                          label={<span className="text-xs font-bold text-gray-700">System Impact Summary</span>}
                                          key={`desc-${index}`}
                                          required={true}
                                          textArea
                                      />
                                  </div>
                              </div>
                          ))}
                     </div>

                     <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm w-full md:w-1/2">
                          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-3"><FiImage size={12}/> Visual Iconography</h4>
                          <MultipleImageInput name={'image'} required={!editingFeature} />
                     </div>

                     <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-gray-100">
                          <Button 
                             type="button" 
                             onClick={() => { setOpen(false); form.resetFields(); setEditingFeature(null); }}
                             className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                          >
                             Cancel
                          </Button>
                          <Button type='submit' loading={formLoader} onClick={() => noSelected({ form, setSelectedLang })} className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 !font-semibold !rounded-lg !text-xs transition-all'>
                             {editingFeature ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                             {i18n.t(editingFeature ? 'Save Feature Configurations' : 'Register Module')}
                          </Button>
                     </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Page;
