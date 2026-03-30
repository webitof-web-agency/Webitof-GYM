import React, { useState, useEffect } from 'react';
import { Form, Input, Switch } from 'antd';
import { useAction } from '../../../helpers/hooks';
import { postEmailSettings } from '../../../helpers/backend';
import Button from '../../../../components/common/button';
import { Loader } from '../../../../components/common/loader';
import { HiddenInput } from '../../components/form/input';
import { useI18n } from '../../../providers/i18n';
import { FiSend, FiServer, FiUser, FiLock, FiMail, FiSave, FiCheckCircle } from 'react-icons/fi';

const FormField = ({ label, icon: Icon, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
            {Icon && <Icon size={12} className="text-gray-400" />}
            {label}
        </label>
        {children}
    </div>
);

const SendGridManageEmail = ({ settings, getSettings, loading, setCheckedValue }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');

    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings,
                sendgrid: {
                    host: settings?.sendgrid?.host,
                    port: settings?.sendgrid?.port,
                    username: settings?.sendgrid?.username,
                    password: settings?.sendgrid?.password,
                    sender_email: settings?.sendgrid?.sender_email
                }
            });
            if (settings?.default === 'sendgrid') {
                setDefaultEmail('sendgrid');
                form.setFieldsValue({ default: 'sendgrid' });
                setCheckedValue(true);
            } else {
                setDefaultEmail('');
                form.setFieldsValue({ default: '' });
                setCheckedValue(false);
            }
        }
    }, [settings]);

    const onFinish = async (values) => {
        const postData = {
            _id: values._id,
            sendgrid: {
                host: values?.sendgrid?.host,
                port: values?.sendgrid?.port,
                username: values?.sendgrid?.username,
                password: values?.sendgrid?.password,
                sender_email: values?.sendgrid?.sender_email
            },
            default: defaultEmail,
            gmail: {
                auth_email: settings?.gmail?.auth_email,
                password: settings?.gmail?.password,
                service_provider: settings?.gmail?.service_provider
            },
            other: {
                host: settings?.other?.host,
                port: settings?.other?.port,
                address: settings?.other?.address,
                password: settings?.other?.password,
                provider_name: settings?.other?.provider_name
            },
        };
        return useAction(postEmailSettings, { ...postData }, () => getSettings());
    };

    if (loading) {
        return <div className='flex justify-center items-center h-[280px]'><Loader /></div>;
    }

    return (
        <Form form={form} onFinish={onFinish} autoComplete="off" layout='vertical'>
            <HiddenInput name="_id" />

            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                    <FiSend size={15} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-800 leading-tight">SendGrid SMTP</h3>
                    <p className="text-[10px] text-gray-400">Configure your SendGrid transactional email provider</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name={['sendgrid', 'host']} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiServer size={11} className="text-gray-400"/> {i18n?.t('Email Host')}</span>} rules={[{ required: true, message: i18n?.t('Please input email host!') }]} className="!mb-0">
                    <Input placeholder="e.g. smtp.sendgrid.net" className="!rounded-lg !text-sm" />
                </Form.Item>
                <Form.Item name={['sendgrid', 'port']} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiServer size={11} className="text-gray-400"/> {i18n?.t('Email Port')}</span>} rules={[{ required: true, message: i18n?.t('Please input email port!') }]} className="!mb-0">
                    <Input placeholder="e.g. 587" className="!rounded-lg !text-sm" />
                </Form.Item>
                <Form.Item name={['sendgrid', 'username']} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiUser size={11} className="text-gray-400"/> {i18n?.t('Email Username')}</span>} rules={[{ required: true, message: i18n?.t('Please input email username!') }]} className="!mb-0">
                    <Input placeholder="e.g. apikey" className="!rounded-lg !text-sm" />
                </Form.Item>
                <Form.Item name={['sendgrid', 'password']} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiLock size={11} className="text-gray-400"/> {i18n?.t('Email Password')}</span>} rules={[{ required: true, message: i18n?.t('Please input email password!') }]} className="!mb-0">
                    <Input.Password placeholder="••••••••" className="!rounded-lg !text-sm" />
                </Form.Item>
                <Form.Item name={['sendgrid', 'sender_email']} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiMail size={11} className="text-gray-400"/> {i18n?.t('Sender Email')}</span>} rules={[{ required: true, message: i18n?.t('Please input sender email!') }]} className="!mb-0 md:col-span-2">
                    <Input placeholder="e.g. noreply@yourdomain.com" className="!rounded-lg !text-sm" />
                </Form.Item>
            </div>

            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mt-5">
                <div className="flex items-center gap-2">
                    <FiCheckCircle size={14} className={defaultEmail === 'sendgrid' ? 'text-emerald-500' : 'text-gray-300'} />
                    <div>
                        <span className="text-xs font-bold text-gray-700">{i18n?.t('Set as Default Provider')}</span>
                        <p className="text-[10px] text-gray-400">Emails will be sent via SendGrid when enabled</p>
                    </div>
                </div>
                <Form.Item name='default' className="!mb-0">
                    <Switch
                        checked={defaultEmail === 'sendgrid'}
                        onChange={(checked) => setDefaultEmail(checked ? 'sendgrid' : '')}
                        className={defaultEmail === 'sendgrid' ? '!bg-[#5572fc]' : '!bg-gray-300'}
                    />
                </Form.Item>
            </div>

            <div className="flex justify-end mt-5 pt-4 border-t border-slate-100">
                <Button type='submit' className="flex items-center gap-1.5 !px-6 !py-2 shadow-md shadow-[#5572fc]/20 !rounded-lg !text-xs !font-bold">
                    <FiSave size={13} /> {i18n?.t('Save Configuration')}
                </Button>
            </div>
        </Form>
    );
};

export default SendGridManageEmail;
