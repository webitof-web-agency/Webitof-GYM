'use client';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Form, Modal, Switch } from 'antd';
import { fetchCupons, postCupon, delCupon } from '../../../helpers/backend';
import { useAction, useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import { useI18n } from '../../../providers/i18n';
import Table from '../../components/form/table';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import FormDatePicker from '../../../../components/form/date_picker';
import FormSelect from '../../../../components/form/select';
import PageTitle from '../../components/common/page-title';
import { useCurrency } from '../../../contexts/site';
import { FiPlus, FiEdit2, FiTag, FiCalendar, FiPercent, FiShield } from 'react-icons/fi';

const Page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchCupons);
    const {currencySymbol} = useCurrency()
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);
    
    const columns = [
        {
            text: 'Coupon Details',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800 text-sm capitalize">{d?.name}</span>
                    <span className="font-mono font-bold text-[#F97316] text-[10px] bg-[#F97316]/10 px-2 py-0.5 rounded tracking-widest uppercase flex-shrink-0">
                        {d?.code}
                    </span>
                </div>
            ),
        },
        {
            text: 'Discount Value',
            dataField: 'discount',
            formatter: (_, d) => (
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-800">
                        {d?.type === 'percentage' ? `${d?.discount}%` : `${currencySymbol}${d?.discount}`}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase border ${
                        d?.type === 'percentage'
                            ? 'bg-purple-50 text-purple-600 border-purple-100/50'
                            : 'bg-orange-50 text-orange-600 border-orange-100/50'
                    }`}>
                        {d?.type === 'percentage' ? <FiPercent size={8} /> : null}
                        {d?.type}
                    </span>
                </div>
            ),
        },
        {
            text: 'Rules',
            dataField: 'rules',
            formatter: (_, d) => (
                <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                        <span className="font-bold text-gray-400 w-[60px] flex-shrink-0">Min. Order</span>
                        <span className="bg-slate-50 border border-slate-100 rounded px-1.5 font-bold text-gray-700">{currencySymbol}{d?.minimum_order_amount}</span>
                    </div>
                    <div className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                        <span className="font-bold text-gray-400 w-[60px] flex-shrink-0">Uses/User</span>
                        <span className="bg-slate-50 border border-slate-100 rounded px-1.5 font-bold text-gray-700">{d?.usage_limit_per_user}x</span>
                    </div>
                </div>
            ),
        },
        {
            text: 'Expiry Date',
            dataField: 'expire_at',
            formatter: (_, d) => {
                const expired = dayjs(d?.expire_at).isBefore(dayjs());
                return (
                    <span className={`text-[10px] px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5 font-medium whitespace-nowrap ${
                        expired
                            ? 'bg-rose-50 text-rose-500 border-rose-100/50'
                            : 'bg-slate-50 text-gray-600 border-slate-200'
                    }`}>
                        <FiCalendar size={10} className={expired ? 'text-rose-400' : 'text-gray-400'} />
                        {dayjs(d?.expire_at).format('DD MMM YYYY')}
                    </span>
                );
            },
        },
        {
            text: 'Status',
            dataField: 'status',
            formatter: (_, d) => (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-1.5 px-2.5 w-fit gap-3">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">{d?.status ? 'ACTIVE' : 'INACTIVE'}</span>
                    <Switch
                        size="small"
                        checked={d?.status}
                        onChange={async (e) => {
                            await useAction(postCupon, { _id: d._id, status: e }, () => getData());
                        }}
                        className="!m-0"
                    />
                </div>
            ),
        },
    ];

    const handleSubmit = async (values) => {
        const submitData = {
            _id: values?._id,
            name: values?.name,
            code: values?.code,
            discount: values?.discount,
            type: values?.type,
            usage_limit_per_user: values?.usage_limit_per_user,
            minimum_order_amount: values?.minimum_order_amount,
            expire_at: dayjs(values?.expire_at).format('YYYY-MM-DD'),
            status: values?.status,
        };

        return useAction(postCupon, submitData, () => {
            setOpen(false);
            getData();
        });
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title="Coupon Management" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    action={
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setEdit(false);
                                setOpen(true);
                            }}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} />
                            {i18n?.t('Add Coupon')}
                        </Button>
                    }
                    onEdit={(values) => {
                        setTimeout(() => {
                            form.setFieldsValue({
                                ...values,
                                _id: values?._id,
                                expire_at: dayjs(values?.expire_at),
                                status: values?.status === 'Active' || values?.status === true,
                                name: values?.name,
                                code: values?.code,
                                discount: values?.discount,
                                type: values?.type,
                                usage_limit_per_user: values?.usage_limit_per_user,
                                minimum_order_amount: values?.minimum_order_amount,
                            });
                        }, 0);
                        setEdit(true);
                        setOpen(true);
                    }}
                    data={data}
                    columns={columns}
                    indexed
                    pagination
                    onReload={getData}
                    loading={loading}
                    onDelete={delCupon}
                />
            </div>

            <Modal
                destroyOnClose
                width={580}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                            {edit ? <FiEdit2 size={15} /> : <FiTag size={15} />}
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">
                                {edit ? i18n?.t('Edit Coupon') : i18n?.t('Add New Coupon')}
                            </span>
                        </div>
                    </div>
                }
                open={open}
                onCancel={() => { setOpen(false); form.resetFields(); }}
                footer={null}
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                <Form layout='vertical' form={form} onFinish={handleSubmit} className="mt-3 space-y-0">
                    {edit && <HiddenInput name='_id' />}

                    {/* Identity Row */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                        <FormInput
                            placeholder="e.g. Summer Sale"
                            name='name'
                            label={i18n?.t('Coupon Name')}
                            required
                        />
                        <FormInput
                            placeholder="e.g. SUMMER20"
                            name='code'
                            label={i18n?.t('Coupon Code')}
                            required
                        />
                    </div>

                    {/* Discount Row */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                        <FormInput
                            placeholder="e.g. 20"
                            name='discount'
                            type='number'
                            label={i18n?.t('Discount Value')}
                            required
                        />
                        <FormSelect
                            placeholder="Select type"
                            name='type'
                            label={i18n?.t('Discount Type')}
                            required
                            options={[
                                { label: i18n?.t('Percentage (%)'), value: 'percentage' },
                                { label: i18n?.t('Flat Amount'), value: 'flat' },
                            ]}
                        />
                    </div>

                    {/* Limits Row */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                        <FormInput
                            placeholder="e.g. 3"
                            name='usage_limit_per_user'
                            type='number'
                            label={i18n?.t('Usage Limit / User')}
                            required
                        />
                        <FormInput
                            placeholder="e.g. 500"
                            name='minimum_order_amount'
                            type='number'
                            label={i18n?.t('Min. Order Amount')}
                            required
                        />
                    </div>

                    {/* Expiry + Status Row */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                        <FormDatePicker
                            placeholder="Pick expiry date"
                            name='expire_at'
                            label={i18n?.t('Expiry Date')}
                            required
                        />
                        <div className="bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between mt-[30px] mb-6 h-[40px]">
                            <div className="flex items-center gap-2">
                                <FiShield size={14} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-600">{i18n?.t('Active Status')}</span>
                            </div>
                            <Form.Item name='status' valuePropName='checked' className="!mb-0">
                                <Switch size="small" />
                            </Form.Item>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            onClick={() => { setOpen(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 hover:shadow-lg !font-semibold !rounded-lg !text-xs transition-all'
                        >
                            {edit ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                            {edit ? i18n?.t('Save Changes') : i18n?.t('Create Coupon')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Page;

