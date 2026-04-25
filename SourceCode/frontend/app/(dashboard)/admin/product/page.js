"use client"
import React from 'react';
import { Form, Switch } from 'antd';
import { useRouter } from 'next/navigation';
import PageTitle from '../../components/common/page-title';
import { columnFormatter } from '../../../helpers/utils';
import { useI18n } from '../../../providers/i18n';
import { allProductsAdmin, deleteProduct, publishProduct } from '../../../helpers/backend';
import { useAction, useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import Table, { TableImage } from '../../components/form/table';
import dayjs from 'dayjs';
import { useCurrency } from '../../../contexts/site';
import { FiPlus, FiCalendar, FiBox } from 'react-icons/fi';

const page = () => {
    const [form] = Form.useForm();
    const router = useRouter()
    const i18n = useI18n()
    let { langCode } = useI18n();
    const {currencySymbol} = useCurrency()
    const [data, getData, { loading }] = useFetch(allProductsAdmin);

    const columns = [
        {
            text: 'Product Details',
            dataField: 'name',
            formatter: (_, d) => {
                const formattedValue = columnFormatter(d?.name);
                const truncatedText = formattedValue?.length > 45 
                    ? `${formattedValue.slice(0, 45)}...` 
                    : formattedValue;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 bg-white relative flex items-center justify-center">
                             {d?.thumbnail_image ? (
                                <TableImage url={d?.thumbnail_image} />
                             ) : (
                                <FiBox className="text-gray-300" size={20} />
                             )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-sm capitalize leading-tight">{truncatedText || "Unnamed Product"}</span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5 uppercase">SKU: {d?._id?.substring(Math.max(0, d?._id?.length - 6))}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            text: 'Pricing',
            dataField: 'price',
            formatter: (_, d) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-[#F97316]">{currencySymbol}{d?.price}</span>
                </div>
            ),
        },
        {
            text: 'Inventory',
            dataField: 'quantity',
            formatter: (_, d) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                    d?.quantity > 10 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' :
                    d?.quantity > 0 ? 'bg-orange-50 text-orange-600 border border-orange-100/50' :
                    'bg-rose-50 text-rose-600 border border-rose-100/50'
                }`}>
                    {d?.quantity} IN STOCK
                </span>
            ),
        },
        {
            text: 'Created Date',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: 'Store Status',
            dataField: 'image',
            formatter: (_, d) => (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-1.5 px-2.5 w-fit gap-3">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">{d?.is_active ? 'PUBLISHED' : 'HIDDEN'}</span>
                    <Switch
                        size="small"
                        checked={d?.is_active}
                        onChange={() => {
                            useAction(publishProduct, { productId: d?._id }, () => getData())
                        }}
                        className="!m-0"
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title="Product Inventory" />
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
                                router.push('/admin/product/add')
                            }}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} />
                            {i18n.t("Add Product")}
                        </Button>
                    }
                    onEdit={(values) => {
                        form.resetFields();
                        router.push(`/admin/product/edit/${values?._id}`)
                    }}
                    onView={(d) => {
                        router.push(`/admin/product/view/${d?._id}`)
                    }}
                    onDelete={deleteProduct}
                    indexed
                    pagination
                    langCode={langCode}
                />
            </div>
        </div>
    );
};

export default page;
