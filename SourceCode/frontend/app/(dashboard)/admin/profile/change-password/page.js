'use client';
import { Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postChangePassword } from '../../../../helpers/backend';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import { FiArrowLeft, FiLock, FiKey, FiShield, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

const AdminChangePassword = () => {
    const i18n = useI18n();
    const { push } = useRouter();
    const [form] = Form.useForm();
    const [loader, setLoader] = useState(false);

    const handleFinish = async (values) => {
        setLoader(true);
        try {
            const { error, msg } = await postChangePassword(values);
            if (!error) {
                localStorage.setItem('token', '');
                message.success(msg);
                window.location.href = '/signin';
            } else {
                message.error(msg);
            }
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="max-w-[600px] mx-auto space-y-5 animate-fade-in pb-10">
            <div className="flex items-start gap-4 mb-2">
                <button
                    type="button"
                    onClick={() => push('/admin/profile')}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-gray-500 hover:bg-slate-50 hover:text-gray-800 transition-colors shadow-sm shrink-0 mt-0.5"
                >
                    <FiArrowLeft size={18} />
                </button>
                <div className="flex flex-col">
                    <PageTitle title="Security Vault" className="!mb-0 !pb-0" />
                    <span className="text-[11px] text-gray-500 font-medium">Update your admin account credentials</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-orange-50/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
                        <FiKey size={16} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800 leading-tight">Credentials Reset</h3>
                        <p className="text-[11px] text-gray-500 font-medium">You will be signed out after a successful password change</p>
                    </div>
                </div>

                <Form layout="vertical" form={form} onFinish={handleFinish} className="p-6">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-5">
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                            <FiShield size={12} /> Authentication Params
                        </h4>
                        <div className="flex flex-col gap-4">
                            <Form.Item
                                name="old_password"
                                label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiLock size={11}/> Current Password</span>}
                                rules={[{ required: true, message: i18n?.t('Please input your old password!') }]}
                                className="mb-0"
                            >
                                <Input.Password
                                    placeholder="Enter your current password"
                                    className="h-10 rounded-lg border-slate-200 focus:border-[#F97316] focus:ring-[#F97316]/20 text-sm"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="bg-orange-50/30 border border-orange-100/50 rounded-xl p-4 mb-5">
                        <h4 className="text-[11px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                            <FiKey size={12} /> New Credentials
                        </h4>
                        <div className="flex flex-col gap-4">
                            <Form.Item
                                name="new_password"
                                label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiKey size={11}/> New Password</span>}
                                rules={[{ required: true, message: i18n?.t('Please input your password!') }]}
                                hasFeedback
                                className="mb-0"
                            >
                                <Input.Password
                                    placeholder="Set a strong new password"
                                    className="h-10 rounded-lg border-slate-200 focus:border-[#F97316] focus:ring-[#F97316]/20 text-sm"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirm_password"
                                label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiShield size={11}/> Confirm New Password</span>}
                                dependencies={['new_password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: i18n?.t('Please confirm your password!') },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('new_password') === value) return Promise.resolve();
                                            return Promise.reject(new Error('The new passwords do not match!'));
                                        },
                                    }),
                                ]}
                                className="mb-0"
                            >
                                <Input.Password
                                    placeholder="Re-enter your new password"
                                    className="h-10 rounded-lg border-slate-200 focus:border-[#F97316] focus:ring-[#F97316]/20 text-sm"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            type="button"
                            onClick={() => push('/admin/profile')}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !px-5 !py-2 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={loader}
                            className="!px-6 !py-2 flex items-center gap-1.5 shadow-md shadow-orange-500/20 !font-semibold !rounded-lg !text-xs transition-all !bg-orange-500 hover:!shadow-orange-500/30 border-orange-500"
                        >
                            <FiSave size={13} /> {i18n?.t('Rotate Credentials')}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AdminChangePassword;

