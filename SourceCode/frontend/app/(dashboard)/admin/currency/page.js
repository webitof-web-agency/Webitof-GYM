'use client';
import { Form, Modal, Switch } from 'antd';
import React, { useState } from 'react';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import { useAction, useActionConfirm, useFetch } from '../../../helpers/hooks';
import {
    delCurrency,
    fetchCurrency,
    postCurrency
} from '../../../helpers/backend';
import FormSelect from '../../../../components/form/select';
import dayjs from 'dayjs';
import { useCurrency } from '../../../contexts/site';
import { FiPlus, FiDollarSign, FiCalendar, FiBox, FiSettings, FiCheckCircle, FiEdit2 } from 'react-icons/fi';

const Currency = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchCurrency);
    const { changeCurrency } = useCurrency();
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formLoader, setFormLoader] = useState(false);

    const columns = [
        {
            text: 'Currency Designation',
            dataField: 'name',
            formatter: (name, d) => (
                 <div className="flex items-center gap-3 w-48">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-100 bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xl font-black">
                          {d?.symbol}
                      </div>
                      <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-[13px] capitalize">{name}</span>
                          <span className="text-[10px] font-bold text-[#F97316] mt-0.5 tracking-widest uppercase flex items-center gap-1">
                              <FiBox size={10}/> Code: {d?.code}
                          </span>
                      </div>
                 </div>
            )
        },
        {
            text: 'Exchange Rate',
            dataField: 'rate',
            formatter: (rate, d) => (
                <div className="flex flex-col">
                    <span className="font-bold text-emerald-600 font-mono text-sm">{rate}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">Base Ratio</span>
                </div>
            )
        },
        {
            text: 'Symbol Placement',
            dataField: 'placement',
            formatter: (placement) => (
                <span className={`text-[10px] font-bold uppercase border px-2.5 py-1 rounded inline-flex items-center gap-1.5 shadow-sm ${placement === 'Before' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                    {placement} Amount
                </span>
            )
        },
        {
            text: 'System Default',
            dataField: 'default',
            formatter: (_, d) => (
                <div className="flex items-center gap-2">
                     <Switch
                         checkedChildren={i18n?.t('Default')}
                         unCheckedChildren={i18n?.t('Not Default')}
                         checked={d?.default}
                         onChange={async (e) => {
                             await useActionConfirm(
                                 postCurrency,
                                 { _id: d._id, default: e },
                                 () => {
                                     if (e === true) {
                                         localStorage.removeItem('currency');
                                         changeCurrency(d?.code);
                                     }
                                     getData();
                                 },
                                 i18n?.t('Are you sure you want to change default status?'),
                                 'Yes, Change'
                             );
                         }}
                         size="small"
                         className='bg-gray-300 shadow-sm' 
                     />
                     {d?.default && <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1"><FiCheckCircle size={10}/> Active</span>}
                </div>
            ),
        },
        {
            text: 'Date Registered',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
    ];

    const handleSubmit = async (values) => {
        setFormLoader(true);
        try {
            await useAction(
                values?._id ? postCurrency : postCurrency,
                { ...values },
                () => {
                    setOpen(false);
                    getData();
                }
            );
        } finally {
            setFormLoader(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="mb-2">
                <PageTitle title='Financial Currencies' />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    action={
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setOpen(true);
                                setIsEdit(false);
                            }}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} /> {i18n?.t('Register Currency')}
                        </Button>
                    }
                    onEdit={(values) => {
                        form.resetFields();
                        form.setFieldsValue({ ...values });
                        setOpen(true);
                        setIsEdit(true);
                    }}
                    onDelete={delCurrency}
                    indexed
                    shadow={false}
                />
            </div>

            <Modal
                width={650}
                open={open}
                onCancel={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                         <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              {isEdit ? <FiEdit2 size={15} /> : <FiDollarSign size={15} />}
                         </div>
                         <span className="text-base font-bold text-gray-800 leading-tight">
                              {i18n?.t(isEdit ? 'Reconfigure Finance Mapping' : 'Initialize New Currency')}
                         </span>
                    </div>
                }
                footer={null}
                destroyOnClose={true}
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '24px' } }}
            >
                <Form form={form} layout='vertical' onFinish={handleSubmit} className="space-y-0 mt-4">
                    {isEdit && <HiddenInput name='_id' />}
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-3"><FiBox size={12}/> Global Exchange Parameters</h4>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                             <div className="col-span-1 md:col-span-2">
                                 <FormInput placeholder={('e.g. US Dollar, Euro')} label={<span className="text-xs font-bold text-gray-700">Display Identity</span>} name='name' required />
                             </div>
                             <div className="col-span-1">
                                 <FormInput placeholder={('e.g. $, €')} label={<span className="text-xs font-bold text-gray-700">Finance Symbol</span>} name='symbol' required />
                             </div>
                             <div className="col-span-1">
                                 <FormInput placeholder={('e.g. USD, EUR')} label={<span className="text-xs font-bold text-gray-700">ISO Standard Code</span>} name='code' required />
                             </div>
                         </div>
                    </div>

                    <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 w-full md:w-2/3 shadow-sm">
                         <h4 className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 mb-4"><FiSettings size={12}/> UI Integration Rules</h4>
                         
                         <div className="grid grid-cols-1 gap-y-2 w-full">
                             <div className="col-span-1">
                                 <FormSelect
                                     name='placement'
                                     label={<span className="text-[11px] font-bold text-gray-600">Symbol Rendering Strategy</span>}
                                     required={true}
                                     placeholder={'Select visual placement'}
                                     options={[
                                         { label: i18n?.t("Prepended (Before Amount)"), value: 'Before' },
                                         { label: i18n?.t("Appended (After Amount)"), value: 'After' },
                                     ]}
                                 />
                             </div>
                             <div className="col-span-1 border-t border-emerald-100/50 pt-2">
                                 <FormInput placeholder={('e.g. 1.00')} label={<span className="text-[11px] font-bold text-gray-600">Base Exchange Ratio</span>} name='rate' type='number' required />
                             </div>
                         </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-gray-100">
                         <Button 
                            type="button" 
                            onClick={() => { setOpen(false); form.resetFields(); setIsEdit(false); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                         >
                            Cancel
                         </Button>
                         <Button type='submit' loading={formLoader} className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg !text-xs transition-all !bg-emerald-600 hover:!shadow-emerald-600/30 border-emerald-600'>
                            {isEdit ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                            {i18n.t(isEdit ? 'Patch UI Settings' : 'Initialize Currency')}
                         </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Currency;

