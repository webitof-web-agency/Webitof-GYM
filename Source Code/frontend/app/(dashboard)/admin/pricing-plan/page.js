'use client';

import { Form, Modal, Spin, Switch } from 'antd';
import { useEffect, useState } from 'react';
import {
    delSubscription,
    fetchSubscription,
    postSingleImage,
    postSubscription,
} from '../../../helpers/backend';
import { useAction, useFetch } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import Table, { TableImage } from '../../components/form/table';
import FormInput, { HiddenInput } from '../../components/form/input';
import { columnFormatter } from '../../../helpers/utils';
import Button from '../../../../components/common/button';
import MultipleImageInput from '../../../../components/form/multiImage';
import dayjs from 'dayjs';
import { InfinitySpin } from 'react-loader-spinner';
import { FiPlus, FiTrash2, FiTag, FiEdit2, FiGlobe, FiCalendar, FiCheck } from 'react-icons/fi';
import { useCurrency } from '../../../contexts/site';

const fallbackLanguage = { code: 'en', name: 'English' };

const page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const { languages, langCode, t } = useI18n();
    const { currencySymbol, convertAmount } = useCurrency();
    const [data, getData, { loading }] = useFetch(fetchSubscription);
    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [selectedLang, setSelectedLang] = useState();
    const [loading2, setLoading2] = useState(false);
    const [formData, setFromData] = useState([]);
    
    const availableLanguages = Array.isArray(languages?.docs) && languages.docs.length > 0
        ? languages.docs
        : [fallbackLanguage];

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
    }, [availableLanguages, langCode]);

    const columns = [
        {
            text: 'Plan Details',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 bg-white">
                         <TableImage url={d?.image ? d?.image : '/defaultimg.jpg'} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm capitalize leading-tight">{columnFormatter(d?.name)}</span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5 uppercase">Plan ID: {d?._id?.substring(Math.max(0, d?._id?.length - 6))}</span>
                    </div>
                </div>
            ),
        },
        {
            text: 'Pricing Strategy',
            dataField: 'monthly_price',
            formatter: (_, d) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 w-12 pt-0.5">MONTHLY</span>
                        <span className="text-xs font-bold text-gray-700">{currencySymbol}{convertAmount(d?.monthly_price)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 w-12 pt-0.5">YEARLY</span>
                        <span className="text-xs font-bold text-[#5572fc] bg-[#5572fc]/10 px-2 rounded-md">{currencySymbol}{convertAmount(d?.yearly_price)}</span>
                    </div>
                </div>
            )
        },
        {
            text: 'Key Features',
            dataField: 'features',
            formatter: (features) => (
                <div className="flex flex-col gap-1">
                    {features?.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600 font-medium leading-tight">
                            <FiCheck className="text-emerald-500 flex-shrink-0" size={12} />
                            <span className="truncate max-w-[150px]">{columnFormatter(feature)}</span>
                        </div>
                    ))}
                    {features?.length > 2 && (
                        <span className="text-[10px] text-gray-400 font-bold ml-4">+{features.length - 2} MORE</span>
                    )}
                </div>
            ),
        },
        {
            text: 'Status',
            dataField: 'is_active',
            formatter: (d) => (
                <div className="flex items-center">
                    {d === true ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold capitalize bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold capitalize bg-rose-50 text-rose-600 border border-rose-100/50">
                            Inactive
                        </span>
                    )}
                </div>
            ),
        },
    ];

    const handleEdit = (record) => {
        setEditData(record);
        setEdit(true);
    };

    const handleAddNew = () => {
        form.resetFields();
        setEditData(null);
        setEdit(true);
    };

    useEffect(() => {
        if (editData) {
            form.setFieldsValue({
                ...editData,
                features: editData?.features,
                image: editData?.image
                    ? [{ uid: '-1', name: 'image.png', status: 'done', url: editData?.image }]
                    : [],
            });
        }
    }, [editData, form]);

    const handleNoSelected = () => {
        const values = form.getFieldsValue();
        let firstEmptyLang = null;
        for (const lang of availableLanguages) {
             if (!values?.name?.[lang.code]) {
                 firstEmptyLang = lang.code;
                 break;
             }
        }
        if (firstEmptyLang && firstEmptyLang !== selectedLang) {
             setSelectedLang(firstEmptyLang);
             setTimeout(() => form.submit(), 100);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title='Subscription Plans' />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    action={
                        <Button
                            onClick={handleAddNew}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} />
                            {i18n?.t('Add Plan')}
                        </Button>
                    }
                    onEdit={handleEdit}
                    onDelete={delSubscription}
                    indexed
                    pagination
                />
            </div>

            <Modal
                destroyOnClose={true}
                width={550}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                            {editData ? <FiEdit2 size={16} /> : <FiTag size={16} />}
                        </div>
                        <div>
                            <span className="text-base font-bold text-gray-800 block leading-tight">{editData ? i18n?.t('Update Plan') : i18n?.t('Add New Plan')}</span>
                        </div>
                    </div>
                }
                open={edit}
                onCancel={() => { setEdit(false); form.resetFields(); }}
                footer={null}
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                {availableLanguages.length > 1 && (
                    <div className='flex items-center justify-start gap-2 mb-2 mt-0 bg-slate-50 p-1.5 rounded-xl shadow-inner border border-slate-100 overflow-x-auto'>
                        <div className="pl-2 pr-1 text-slate-400"><FiGlobe size={14} /></div>
                        {availableLanguages.map((l, index) => (
                            <button
                                type='button'
                                onClick={() => setSelectedLang(l.code)}
                                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                                    l.code === selectedLang
                                        ? 'bg-white text-[#5572fc] shadow-sm border border-slate-200/50'
                                        : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
                                }`}
                                key={index}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>
                )}
                
                <Form
                    form={form}
                    layout='vertical'
                    className={`mt-2 space-y-2.5 ${availableLanguages.length <= 1 ? 'pt-0' : ''}`}
                    onFinish={async (values) => {
                        try {
                            setLoading2(true);
                            let imageUrl = '';
                            if (values?.image?.[0]?.originFileObj) {
                                const image = values.image[0].originFileObj;
                                const { data } = await postSingleImage({
                                    image,
                                    image_name: 'pricing-plan',
                                });
                                imageUrl = data;
                            } else {
                                imageUrl = values?.image?.[0]?.url || '';
                            }

                            const multiLangFields = ['name', 'features'];
                            const formattedData = multiLangFields.reduce((acc, field) => {
                                acc[field] = {};
                                availableLanguages.forEach((lang) => {
                                    if (values[field] && values[field][lang.code]) {
                                        acc[field][lang.code] = values[field][lang.code];
                                    }
                                });
                                return acc;
                            }, {});

                            const submitData = {
                                _id: values?._id,
                                ...formattedData,
                                monthly_price: values.monthly_price,
                                yearly_price: values.yearly_price,
                                features: values.features,
                                image: imageUrl,
                                is_active: editData
                                    ? values.is_active || form.getFieldValue('is_active')
                                    : true,
                            };

                            await useAction(postSubscription, submitData, () => {
                                setEdit(false);
                                getData();
                                form.resetFields();
                            });
                        } catch (error) {
                            console.error('Error during form submission:', error);
                        } finally {
                            setLoading2(false);
                        }
                    }}
                >
                    {loading2 ? (
                        <div className='flex min-h-[20vh] items-center justify-center'>
                            <InfinitySpin width='140' color='#5572fc' />
                        </div>
                    ) : (
                        availableLanguages.map((l, index) => (
                            <div
                                key={index}
                                style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                                className="space-y-2.5"
                            >
                                <HiddenInput name='_id' />

                                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 mb-1">
                                    <MultipleImageInput label={('Plan Graphic')} name='image' required />
                                </div>

                                <div className="grid grid-cols-1 gap-y-2">
                                    <FormInput
                                        label={i18n?.t('Plan Name')}
                                        name={['name', l.code]}
                                        required
                                        initialValue={editData?.name?.[l.code] || ''}
                                        onBlur={(e) => {
                                            if (formData?.length === 0) {
                                                setFromData([{ lang: selectedLang, value: e.target.value }]);
                                            } else {
                                                const uniqueData = formData?.filter((data) => data?.lang !== selectedLang);
                                                setFromData([...uniqueData, { lang: selectedLang, value: e.target.value }]);
                                            }
                                        }}
                                        placeholder={"e.g. Standard Member"}
                                    />

                                    <div>
                                        <h3 className='text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2'>{i18n?.t('Plan Highlights & Features')}</h3>
                                        <Form.List name={'features'} initialValue={[]}>
                                            {(fields, { add, remove }) => (
                                                <div className='space-y-2'>
                                                    {fields.map(({ key, name, ...restField }) => (
                                                        <div key={key} className='flex gap-x-2 items-start'>
                                                            <div className='w-full'>
                                                                <FormInput
                                                                    {...restField}
                                                                    placeholder={i18n?.t('e.g. 24/7 Gym Access')}
                                                                    name={[name, l.code]}
                                                                    required
                                                                    className="!mb-0"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(name)}
                                                                className='w-10 h-10 mt-0 flex-shrink-0 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300'
                                                            >
                                                                <FiTrash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type='button'
                                                        onClick={() => add()}
                                                        className='w-full border-2 border-dashed border-slate-200 hover:border-[#5572fc] bg-slate-50 hover:bg-[#5572fc]/5 text-gray-500 hover:text-[#5572fc] transition-all duration-300 rounded-lg py-2.5 text-xs font-bold flex items-center justify-center gap-1.5'
                                                    >
                                                        <FiPlus size={14} />
                                                        {i18n?.t('Add Feature Highlight')}
                                                    </button>
                                                </div>
                                            )}
                                        </Form.List>
                                    </div>

                                    <div className='grid grid-cols-2 gap-x-3 pt-2'>
                                        <FormInput
                                            label={'Monthly Price'}
                                            name='monthly_price'
                                            placeholder='0.00'
                                            required
                                            rules={[
                                                {
                                                    validator(_, value) {
                                                        if (value < 0) return Promise.reject(new Error(t("Price can't be negative")));
                                                        if (isNaN(value)) return Promise.reject(new Error(t('Price should be number')));
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}
                                        />
                                        <FormInput
                                            label={'Yearly Price'}
                                            name='yearly_price'
                                            placeholder='0.00'
                                            required
                                            rules={[
                                                {
                                                    validator(_, value) {
                                                        if (value < 0) return Promise.reject(new Error(t("Price can't be negative")));
                                                        if (isNaN(value)) return Promise.reject(new Error(t('Price should be number')));
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>

                                {editData && (
                                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-2.5 mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700">Plan Availability</span>
                                            <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-none">Activate or deactivate plan</span>
                                        </div>
                                        <Form.Item
                                            name='is_active'
                                            valuePropName='checked'
                                            className="mb-0 !p-0 hidden-margins"
                                            initialValue={true}
                                        >
                                            <Switch onChange={(val) => setIsActive(val)} />
                                        </Form.Item>
                                    </div>
                                )}
                                
                                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                                    <Button
                                        type="button"
                                        onClick={() => { setEdit(false); form.resetFields(); }}
                                        className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type='submit'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNoSelected();
                                            form.submit();
                                        }}
                                        className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 !font-semibold !rounded-lg block w-fit !text-xs transition-all'
                                    >
                                        {editData ? <FiEdit2 size={14} /> : <FiPlus size={14} />}
                                        {editData ? t('Save Changes') : t('Create Plan')}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default page;
