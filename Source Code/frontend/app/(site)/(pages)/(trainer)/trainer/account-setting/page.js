'use client';
import { Form } from 'antd';
import React, { useEffect } from 'react';
import { useUser } from '../../../../../contexts/user';
import FormInput, { HiddenInput } from '../../../../../../components/form/input';
import FormSelect from '../../../../../../components/form/select';
import { useAction } from '../../../../../helpers/hooks';
import { userProfileUpdate } from '../../../../../helpers/backend';
import FormDatePicker from '../../../../../../components/form/date_picker';
import dayjs from 'dayjs';
import { useI18n } from '../../../../../providers/i18n';
import { FaPlusCircle } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from '../../../../../../components/common/button';
import MultipleImageInput from '../../../../../../components/form/multiImage';

const AccountSettings = () => {
  const [form] = Form.useForm();
  const { user, getUser } = useUser();
  const i18n = useI18n();

  useEffect(() => {
    form.setFieldsValue({
      ...user,
      dob: user?.dob ? dayjs(user?.dob) : null,
      skills: user?.skills || [],
      image: user?.image
        ? [
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: user?.image,
          },
        ]
        : [],
    });
  }, [user?._id]);
  return (
    <div className='w-full max-w-4xl max-lg:mx-auto'>
      <Form
        form={form}
        layout="vertical"
        className="bg-white"
        onFinish={async (values) => {
          const skills = Array.isArray(values?.skills)
            ? values.skills
              .filter((skill) => skill?.name || skill?.level)
              .map((skill) => ({ name: skill?.name, level: skill?.level }))
            : [];

          let payload = {
            ...values,
            image: values?.image?.[0]?.originFileObj,
            skills: JSON.stringify(skills),
            dob: values?.dob ? dayjs(values?.dob).format('YYYY-MM-DD') : null,
          };

          return await useAction(userProfileUpdate, payload, () => {
            getUser();
          });
        }}
      >
        <div className='flex flex-col gap-6 md:gap-8'>
          {/* Header */}
          <div className="pb-6 border-b border-slate-200/80">
              <h2 className='text-xl font-bold text-slate-800 tracking-tight'>
                  {i18n?.t('Personal Information')}
              </h2>
              <p className="text-[14.5px] font-medium text-slate-500 mt-1">{i18n?.t("Update your photo and personal details here.")}</p>
          </div>

          <HiddenInput name="_id" />

          {/* Top Profile block: Photo on left, key info on right */}
          <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo (Left) */}
              <div className="w-full md:w-1/3 flex flex-col gap-3">
                  <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">{i18n?.t('Profile Photo')}</label>
                      <p className="text-xs text-slate-500">{i18n?.t("This will be displayed on your profile.")}</p>
                  </div>
                  <div className="w-full max-w-[200px]">
                      <MultipleImageInput name="image" label="" />
                  </div>
              </div>

              {/* Key fields (Right) */}
              <div className="w-full md:w-2/3 flex flex-col gap-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                      <FormInput name="name" label={i18n?.t("Name")} />
                      <FormInput name="email" label={i18n?.t("Email")} isEmail readOnly />
                  </div>
                  <div className="w-full">
                      <FormDatePicker name="dob" label={i18n?.t('Date of Birth')} />
                  </div>
              </div>
          </div>

          {/* Additional Personal Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            
            <FormInput name="phone" label={i18n?.t("Phone Number")} />
            <FormSelect
              name="gender"
              label={i18n?.t('Gender')}
              initialValue="Male"
              options={[
                { label: i18n?.t('Male'), value: 'Male' },
                { label: i18n?.t('Female'), value: 'Female' },
              ]}
            />
            
            <div className="col-span-1 md:col-span-2">
              <FormInput name="address" label={i18n?.t("Address")} />
            </div>

            <div className="col-span-1 md:col-span-2">
              <FormInput textArea={true} name="short_bio" label={i18n?.t('Short Bio')} rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value?.length > 200) {
                      return Promise.reject(i18n?.t('Short Bio should be less than 200 characters'));
                    }
                    return Promise.resolve();
                  }
                })
              ]} />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <FormInput textArea={true} name="about" label={i18n?.t("About")} />
            </div>
          </div>

          {/* Professional Details Section */}
          <div className="pb-6 border-b border-slate-200/80 mt-4">
              <h2 className='text-lg font-bold text-slate-800 tracking-tight'>
                  {i18n?.t('Professional Details')}
              </h2>
              <p className="text-[14px] font-medium text-slate-500 mt-1">{i18n?.t("Manage your experience, occupation, and trainer skills.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <FormInput name="experience" label={i18n?.t('Experience')} />
            <FormInput name="occupation" label={i18n?.t('Occupation')} />

            <div className="col-span-1 md:col-span-2 mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 bg-[#5572fc] h-full" />
              <div className="mb-4">
               <label className="block text-sm font-semibold text-slate-800 mb-1">{i18n?.t('Skills')}</label>
               <p className="text-xs text-slate-500">{i18n?.t("List up to 4 core professional skills.")}</p>
              </div>
              <Form.List name="skills" initialValue={[{ name: '', level: 0 }]}>
                {(fields, { add, remove }) => (
                  <div className="flex flex-col gap-4">
                    {fields.map(({ name }, index) => (
                      <div key={index} className="flex gap-4 items-start w-full">
                        <div className='flex-1 grid sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-1 w-full bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm'>
                          <FormInput className="mb-0" name={[name, 'name']} label={i18n?.t('Skill Name')} placeholder="e.g. Weightlifting" />
                          <FormInput className="mb-0" type="number" name={[name, 'level']} label={i18n?.t('Level (%)')} placeholder="80" />
                        </div>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            aria-label={i18n?.t('Remove field') || 'Remove field'}
                            onClick={() => remove(index)}
                            className='group flex-shrink-0 mt-6 flex justify-center items-center w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 transition-colors'
                          >
                              <RiDeleteBin6Line className="text-slate-400 group-hover:text-red-500 transition-colors text-lg" />
                          </button>
                        )}
                      </div>
                    ))}
                    {fields.length < 4 && (
                      <button
                        type="button"
                        className="text-[#5572fc] font-semibold text-sm flex items-center gap-2 hover:text-indigo-700 transition-colors w-fit mt-2 ml-1"
                        onClick={() => add()}
                      >
                        <FaPlusCircle className="text-lg" /> {i18n?.t("Add another skill")}
                      </button>
                    )}
                  </div>
                )}
              </Form.List>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="pb-2 border-b border-slate-200/80 mt-4">
              <h2 className='text-lg font-bold text-slate-800 tracking-tight'>
                  {i18n?.t('Social Media')}
              </h2>
              <p className="text-[14px] font-medium text-slate-500 mt-1">{i18n?.t("Connect your interactive profile presence.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <FormInput name="facebook" label="Facebook" placeholder="https://facebook.com/trainer" />
            <FormInput name="twitter" label="Twitter" placeholder="https://twitter.com/trainer" />
            <FormInput name="linkedin" label="Linkedin" placeholder="https://linkedin.com/in/trainer" />
            <FormInput name="instagram" label="Instagram" placeholder="https://instagram.com/trainer" />
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-slate-100 flex justify-end pb-8">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-[#5572fc] shadow-md shadow-[#5572fc]/20 px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-indigo-600 hover:shadow-lg hover:-translate-y-0.5"
            >
              {i18n?.t('Save Changes')}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AccountSettings;
