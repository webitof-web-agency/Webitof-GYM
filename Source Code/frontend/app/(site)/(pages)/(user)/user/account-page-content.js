'use client';
import React, { useEffect } from 'react';
import { Form } from 'antd';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { useAction } from '../../../../helpers/hooks';
import { userProfileUpdate } from '../../../../helpers/backend';
import { useUser } from '../../../../contexts/user';
import PhoneNumberInput from '../../../../../components/form/phoneNumberInput';
import MultipleImageInput from '../../../../../components/form/multiImage';
import FormSelect from '../../../../../components/form/select';
import FormDatePicker from '../../../../../components/form/date_picker';
import dayjs from 'dayjs';
import { useI18n } from '../../../../providers/i18n';

const AccountPageContent = () => {
    const [form] = Form.useForm();
    const { user, getUser } = useUser();
    const i18n = useI18n();

    useEffect(() => {
        form.setFieldsValue({
            ...user,
            image: user?.image
                ? [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: user?.image,
                    },
                ]
                : '',
            dob: user?.dob ? dayjs(user?.dob) : null,
        });
    }, [form, user]);

    const genders = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];

    return (
        <div className="w-full max-w-4xl max-lg:mx-auto">
            <Form
                form={form}
                layout='vertical'
                className="bg-white"
                onFinish={async (values) => {
                    const dateofbarth = values?.dob ? dayjs(values?.dob).format('YYYY-MM-DD') : 'null';
                    return await useAction(
                        userProfileUpdate,
                        {
                            ...values,
                            dob: dateofbarth,
                            image: values?.image?.[0]?.originFileObj,
                        },
                        () => {
                            getUser();
                        }
                    );
                }}
            >
                <div className='flex flex-col gap-6 md:gap-8'>
                    <div className="pb-6 border-b border-slate-200/80">
                        <h2 className='text-xl font-bold text-slate-800 tracking-tight'>
                            {i18n?.t('Personal Information')}
                        </h2>
                        <p className="text-[14.5px] font-medium text-slate-500 mt-1">Update your photo and personal details here.</p>
                    </div>
                    
                    <HiddenInput name='_id' />

                    {/* Top Profile block: Photo on left, key info on right */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile Photo (Left) */}
                        <div className="w-full md:w-1/3 flex flex-col gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">{i18n?.t('Profile Photo')}</label>
                                <p className="text-xs text-slate-500">{i18n?.t("This will be displayed on your profile.")}</p>
                            </div>
                            <div className="w-full max-w-[200px]">
                                <MultipleImageInput name='image' label="" />
                            </div>
                        </div>

                         {/* Key fields (Right) */}
                        <div className="w-full md:w-2/3 flex flex-col gap-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                                <FormInput name={i18n?.t('name')} label={i18n?.t('Full Name')} placeholder={i18n?.t('John Doe')} rules={[{ required: true, message: ('Please input your Name!') }]} />
                                <FormInput name={i18n?.t('email')} label={i18n?.t('Email Address')} placeholder={i18n?.t('john@example.com')} isEmail readOnly />
                            </div>
                            <div className="w-full">
                                <FormDatePicker name={i18n?.t('dob')} label={i18n?.t('Date of Birth')} placeholder={i18n?.t('Select Date')} />
                            </div>
                        </div>
                    </div>

                    {/* Additional Personal Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-4">
                        <div className="col-span-1 md:col-span-2">
                            <FormInput name={i18n?.t('address')} label={i18n?.t('Address')} placeholder={i18n?.t('123 Main St, City')} />
                        </div>
                        
                        <PhoneNumberInput
                            name={i18n?.t('phone')}
                            label={i18n?.t('Phone Number')}
                            placeholder={i18n?.t('+1 234 567 890')}
                            rules={[
                                {
                                    required: true,
                                    message: ('Please input your phone number!'),
                                },
                            ]}
                            hasFeedback
                        />
                         <FormSelect
                            name={i18n?.t('gender')}
                            label={i18n?.t('Gender')}
                            placeholder={i18n?.t('Select Gender')}
                            options={genders.map((gender) => ({
                                label: gender.label[i18n.langCode] || gender.label,
                                value: gender.value,
                            }))}
                        />

                        <div className="col-span-1 md:col-span-2">
                             <FormInput textArea={true} name={i18n?.t('about')} label={i18n?.t('About Me')} placeholder='Tell us a little bit about yourself' />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button type='submit' className='w-full sm:w-auto rounded-xl bg-[#5572fc] shadow-md shadow-[#5572fc]/20 px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-indigo-600 hover:shadow-lg hover:-translate-y-0.5'>
                            {i18n?.t('Save Changes')}
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default AccountPageContent;
