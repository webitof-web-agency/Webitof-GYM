import { Form } from 'antd';
import React from 'react';
import Button from '../common/button';

const BmiForm = ({ onFinish, form, pathName, i18n, isHome3 }) => {
    return (
        <div>
            <Form form={form} onFinish={onFinish} className='space-y-4 font-poppins'>
                <div className='mt-5 grid grid-cols-2 gap-6 pb-2'>
                    <div className=' '>
                        <Form.Item
                            name='weight'
                            rules={[
                                { required: true, message: i18n?.t('Enter Your Weight') },
                                { min: 1, message: i18n?.t('Weight must be greater than 0') },
                            ]}
                        >
                            <input
                                name="weight"
                                autoComplete="off"
                                placeholder={i18n?.t('Weight in kg, e.g. 70...')}
                                type='number'
                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                className={`w-full rounded border px-4 py-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 ${pathName?.name === 'home3' && isHome3 ? 'border-gray-100 bg-black text-white focus-visible:ring-offset-black' : 'bg-white text-textMain focus-visible:ring-offset-white'}`}
                            />
                        </Form.Item>
                    </div>
                    <div className=''>
                        <Form.Item
                            name='height'
                            rules={[
                                { required: true, message: i18n?.t('Enter Your Height') },
                                { min: 1, message: i18n?.t('Height must be greater than 0') },
                            ]}
                        >
                            <input
                                name="height"
                                autoComplete="off"
                                placeholder={i18n?.t('Height in cm, e.g. 175...')}
                                type='number'
                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                className={`w-full rounded border px-4 py-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 ${pathName?.name === 'home3' && isHome3 ? 'border-gray-100 bg-black text-white focus-visible:ring-offset-black' : 'bg-white text-textMain focus-visible:ring-offset-white'}`}
                            />
                        </Form.Item>
                    </div>
                    <div className=''>
                        <Form.Item
                            name='age'
                            rules={[
                                { required: true, message: i18n?.t('Enter Your Age') }
                            ]}
                        >
                            <input
                                name="age"
                                autoComplete="off"
                                placeholder={i18n?.t('Age, e.g. 28...')}
                                type='number'
                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                className={`w-full rounded border px-4 py-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 ${pathName?.name === 'home3' && isHome3 ? 'border-gray-100 bg-black text-white focus-visible:ring-offset-black' : 'bg-white text-textMain focus-visible:ring-offset-white'}`}
                            />
                        </Form.Item>
                    </div>
                    <div className=''>
                        <Form.Item
                            name='gender'
                            initialValue={'Male'}
                            rules={[
                                { required: true, message: i18n?.t('Select Your Gender') }
                            ]}
                        >
                            <select
                                name="gender"
                                aria-label={i18n?.t('Gender') || 'Gender'}
                                className={`w-full rounded border px-4 py-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 ${pathName?.name === 'home3' && isHome3 ? 'border-gray-100 bg-black text-white focus-visible:ring-offset-black' : 'bg-white text-textMain focus-visible:ring-offset-white'}`}
                            >
                                <option value='Male'>{i18n?.t('Male')}</option>
                                <option value='Female'>{i18n?.t('Female')}</option>
                            </select>
                        </Form.Item>
                    </div>
                </div>

                <div>
                    <Form.Item
                        name='activity'
                        initialValue={'Little to no exercise'}
                        rules={[
                            { required: true, message: i18n?.t('Select Your Activity') }
                        ]}
                    >
                        <select
                            name="activity"
                            aria-label={i18n?.t('Activity level') || 'Activity level'}
                            className={`w-full rounded border px-4 py-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 ${pathName?.name === 'home3' && isHome3 ? 'border-gray-100 bg-black text-white focus-visible:ring-offset-black' : 'bg-white text-textMain focus-visible:ring-offset-white'}`}
                        >
                            <option value='Little to no exercise'>
                                {i18n?.t('Little to no exercise')}
                            </option>
                            <option value='Light exercise 1-3 days/week'>
                                {i18n?.t('Light exercise 1-3 days/week')}
                            </option>
                            <option value='Moderate exercise 3-5 days/week'>
                                {i18n?.t('Moderate exercise 3-5 days/week')}
                            </option>
                            <option value='Hard exercise 6-7 days/week'>
                                {i18n?.t('Hard exercise 6-7 days/week')}
                            </option>
                            <option value='Intense exercise or physical job'>
                                {i18n?.t('Intense exercise or physical job')}
                            </option>
                        </select>
                    </Form.Item>
                </div>

                <div className='!mt-[50px]'>
                    <Button pathName={pathName?.name} type='submit' className='!px-8'>
                        {i18n?.t('Calculate')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default BmiForm;

