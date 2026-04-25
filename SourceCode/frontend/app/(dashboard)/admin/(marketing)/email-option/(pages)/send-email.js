import React, { useEffect, useState } from 'react';
import { Form, Radio } from 'antd';
import FormInput from '../../../../components/form/input';
import { useAction, useFetch } from '../../../../../helpers/hooks';
import { fetchGroups, fetchMarketingGroupList, fetchMarketingSettings, sendMarketingMail } from '../../../../../helpers/backend';
import FormSelect from '../../../../components/form/select';
import { columnFormatter } from '../../../../../helpers/utils';
import FormCheckbox from '../../../../components/form/checkbox';
import JodiEditor from '../../../../components/form/jodiEditor';
import Button from '../../../../../../components/common/button';
import FormDatePicker from '../../../../components/form/date_picker';
import { FiSend, FiUsers, FiClock, FiSettings, FiMail, FiEdit3 } from 'react-icons/fi';

const SendEmail = () => {
    const [form] = Form.useForm();
    const [groups] = useFetch(fetchMarketingGroupList);
    const [settings, getSettings, { loading }] = useFetch(fetchMarketingSettings)
    const [value, setValue] = useState(0);
    const [value2, setValue2] = useState(0);

    useEffect(() => {
        form.setFieldsValue({
            content: settings?.email_template?.[value] || ''
        })
    }, [settings, value])

    const onFinish = (values) => {
        const payload = {
            content: values.content,
            subject: values.subject,
            scheduled_date: value2 === 0 && !values?.scheduled_date ? undefined : values?.scheduled_date,
            to: values.to,
            individual_mail: values.individual_mail,
            subscriber: values.subscriber,
            user: values.user,
            trainer: values.trainer,
            employee: values.employee
        }
        useAction(sendMarketingMail, payload, () => {
            const fieldsToReset = Object.keys(values).filter(key => key !== "content");
            form.resetFields(fieldsToReset);
        })
    }

    return (
        <div className="flex flex-col w-full">
            <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FiSend className="text-[#F97316]" /> Send Email Campaign
                </h2>
                <p className="text-xs text-gray-500 mt-1">Compose and send emails to your audiences. Credentials are automatically applied.</p>
            </div>

            <div className='p-6'>
                <Form onFinish={onFinish} form={form} layout="vertical">
                    
                    {/* Audience Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-md bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                                <FiUsers size={12} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-700">1. Select Audience</h3>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-x-5 gap-y-4 bg-slate-50/50 p-5 rounded-xl border border-slate-100/80">
                            <FormInput 
                                name={"individual_mail"} 
                                label={<span className="text-xs font-bold text-gray-600">Individual Email</span>} 
                                type={"email"} 
                                placeholder={"recipient@example.com"} 
                                className="!mb-0"
                            />
                            <FormSelect
                                placeholder={"Select Group (optional)"}
                                options={groups?.docs?.map((item) => ({
                                    label: typeof item?.name === 'string' ? item?.name : columnFormatter(item?.name),
                                    value: item?._id,
                                }))}
                                name={"to"}
                                label={<span className="text-xs font-bold text-gray-600">Audience Group</span>}
                                className="!mb-0"
                            />
                            <div className="md:col-span-2 mt-2 pt-4 border-t border-slate-200">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Or Broadcase To Roles:</span>
                                <div className='flex items-center flex-wrap gap-4'>
                                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200"><FormCheckbox label={"Subscribers"} name={"subscriber"} className="!mb-0 whitespace-nowrap" /></div>
                                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200"><FormCheckbox label={"Members"} name={"user"} className="!mb-0 whitespace-nowrap" /></div>
                                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200"><FormCheckbox label={"Trainers"} name={"trainer"} className="!mb-0 whitespace-nowrap" /></div>
                                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200"><FormCheckbox label={"Employees"} name={"employee"} className="!mb-0 whitespace-nowrap" /></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-500 border border-purple-100/50 flex items-center justify-center">
                                <FiEdit3 size={12} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-700">2. Compose Message</h3>
                        </div>

                        <div className="">
                            <FormInput 
                                placeholder={"e.g. Special Holiday Offer Inside!"} 
                                name={"subject"} 
                                label={<span className="text-xs font-bold text-gray-600">Email Subject</span>} 
                                required={true} 
                            />
                            
                            <div className="flex items-center gap-3 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100 w-fit">
                                <span className="text-xs font-bold text-gray-500 px-2">Load Template:</span>
                                <Radio.Group onChange={(e) => setValue(e.target.value)} value={value} className="flex gap-4">
                                    <Radio value={0} className="text-xs">Template 1</Radio>
                                    <Radio value={1} className="text-xs">Template 2</Radio>
                                </Radio.Group>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <JodiEditor placeholder={"Type your message here..."} name={'content'} required />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Section */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-500 border border-emerald-100/50 flex items-center justify-center">
                                <FiClock size={12} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-700">3. Delivery Options</h3>
                        </div>

                        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 w-fit">
                            <Form.Item className="!mb-4">
                                <Radio.Group onChange={(e) => setValue2(e.target.value)} value={value2}>
                                    <Radio value={0} className="text-sm font-bold text-gray-700">Send Now</Radio>
                                    <Radio value={1} className="text-sm font-bold text-gray-700 ml-4">Schedule For Later</Radio>
                                </Radio.Group>
                            </Form.Item>
                            
                            {value2 === 1 && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <FormDatePicker 
                                        name={"scheduled_date"} 
                                        label={<span className="text-xs font-bold text-gray-500">Pick Date & Time</span>} 
                                        placeholder={"Select Date"} 
                                        showTime={true} 
                                        className="!w-[300px]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-5 border-t border-slate-100">
                        <Button 
                            className="flex items-center gap-2 !px-8 !py-2.5 shadow-lg shadow-[#F97316]/20 hover:shadow-[#F97316]/40 transition-all !rounded-xl text-sm font-bold" 
                            loading={loading} 
                            type={'submit'}
                        >
                            <FiSend size={15} />
                            {value2 === 0 ? "Send Campaign Now" : "Schedule Campaign"}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default SendEmail;

