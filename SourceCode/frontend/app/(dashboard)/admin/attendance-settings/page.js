'use client';
import React, { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import PageTitle from '../../components/common/page-title';
import { fetchAttendanceSettings, postAttendanceSettings } from '../../../helpers/backend';
import { HiddenInput } from '../../components/form/input';
import { useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import { useI18n } from '../../../providers/i18n';
import FormSelect from '../../components/form/select';
import { FiClock, FiCalendar, FiSave, FiSettings } from 'react-icons/fi';

const AdminSettings = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const [data, getData] = useFetch(fetchAttendanceSettings);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data);
        }
    }, [data, form]);

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const submitData = {
                ...values,
                _id: values?._id || undefined
            };
            const { err, msg } = await postAttendanceSettings(submitData);
            if (err) {
                message.error(msg);
            } else {
                message.success(msg || 'Settings saved successfully');
                getData();
            }
        } finally {
            setLoading(false);
        }
    };

    const generateTimeSlots = (start, end) => {
        let slots = [];
        let [startHour] = start.split(":").map(Number);
        let [endHour] = end.split(":").map(Number);
    
        for (let hour = startHour; hour <= endHour; hour++) {
            const period = hour >= 12 ? "PM" : "AM";
            const displayHour = hour % 12 || 12; 
            const label = `${displayHour}:00 ${period}`;
            const value = `${hour.toString().padStart(2, '0')}:00`;
            slots.push({ label, value });
        }
        return slots;
    };

    // Assuming global boundary mapping
    const timeSlots = generateTimeSlots("01:00", "24:00");
    const weekendDays = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    return (
        <div className="max-w-[700px] mx-auto space-y-5 animate-fade-in relative z-0">
            <div className="flex flex-col mb-4">
                <PageTitle title={i18n.t("Attendance Preferences")} className="!mb-1" />
                <p className="text-xs text-gray-500 font-medium max-w-lg leading-relaxed">
                    Configure your organization's global shifting rules. Setting proper bounds ensures that punch-in records calculate late penalties and active periods correctly across the dashboard.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
                <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-[#5572fc]">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                            <FiSettings size={15} />
                        </div>
                        <div>
                            <span className="text-[12px] font-bold uppercase tracking-widest block text-gray-800 leading-tight">System Constraints</span>
                            <span className="text-[10px] text-gray-500 font-medium">Define logic parameters</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 pb-8">
                    <Form form={form} layout="vertical" onFinish={handleFinish} className="space-y-4">
                        <HiddenInput name="_id" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 place-items-start">
                             <div className="w-full">
                                 <label className="flex items-center gap-2 mb-2">
                                     <FiClock size={13} className="text-[#5572fc]"/>
                                     <span className="text-xs font-bold text-gray-700">Official Check-In Time</span>
                                 </label>
                                 <FormSelect 
                                    className="!w-full"
                                    placeholder={i18n?.t("Select Time")} 
                                    name="checkInTime" 
                                    options={timeSlots} 
                                    required 
                                 />
                                 <span className="text-[10px] text-gray-400 block mt-1">Stamps past this time trigger tardy alerts.</span>
                             </div>

                             <div className="w-full">
                                 <label className="flex items-center gap-2 mb-2">
                                     <FiClock size={13} className="text-[#5572fc]"/>
                                     <span className="text-xs font-bold text-gray-700">Official Check-Out Time</span>
                                 </label>
                                 <FormSelect 
                                    className="!w-full"
                                    placeholder={i18n?.t("Select Time")} 
                                    name="checkOutTime" 
                                    options={timeSlots} 
                                    required 
                                 />
                                 <span className="text-[10px] text-gray-400 block mt-1">Establishes daily work session boundaries.</span>
                             </div>
                        </div>

                        <div className="w-full pt-2">
                             <label className="flex items-center gap-2 mb-2">
                                 <FiCalendar size={13} className="text-orange-500"/>
                                 <span className="text-xs font-bold text-gray-700">Designated Weekends (Off-Days)</span>
                             </label>
                             <FormSelect 
                                placeholder={i18n?.t("Select Weekend Days")} 
                                name="weekend" 
                                multi={true}
                                options={weekendDays?.map((day, index) => ({label: day, value: index}))} 
                                required 
                             />
                             <span className="text-[10px] text-gray-400 block mt-1">Selected days naturally override absence detection scripts.</span>
                        </div>

                        <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
                             <Button 
                                type='submit' 
                                loading={loading}
                                className="flex items-center justify-center gap-2 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !px-6 !py-2.5 !rounded-lg !text-[12px] font-bold"
                             > 
                                <FiSave size={14}/> {i18n?.t("Save Configuration")} 
                             </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;