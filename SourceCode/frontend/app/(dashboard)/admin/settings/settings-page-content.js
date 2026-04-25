'use client';
import React, { useEffect, useState } from 'react';
import { Form, Radio, message } from 'antd';
import PageTitle from '../../components/common/page-title';
import { fetchAdminSettings, postAdminSettings } from '../../../helpers/backend';
import FormInput, { HiddenInput } from '../../components/form/input';
import PhoneNumberInput from '../../components/form/phoneNumberInput';
import MultipleImageInput from '../../components/form/multiImage';
import { useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import { useI18n } from '../../../providers/i18n';
import { FiGlobe, FiDatabase, FiCloud, FiServer, FiShare2, FiMonitor, FiSmartphone, FiMapPin, FiMail, FiEdit2, FiSave, FiSettings } from 'react-icons/fi';

const SettingsPageContent = () => {
    const [baseForm] = Form.useForm();
    const [storageForm] = Form.useForm();
    const i18n = useI18n()
    const [data, getData] = useFetch(fetchAdminSettings)
    const storageProvider = Form.useWatch('storage_provider', storageForm) || 'local';
    
    const [baseLoader, setBaseLoader] = useState(false);
    const [storageLoader, setStorageLoader] = useState(false);

    useEffect(() => {
        if (data) {
            const baseSettingsData = {
                ...data,
                logo: data?.logo?.length > 0 ? [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data?.logo,
                    },
                ] : []
            };
            const storageSettingsData = {
                _id: data?._id,
                storage_provider: data?.storage?.provider || 'local',
                local_base_url: data?.storage?.local?.base_url || '',
                s3_access_key_id: data?.storage?.s3?.access_key_id || '',
                s3_secret_access_key: data?.storage?.s3?.secret_access_key || '',
                s3_region: data?.storage?.s3?.region || '',
                s3_bucket_name: data?.storage?.s3?.bucket_name || '',
                s3_base_path: data?.storage?.s3?.base_path || '',
            };
            baseForm.setFieldsValue(baseSettingsData);
            storageForm.setFieldsValue(storageSettingsData);
        }
    }, [baseForm, data, storageForm]);

    const handleBaseFinish = async (values) => {
        setBaseLoader(true);
        try {
            const submitData = {
                ...values,
                _id: values?._id || undefined,
                logo: values?.logo?.[0]?.originFileObj,
            }
            const { error, msg } = await postAdminSettings(submitData)
            if (error) {
                message.error(msg)
            } else {
                message.success(msg)
                getData()
            }
        } finally {
            setBaseLoader(false);
        }
    }

    const handleStorageFinish = async (values) => {
        setStorageLoader(true);
        try {
            const submitData = {
                _id: values?._id || data?._id || undefined,
                storage_provider: values?.storage_provider || 'local',
                local_base_url: values?.local_base_url || '',
                s3_access_key_id: values?.s3_access_key_id || '',
                s3_secret_access_key: values?.s3_secret_access_key || '',
                s3_region: values?.s3_region || '',
                s3_bucket_name: values?.s3_bucket_name || '',
                s3_base_path: values?.s3_base_path || '',
            };

            const { error, msg } = await postAdminSettings(submitData);
            if (error) {
                message.error(msg);
            } else {
                message.success(msg);
                getData();
            }
        } finally {
            setStorageLoader(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-6 animate-fade-in pb-10">
            <div className="mb-2">
                <PageTitle title="Application Setup Manager" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                
                {/* Application Core Parameters */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
                     <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                               <FiGlobe size={16} />
                          </div>
                          <div>
                               <h3 className="text-base font-bold text-gray-800 leading-tight">Brand & Localization Core</h3>
                               <p className="text-[11px] text-gray-500 font-medium">Manage how your deployment appears globally</p>
                          </div>
                     </div>
                     
                     <div className="p-6">
                         <Form form={baseForm} layout="vertical" onFinish={handleBaseFinish} className="space-y-0">
                              <HiddenInput name="_id" />
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                  <div className="md:col-span-2">
                                      <FormInput 
                                         placeholder={i18n?.t("Enter Application Main Title")} 
                                         name="title" 
                                         label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiMonitor size={12}/> Platform Name</span>} 
                                         required 
                                      />
                                  </div>
                                  <div className="md:col-span-2">
                                      <FormInput 
                                          placeholder={i18n?.t("Enter meta description text")} 
                                          name="description" 
                                          label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiEdit2 size={12}/> SEO Description</span>} 
                                          required 
                                          textArea
                                      />
                                  </div>
                                  
                                  <div className="col-span-1">
                                      <FormInput 
                                          placeholder={i18n?.t("Contact e-mail address")} 
                                          name="email" 
                                          label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiMail size={12}/> Primary Email</span>} 
                                          required 
                                          isEmail 
                                      />
                                  </div>
                                  <div className="col-span-1 user-phone">
                                      <PhoneNumberInput 
                                          placeholder={i18n?.t("Service desk phone")} 
                                          name="phone" 
                                          label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiSmartphone size={12}/> Global Support Phone</span>} 
                                          required 
                                      />
                                  </div>
                                  <div className="md:col-span-2">
                                      <FormInput 
                                          placeholder={i18n?.t("Full physical address")} 
                                          name="address" 
                                          label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiMapPin size={12}/> Physical Address</span>} 
                                          required 
                                      />
                                  </div>
                                  <div className="md:col-span-2 pt-4 border-t border-slate-100">
                                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-3"><FiShare2 size={12}/> Connected Networks</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                          <FormInput placeholder={"Facebook URL"} name="facebook" label={<span className="text-[10px] font-bold text-gray-600">Facebook URI</span>} required />
                                          <FormInput placeholder={"Twitter URL"} name="twitter" label={<span className="text-[10px] font-bold text-gray-600">Twitter URI</span>} required />
                                          <FormInput placeholder={"Instagram URL"} name="instagram" label={<span className="text-[10px] font-bold text-gray-600">Instagram URI</span>} required />
                                          <FormInput placeholder={"LinkedIn URL"} name="linkedin" label={<span className="text-[10px] font-bold text-gray-600">LinkedIn URI</span>} required />
                                          <FormInput placeholder={"Youtube URL"} name="youtube" label={<span className="text-[10px] font-bold text-gray-600">Youtube URI</span>} required />
                                      </div>
                                  </div>

                                  <div className="md:col-span-2 pt-4 border-t border-slate-100">
                                      <div className="flex gap-6 items-start">
                                          <div className="flex-1">
                                              <FormInput placeholder={"e.g. Â© 2026 Webitof GYM. All rights reserved."} name="footer_text" label={<span className="text-xs font-bold text-gray-700">Footer Attribution String</span>} required />
                                          </div>
                                          <div>
                                              <MultipleImageInput name="logo" label={<span className="text-[10px] font-bold text-gray-600">Brand Imprint Override</span>} required />
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
                                   <Button type='submit' loading={baseLoader} className="!px-6 !py-2 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg !text-xs transition-all"> 
                                       <FiSave size={13}/> {i18n?.t("Write Base Config")} 
                                   </Button>
                              </div>
                         </Form>
                     </div>
                </div>

                {/* Storage Deployment Details */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
                     <div className="px-6 py-4 border-b border-slate-100 bg-emerald-50/30 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                               <FiDatabase size={16} />
                          </div>
                          <div>
                               <h3 className="text-base font-bold text-gray-800 leading-tight">Server State Initialization</h3>
                               <p className="text-[11px] text-gray-500 font-medium">Mount local or S3 compatible media buckets</p>
                          </div>
                     </div>
                     
                     <div className="p-6">
                          <Form form={storageForm} layout="vertical" onFinish={handleStorageFinish} className="space-y-0">
                               <HiddenInput name="_id" />
                               
                               <Form.Item
                                   name="storage_provider"
                                   label={<span className="text-xs font-bold text-gray-700">Data Architecture Mode</span>}
                                   rules={[{ required: true, message: 'Select your node infrastructure' }]}
                                   initialValue="local"
                                   className="mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100"
                               >
                                   <Radio.Group className="flex gap-4">
                                       <Radio value="local" className="flex items-center text-xs font-bold text-gray-700">
                                            <span className="flex items-center gap-1.5"><FiServer className="text-gray-400"/> Local Node</span>
                                       </Radio>
                                       <Radio value="s3" className="flex items-center text-xs font-bold text-gray-700">
                                            <span className="flex items-center gap-1.5"><FiCloud className="text-orange-500"/> AWS Cloud Target</span>
                                       </Radio>
                                   </Radio.Group>
                               </Form.Item>

                               <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl min-h-[250px]">
                                   {storageProvider === 'local' && (
                                       <div className="animate-fade-in">
                                            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-3"><FiSettings size={12}/> Local Server Config</h4>
                                            <FormInput 
                                                placeholder={i18n?.t("e.g. http://localhost:3000")} 
                                                name="local_base_url" 
                                                label={<span className="text-[11px] font-bold text-gray-700">Local Mount Domain (Base URI)</span>}
                                            />
                                            <p className="text-[10px] text-gray-500 mt-2 bg-yellow-50 border border-yellow-100 p-2 rounded">
                                                By default, the system will resolve static artifacts off the host origin root. Only override if utilizing a dedicated localized media API.
                                            </p>
                                       </div>
                                   )}

                                   {storageProvider === 's3' && (
                                       <div className="animate-fade-in space-y-4">
                                            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-3"><FiSettings size={12}/> Cloud Buckets Validation</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormInput placeholder={"AKIAIOSFODNN7EXAMPLE"} name="s3_access_key_id" label={<span className="text-[11px] font-bold text-gray-700">API Access Key Target</span>} required />
                                                <FormInput placeholder={"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"} name="s3_secret_access_key" label={<span className="text-[11px] font-bold text-gray-700">System Secret Hash</span>} required type="password" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormInput placeholder={"us-east-1"} name="s3_region" label={<span className="text-[11px] font-bold text-gray-700">Global Datacenter Region</span>} required />
                                                <FormInput placeholder={"company-prod-bucket"} name="s3_bucket_name" label={<span className="text-[11px] font-bold text-gray-700">Destination Bucket</span>} required />
                                            </div>
                                            <FormInput placeholder={"media/uploads/..."} name="s3_base_path" label={<span className="text-[11px] font-bold text-gray-700">Origin Relative Master Path</span>} />
                                       </div>
                                   )}
                               </div>

                               <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
                                   <Button type='submit' loading={storageLoader} className="!px-6 !py-2 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg !text-xs transition-all !bg-emerald-600 hover:!shadow-emerald-600/30 border-emerald-600"> 
                                       <FiSave size={13}/> {i18n?.t("Sync Database Configs")} 
                                   </Button>
                               </div>
                          </Form>
                     </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPageContent;

