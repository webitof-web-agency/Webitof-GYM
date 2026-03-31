'use client';
import React, { useState } from 'react';
import { Form } from 'antd';
import BannerTitle from '../common/banner-title';
import { useI18n } from '../../app/providers/i18n';
import { motion } from 'framer-motion';
import BmiModal from './bmiModal';
import BmiForm from './bmiForm';
import { useCurrency } from '../../app/contexts/site';
import { usePathname } from 'next/navigation';
const FitnessCalculator = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [results, setResults] = useState(null);
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { findDefaultTheme } = useCurrency()
    const pathName = usePathname()
    const [values2,setValues2] = useState({})

    const calculateBMI = ({ weight, height }) =>
        parseFloat((weight / Math.pow(height / 100, 2)).toFixed(2));

    const calculateBMR = (weight, height, age, gender) => {
        if (gender === 'Male') {
            return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
        }
        return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    };

    const calculateCalories = (bmr, activity) => {
        const activityFactors = {
            'Little to no exercise': 1.2,
            'Light exercise 1-3 days/week': 1.375,
            'Moderate exercise 3-5 days/week': 1.55,
            'Hard exercise 6-7 days/week': 1.725,
            'Intense exercise or physical job': 1.9,
        };
        return bmr * activityFactors[activity];
    };

    const calculateMacros = (calories) => ({
        protein: Math.round((calories * 0.3) / 4),
        carbs: Math.round((calories * 0.5) / 4),
        fats: Math.round((calories * 0.2) / 9),
    });

    const calculateWaterIntake = (weight) => (weight * 0.033).toFixed(2);

    const onFinish = (values) => {
        setValues2(values)
        const bmi = calculateBMI(values);
        const bmr = calculateBMR(values.weight, values.height, values.age, values.gender);
        const dailyCalories = calculateCalories(bmr, values.activity);
        const macros = calculateMacros(dailyCalories);
        const waterIntake = calculateWaterIntake(values.weight);
        setResults({
            bmi,
            bmr: Math.round(bmr),
            dailyCalories: Math.round(dailyCalories),
            macros,
            waterIntake,
            category: getBMICategory(bmi),
        });
        setIsModalVisible(true);
        // form.resetFields();
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi >= 18.5 && bmi <= 24.9) return 'Healthy';
        if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
        return 'Obese';
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    const leftToRightVariant = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    const rightToLeftVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        position: 'absolute',
    };

    const bmiRows = [
        { range: i18n?.t('Below 18.5'), status: i18n?.t('Underweight'), color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-400' },
        { range: i18n?.t('18.5 – 24.9'), status: i18n?.t('Healthy'), color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-400' },
        { range: i18n?.t('25.0 – 29.9'), status: i18n?.t('Overweight'), color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-400' },
        { range: i18n?.t('30.0+'), status: i18n?.t('Obese'), color: 'bg-red-50 text-red-500', dot: 'bg-red-400' },
    ];

    return (
        <section className='container overflow-x-hidden'>
            <div className='lg:grid grid-cols-1 lg:gap-14 gap-10 lg:grid-cols-2 flex flex-col-reverse'>

                {/* Left — BMI chart card */}
                <div className='rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] flex flex-col'>
                    {/* Gradient header */}
                    <div className='bg-gradient-to-r from-[#3a52c4] to-[#5572fc] px-6 py-5'>
                        <p className='text-[11px] font-black text-white/60 uppercase tracking-widest mb-1'>{i18n?.t('Reference Chart')}</p>
                        <h3 className='text-xl font-extrabold text-white'>{i18n?.t('BMI & Fitness Chart')}</h3>
                    </div>

                    {/* Table */}
                    <div className='flex-1 p-4'>
                        <table className='w-full'>
                            <thead>
                                <tr className='text-[11px] font-black text-gray-400 uppercase tracking-widest'>
                                    <th className='text-left px-3 py-2'>{i18n?.t('BMI Range')}</th>
                                    <th className='text-left px-3 py-2'>{i18n?.t('Category')}</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-50'>
                                {bmiRows.map(({ range, status, color, dot }, idx) => (
                                    <tr key={idx} className='group'>
                                        <td className='px-3 py-3.5 text-[13px] font-bold text-gray-700 font-mono'>{range}</td>
                                        <td className='px-3 py-3.5'>
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${color}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer legend */}
                    <div className='border-t border-slate-100 px-6 py-4 bg-slate-50/50'>
                        <p className='text-[12px] text-gray-500 font-medium'>
                            <span className='font-black text-[#5572fc]'>{i18n?.t('BMR')}</span> {i18n?.t('— Basal Metabolic Rate')} &nbsp;·&nbsp;
                            <span className='font-black text-[#5572fc]'>{i18n?.t('BMI')}</span> {i18n?.t('— Body Mass Index')}
                        </p>
                    </div>
                </div>

                {/* Right — Form panel */}
                <div className='rounded-2xl border border-slate-100 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] p-6 lg:p-8 bg-white'>
                    <BannerTitle
                        home3={findDefaultTheme?.name === "home3" && pathName === "/" ? true : false}
                        subtitle={i18n?.t('fitness')}
                        title={i18n?.t('Fitness Calculation')}
                        className={'items-start'}
                    />
                    <p className='text-[13px] text-gray-500 leading-relaxed font-medium my-5 line-clamp-3'>
                        {i18n?.t("Use our BMI calculator to quickly assess if you're at a healthy weight based on your height and weight. Track your progress and stay on the path to better health.")}
                    </p>
                    <BmiForm
                        isHome3={pathName === "/" ? true : false}
                        i18n={i18n}
                        pathName={findDefaultTheme}
                        onFinish={onFinish}
                        form={form}
                    />
                </div>
            </div>
            <BmiModal
                results={results}
                i18n={i18n}
                isModalVisible={isModalVisible}
                handleClose={handleClose}
                values={values2}
                form={form}
                setResults={setResults}
            />
        </section>
    );
};

export default FitnessCalculator;
