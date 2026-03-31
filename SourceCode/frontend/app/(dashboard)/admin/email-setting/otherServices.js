import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Switch } from 'antd';
const { Option } = Select;
import { useAction } from '../../../helpers/hooks';
import { HiddenInput } from '../../components/form/input';
import { postEmailSettings } from '../../../helpers/backend';
import Button from '../../../../components/common/button';
import { Loader } from '../../../../components/common/loader';
import { useI18n } from '../../../providers/i18n';
import { FiServer, FiMail, FiLock, FiSave, FiCheckCircle } from 'react-icons/fi';

const OtherProviderManageEmail = ({ settings, getSettings, loading, setCheckedValue }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');

    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings,
                other: {
                    address: settings?.other?.address,
                    host: settings?.other?.host,
                    password: settings?.other?.password,
                    port: settings?.other?.port,
                    provider_name: settings?.other?.provider_name
                }
            });
            if (settings?.default === 'others') {
                setDefaultEmail('others');
                form.setFieldsValue({ default: 'others' });
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
            other: {
                address: values?.other?.address,
                host: values?.other?.host,
                password: values?.other?.password,
                port: values?.other?.port,
                provider_name: values?.other?.provider_name
            },
            default: defaultEmail,
            sendgrid: {
                host: settings?.sendgrid?.host,
                port: settings?.sendgrid?.port,
                username: settings?.sendgrid?.username,
                password: settings?.sendgrid?.password,
                sender_email: settings?.sendgrid?.sender_email
            },
            gmail: {
                auth_email: settings?.gmail?.auth_email,
                password: settings?.gmail?.password,
                service_provider: settings?.gmail?.service_provider
            }
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
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 border border-purple-100/50 flex items-center justify-center">
                    <FiServer size={15} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-800 leading-tight">Other SMTP Provider</h3>
                    <p className="text-[10px] text-gray-400">Configure any custom SMTP mail service provider</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name={['other', 'host']} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiServer size={11} className="text-gray-400"/> {i18n?.t('Email Host')}</span>} rules={[{ required: true, message: 'Please input email host!' }]} className="!mb-0">
                    <Input placeholder="e.g. smtp.mailprovider.com" className="!rounded-lg !text-sm" />
                </Form.Item>
                <Form.Item name={['other', 'port']} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiServer size={11} className="text-gray-400"/> {i18n?.t('Email Port')}</span>} rules={[{ required: true, message: 'Please input email port!' }]} className="!mb-0">
                    <Input placeholder="e.g. 465 or 587" className="!rounded-lg !text-sm" />
                </Form.Item>
                <Form.Item name={['other', 'address']} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiMail size={11} className="text-gray-400"/> {i18n?.t('Email Address')}</span>} rules={[{ required: true, message: 'Please input email address!' }]} className="!mb-0">
                    <Input placeholder="e.g. noreply@yourdomain.com" className="!rounded-lg !text-sm" />
                </Form.Item>
                <Form.Item name={['other', 'password']} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiLock size={11} className="text-gray-400"/> {i18n?.t('Email Password')}</span>} rules={[{ required: true, message: 'Please input email password!' }]} className="!mb-0">
                    <Input.Password placeholder="••••••••" className="!rounded-lg !text-sm" />
                </Form.Item>
                <Form.Item name={['other', 'provider_name']} label={<span className="text-xs font-bold text-gray-600 flex items-center gap-1"><FiServer size={11} className="text-gray-400"/> {i18n?.t('Service Provider')}</span>} rules={[{ required: true, message: 'Please input service provider!' }]} className="!mb-0 md:col-span-2">
                    <Select placeholder="Select or type your provider" allowClear className="!rounded-lg">
                        <Option value="gmail">{i18n?.t('Gmail')}</Option>
                        <Option value="sendgrid">{i18n?.t('SendGrid')}</Option>
                        <Option value="other">{i18n?.t('Other')}</Option>
                    </Select>
                </Form.Item>
            </div>

            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mt-5">
                <div className="flex items-center gap-2">
                    <FiCheckCircle size={14} className={defaultEmail === 'others' ? 'text-emerald-500' : 'text-gray-300'} />
                    <div>
                        <span className="text-xs font-bold text-gray-700">{i18n?.t('Set as Default Provider')}</span>
                        <p className="text-[10px] text-gray-400">Emails will be sent via this provider when enabled</p>
                    </div>
                </div>
                <Form.Item name='default' className="!mb-0">
                    <Switch
                        checked={defaultEmail === 'others'}
                        onChange={(checked) => setDefaultEmail(checked ? 'others' : '')}
                        className={defaultEmail === 'others' ? '!bg-[#5572fc]' : '!bg-gray-300'}
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

export default OtherProviderManageEmail;