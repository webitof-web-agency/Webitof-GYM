'use client';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Form, Modal, Progress } from 'antd';
import Image from 'next/image';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import { useAction, useFetch } from '../../../helpers/hooks';
import { addTrainer, delTrainer, employeePasswordChange, fetchTrainers } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import FormInput from '../../../../components/form/input';
import PhoneNumberInput from '../../components/form/phoneNumberInput';
import PageTitle from '../../components/common/page-title';
import FormPassword from '../../../../components/form/password';
import { FiUser, FiMail, FiPhone, FiCalendar, FiUnlock, FiPlus, FiBriefcase, FiX, FiShield } from 'react-icons/fi';

const Page = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchTrainers);
    const [viewModal, setViewModal] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [open, setOpen] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [trainerId, setUserId] = useState('');

    const columns = [
        {
            text: 'Trainer Profile',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 bg-white">
                        <Image src={d?.image || "/defaultimg.jpg"} alt={d?.name} width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-xs">{d?.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{d?.email}</span>
                    </div>
                </div>
            )
        },
        {
            text: 'Contact Info',
            dataField: 'phone',
            formatter: (_, d) => (
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700 font-medium">{d?.phone}</span>
                </div>
            )
        },
        {
            text: 'Registered At',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1 font-medium">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        }
    ];

    const handleResetPassword = async (values) => {
        return useAction(
            employeePasswordChange,
            {
                _id: trainerId,
                new_password: values?.password,
                confirm_password: values?.confirm_password
            },
            () => {
                setIsReset(false);
                getData();
                form.resetFields();
            }
        );
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title={'Manage Trainers'} />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    action={
                        <Button
                            onClick={() => setOpen(true)}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs"
                        >
                            <FiPlus size={14} />
                            {i18n?.t('Add Trainer')}
                        </Button>
                    }
                    actions={(d) => (
                        <button
                            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F97316]/30 text-[#F97316] hover:bg-[#F97316] hover:text-white transition-all duration-300 text-[11px] font-bold shadow-sm bg-white whitespace-nowrap'
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsReset(true);
                                setUserId(d?._id);
                            }}
                        >
                            <FiUnlock size={12} />
                            {i18n.t('Reset Pass')}
                        </button>
                    )}
                    indexed
                    onDelete={delTrainer}
                    pagination
                    langCode={langCode}
                    onView={(trainer) => {
                        setSelectedTrainer(trainer);
                        setViewModal(true);
                    }}
                />
            </div>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center text-[#F97316]">
                            <FiUser size={16} />
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">{i18n?.t('Add New Trainer')}</span>
                        </div>
                    </div>
                }
                footer={null}
                destroyOnClose={true}
                className="custom-modal rounded-xl"
                width={500}
                styles={{ content: { padding: '20px' } }}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={(values) =>
                        useAction(addTrainer, values, () => {
                            setOpen(false);
                            getData();
                            form.resetFields();
                        })
                    }
                    className='mt-4 space-y-3'>
                    
                    <FormInput name='name' label="Full Name" required={true} placeholder={"e.g. John Doe"} />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3'>
                        <PhoneNumberInput
                            name='phone'
                            label={i18n?.t('Phone Number')}
                            required={true}
                        />
                        <FormInput name='email' label="Email Address" required={true} placeholder={"e.g. trainer@gym.com"} />
                    </div>
                    <div>
                        <FormPassword
                            name='password'
                            label="Temporary Password"
                            required={true}
                            placeholder={"Enter temporary password"}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-sm shadow-[#F97316]/20 !font-semibold !rounded-lg block w-fit !text-xs'
                        >
                            <FiPlus size={14} />
                            {i18n?.t('Submit Details')}
                        </Button>
                    </div>
                </Form>
            </Modal>
            
            <Modal
                open={viewModal}
                onCancel={() => setViewModal(false)}
                footer={null}
                width={360}
                centered
                closeIcon={<div className="bg-black/20 hover:bg-black/40 p-1 rounded backdrop-blur-sm transition-all text-white absolute top-3 right-3"><FiX size={14}/></div>}
                styles={{ 
                    content: { padding: 0, overflow: 'hidden', borderRadius: '16px' } 
                }}
            >
                {selectedTrainer && (
                    <div className='w-full bg-slate-50 relative pb-4 rounded-2xl overflow-hidden'>
                        <div className="h-28 w-full bg-gradient-to-br from-[#F97316] to-[#FB923C] relative">
                             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                        </div>
                        
                        <div className='absolute top-12 left-1/2 -translate-x-1/2 z-10'>
                            <div className="p-1 bg-slate-50 rounded-full shadow-sm">
                                <Image
                                    src={selectedTrainer.image ? selectedTrainer.image : "/defaultimg.jpg"}
                                    width={80}
                                    height={80}
                                    alt='profile image'
                                    className='w-[80px] h-[80px] rounded-full object-cover border-[3px] border-white bg-white'
                                />
                            </div>
                        </div>

                        <div className='mt-12 px-5 flex flex-col items-center text-center'>
                            <h2 className="text-xl font-bold text-gray-800 tracking-tight">{selectedTrainer.name}</h2>
                            <span className="inline-flex items-center gap-1 mt-1 bg-[#F97316]/10 text-[#F97316] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest">
                                <FiBriefcase size={10} />
                                FITNESS TRAINER
                            </span>

                            <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-3 mt-4 grid grid-cols-1 gap-y-2">
                                {[
                                    { label: i18n?.t("Email"), value: selectedTrainer.email, icon: <FiMail className="text-gray-400" size={14} /> },
                                    { label: i18n?.t("Phone"), value: selectedTrainer.phone, icon: <FiPhone className="text-gray-400" size={14} /> },
                                    { label: i18n?.t("Joined"), value: dayjs(selectedTrainer.createdAt).format('DD MMM YYYY'), icon: <FiCalendar className="text-gray-400" size={14} /> },
                                ].map((item, index) => (
                                    <div key={index} className={`flex items-center justify-between group ${index !== 2 ? 'pb-2 border-b border-slate-100' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                                {item.icon}
                                            </div>
                                            <span className="text-[11px] font-semibold text-gray-400">{item.label}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{item.value || "N/A"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedTrainer?.skills?.length > 0 && (
                            <div className='mt-4 px-5'>
                                <h3 className='text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2 ml-1'>
                                    Skills
                                </h3>
                                <div className='flex flex-col gap-2.5 bg-white p-3 rounded-xl shadow-sm border border-slate-200'>
                                    {selectedTrainer?.skills?.map(skill => (
                                        <div key={skill?._id} className='w-full'>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className='text-gray-700 text-xs font-bold capitalize'>{skill?.name}</span>
                                                <span className="text-[10px] font-black text-[#F97316]">{skill?.level}%</span>
                                            </div>
                                            <Progress 
                                                strokeColor={{ '0%': '#FB923C', '100%': '#F97316' }} 
                                                trailColor="#f1f5f9"
                                                percent={skill?.level} 
                                                showInfo={false}
                                                size="small" 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
            
            <Modal
                open={isReset}
                onCancel={() => { setIsReset(false); form.resetFields(); }}
                footer={null}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <FiShield size={16} />
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">{i18n?.t('Security Reset')}</span>
                        </div>
                    </div>
                }
                destroyOnClose={true}
                maskClosable={false}
                className="rounded-xl"
                width={360}
                styles={{ content: { padding: '20px' } }}
            >
                <Form
                    onFinish={handleResetPassword}
                    layout='vertical'
                    className='mt-3'
                >
                    <div className="bg-yellow-50/50 p-2.5 rounded-lg border border-yellow-100/50 mb-4 flex gap-2 items-start">
                       <span className="text-yellow-500 mt-0.5"><FiShield size={14}/></span>
                       <div>
                           <p className="text-[11px] text-yellow-700 font-medium leading-relaxed">You are resetting the password for a trainer. Provide credentials securely.</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                        <FormPassword
                            name='password'
                            label={i18n.t('New Password')}
                            type={'password'}
                            placeholder={i18n?.t('Enter Password')}
                        />
                        <FormPassword 
                            name='confirm_password'
                            label={i18n.t('Confirm Password')}
                            confirm={true}
                            placeholder={"Verify Password"}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={() => { setIsReset(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </Button>
                        <Button type='submit' loading={loading} className="!px-5 !py-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg block w-fit !text-xs">
                            {i18n?.t('Reset Pass')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Page;

