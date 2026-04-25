import React, { useState, useEffect } from 'react';
import { Form, Input, Switch } from 'antd';
import { useAction } from '../../../../helpers/hooks';
import { postMarketingSettings } from '../../../../helpers/backend';
import Button from '../../../../../components/common/button';
import { Loader } from '../../../../../components/common/loader';
import { useI18n } from '../../../../providers/i18n';
import { FiMail, FiLock, FiServer, FiSave, FiCheckCircle } from 'react-icons/fi';

const GmailEmailProvider = ({ settings, getSettings, loading }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({
            auth_email: settings?.email?.gmail?.auth_email,
            password: settings?.email?.gmail?.password,
            service_provider: settings?.email?.gmail?.service_provider || 'gmail'
        })

        if (settings?.email?.default === 'gmail') {
            setDefaultEmail('gmail');
            form.setFieldsValue({ default: 'gmail' });
        }
    }, [settings])

    const onFinish = async (values) => {
        const postData = {
            email: {
                sendgrid: {
                    host: settings?.email?.sendgrid?.host,
                    port: settings?.email?.sendgrid?.port,
                    username: settings?.email?.sendgrid?.username,
                    password: settings?.email?.sendgrid?.password,
                    sender_email: settings?.email?.sendgrid?.sender_email
                },
                default: defaultEmail?.length > 3 ? defaultEmail : settings?.email?.default,
                gmail: {
                    auth_email: values?.auth_email,
                    password: values?.password,
                    service_provider: values?.service_provider || 'gmail'
                },
                other: {
                    host: settings?.email?.other?.host,
                    port: settings?.email?.other?.port,
                    address: settings?.email?.other?.address,
                    password: settings?.email?.other?.password,
                    provider_name: settings?.email?.other?.provider_name
                },
            },
            email_template: settings?.email_template
        }
        return useAction(postMarketingSettings, { ...postData }, () => getSettings())
    };

    if (loading) {
        return <div className='flex justify-center items-center h-[280px]'><Loader /></div>;
    }
    
    return (
        <Form form={form} onFinish={onFinish} autoComplete="off" layout='vertical'>
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 border border-red-100/50 flex items-center justify-center">
                    <FiMail size={15} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-800 leading-tight">{i18n?.t('Gmail SMTP Provider')}</h3>
                    <p className="text-[10px] text-gray-400">Configure your Google Gmail marketing email account</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Form.Item name={'auth_email'} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiMail size={11} className="text-gray-400"/> {i18n?.t('Email Username / Auth Email')}</span>} rules={[{ required: true, message: i18n?.t('Please input email username!') }]} className="!mb-0">
                    <Input placeholder="e.g. yourname@gmail.com" type="email" className="!rounded-lg !text-sm" />
                </Form.Item>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item name={'password'} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiLock size={11} className="text-gray-400"/> {i18n?.t('App Password')}</span>} rules={[{ required: true, message: i18n?.t('Please input email password!') }]} className="!mb-0">
                        <Input.Password placeholder="Google App Password" className="!rounded-lg !text-sm" />
                    </Form.Item>
                    <Form.Item name={'service_provider'} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiServer size={11} className="text-gray-400"/> {i18n?.t('Service Provider')}</span>} className="!mb-0">
                        <Input placeholder="gmail" readOnly disabled className="!rounded-lg !text-sm !bg-slate-50 !text-slate-500" />
                    </Form.Item>
                </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mt-5">
                <div className="flex items-center gap-2">
                    <FiCheckCircle size={14} className={defaultEmail === 'gmail' ? 'text-emerald-500' : 'text-gray-300'} />
                    <div>
                        <span className="text-xs font-bold text-gray-700">{i18n?.t('Set as Default Provider')}</span>
                        <p className="text-[10px] text-gray-400">Marketing emails will be sent via Gmail when enabled</p>
                    </div>
                </div>
                <Form.Item name='default' className="!mb-0">
                    <Switch
                        checked={defaultEmail === 'gmail'}
                        onChange={(checked) => setDefaultEmail(checked ? 'gmail' : '')}
                        className={defaultEmail === 'gmail' ? '!bg-[#F97316]' : '!bg-gray-300'}
                    />
                </Form.Item>
            </div>

            <div className="flex justify-end mt-5 pt-4 border-t border-slate-100">
                <Button type='submit' className="flex items-center gap-1.5 !px-6 !py-2 shadow-md shadow-[#F97316]/20 !rounded-lg !text-xs !font-bold">
                    <FiSave size={13} /> {i18n?.t('Save Configuration')}
                </Button>
            </div>
        </Form>
    );
};

export default GmailEmailProvider;
