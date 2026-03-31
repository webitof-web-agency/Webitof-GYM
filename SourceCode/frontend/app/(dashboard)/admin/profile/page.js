"use client";
import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchUser, userProfileUpdate } from '../../../helpers/backend';
import FormInput from '../../../../components/form/input';
import MultipleImageInput from '../../../../components/form/multiImage';
import PhoneNumberInput from '../../../../components/form/phoneNumberInput';
import { useAction, useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import { FiEdit2, FiUser, FiMail, FiPhone, FiCamera, FiShield, FiKey } from 'react-icons/fi';

const AdminProfile = () => {
    const i18n = useI18n();
    const { push } = useRouter();
    const [form] = Form.useForm();
    const [user, getUser] = useFetch(fetchUser);
    const [edit, setEdit] = useState(false);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            ...user,
            image: user?.image?.length > 0
                ? [{ uid: '-1', name: 'image.png', status: 'done', url: user?.image }]
                : [],
        });
    }, [user]);

    return (
        <div className="max-w-[900px] mx-auto space-y-5 animate-fade-in pb-10">
            <div className="mb-2">
                <PageTitle title="Account Profile" />
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">

                {/* Hero Banner */}
                <div className="h-28 bg-gradient-to-r from-[#5572fc] to-[#7c93ff] relative">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                </div>

                {/* Avatar + Name Row */}
                <div className="px-8 pb-6 relative">
                    <div className="flex items-end justify-between -mt-12 mb-5">
                        <div className="relative">
                            {user?.image ? (
                                <Image width={96} height={96} src={user?.image} alt="admin avatar"
                                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover" />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl bg-[#5572fc]/10 flex items-center justify-center">
                                    <FiUser className="text-[#5572fc]" size={36} />
                                </div>
                            )}
                            <button onClick={() => setEdit(true)} className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#5572fc] rounded-lg text-white flex items-center justify-center shadow-md hover:bg-[#4461eb] transition-colors">
                                <FiCamera size={13} />
                            </button>
                        </div>
                        <div className="flex gap-2 mb-1">
                            <button
                                onClick={() => setEdit(false)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition-all ${!edit ? 'bg-[#5572fc] text-white border-[#5572fc] shadow-md shadow-[#5572fc]/20' : 'bg-white text-gray-500 border-slate-200 hover:bg-slate-50'}`}
                            >
                                <FiUser size={12} /> View Profile
                            </button>
                            <button
                                onClick={() => setEdit(true)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition-all ${edit ? 'bg-[#5572fc] text-white border-[#5572fc] shadow-md shadow-[#5572fc]/20' : 'bg-white text-gray-500 border-slate-200 hover:bg-slate-50'}`}
                            >
                                <FiEdit2 size={12} /> Edit Profile
                            </button>
                        </div>
                    </div>

                    {!edit ? (
                        /* ---- VIEW MODE ---- */
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-extrabold text-gray-800">{user?.name || 'Administrator'}</h2>
                                <span className="text-xs text-[#5572fc] font-bold uppercase tracking-widest">Admin Account</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { icon: <FiUser size={15} />, label: 'Full Name', value: user?.name, color: 'blue' },
                                    { icon: <FiMail size={15} />, label: 'Email Address', value: user?.email, color: 'purple' },
                                    { icon: <FiPhone size={15} />, label: 'Phone Number', value: user?.phone || '—', color: 'emerald' },
                                ].map(({ icon, label, value, color }) => (
                                    <div key={label} className={`bg-${color}-50/40 border border-${color}-100/60 rounded-xl p-4`}>
                                        <div className={`w-8 h-8 rounded-lg bg-${color}-100 text-${color}-600 flex items-center justify-center mb-3`}>
                                            {icon}
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                                        <p className="font-bold text-gray-800 text-sm truncate">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 pt-5 border-t border-slate-100">
                                <button
                                    onClick={() => push('/admin/profile/change-password')}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100 transition-all"
                                >
                                    <FiKey size={13} /> Change Password
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* ---- EDIT MODE ---- */
                        <Form layout="vertical" form={form}
                            onFinish={async (values) => {
                                setLoader(true);
                                try {
                                    await useAction(userProfileUpdate, {
                                        ...values,
                                        image: values?.image?.length > 0 ? values?.image[0]?.originFileObj : null
                                    }, () => { getUser(); setEdit(false); });
                                } finally {
                                    setLoader(false);
                                }
                            }}
                        >
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-4"><FiShield size={12} /> Identity Fields</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0 user-phone">
                                    <FormInput
                                        placeholder="Enter your full name"
                                        name="name"
                                        label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiUser size={11}/> Display Name</span>}
                                        required
                                    />
                                    <FormInput
                                        placeholder="Email address"
                                        name="email"
                                        label={<span className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><FiMail size={11}/> Email (read-only)</span>}
                                        readOnly
                                        className="!bg-slate-100 cursor-not-allowed"
                                    />
                                    <PhoneNumberInput
                                        placeholder="Enter phone number"
                                        name="phone"
                                        label={<span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><FiPhone size={11}/> Contact Number</span>}
                                    />
                                </div>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm w-full md:w-1/2 mb-4">
                                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-3"><FiCamera size={12}/> Profile Image</h4>
                                <MultipleImageInput name="image" max={1} />
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <Button
                                    type="button"
                                    onClick={() => setEdit(false)}
                                    className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !px-5 !py-2 !font-semibold !rounded-lg !text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={loader}
                                    className="!px-6 !py-2 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 !font-semibold !rounded-lg !text-xs transition-all"
                                >
                                    <FiEdit2 size={13} /> Save Profile Changes
                                </Button>
                            </div>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;