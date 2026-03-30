"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { message, Select } from "antd";
import { fetchOrders, updateOrderStatus } from "../../../helpers/backend";
import { useAction, useFetch } from "../../../helpers/hooks";
import { useI18n } from "../../../providers/i18n";
import Table from "../../components/form/table";
import { useCurrency } from "../../../contexts/site";
import PageTitle from "../../components/common/page-title";
import { FiCalendar, FiUser, FiFilter } from "react-icons/fi";

const Page = () => {
    const router = useRouter();
    const i18n = useI18n()
    let { langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchOrders);
    const { getCurrencySymbol } = useCurrency();

    const handleStatusChange = async (newStatus, id) => {
        try {
            useAction(updateOrderStatus, { orderId: id, status: newStatus }, () => getData());
        } catch (error) {
            message.error('Failed to update order status.');
        }
    };

    let AllStatus = [
        { label: i18n?.t('Pending'), value: 'pending' },
        { label: i18n?.t('Accepted'), value: 'accepted' },
        { label: i18n?.t('Completed'), value: 'completed' },
        { label: i18n?.t('Cancelled'), value: 'cancelled' },
    ];

    const getOrderStatusBadge = (status) => {
        const map = {
            pending:   { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-100/50'  },
            accepted:  { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100/50'    },
            completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100/50' },
            cancelled: { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100/50'    },
        };
        return map[status] || map['pending'];
    };

    const getPaymentStatusBadge = (status) => {
        const map = {
            paid:    { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100/50'   },
            unpaid:  { bg: 'bg-rose-50',   text: 'text-rose-600',   border: 'border-rose-100/50'   },
            pending: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100/50' },
        };
        return map[status] || map['pending'];
    };

    const columns = [
        {
            text: "Order Reference",
            dataField: "uid",
            formatter: (_, d) => (
                <div className="flex flex-col">
                    <span className="font-mono font-bold text-[#5572fc] text-xs bg-[#5572fc]/10 px-2 py-0.5 rounded w-fit">
                        #{d?.uid}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium mt-1 inline-flex items-center gap-1">
                        <FiCalendar size={9} />
                        {dayjs(d?.createdAt).format("DD MMM YYYY")}
                    </span>
                </div>
            ),
        },
        {
            text: "Customer",
            dataField: "user",
            formatter: (_, d) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0 border border-slate-200">
                        <FiUser size={14} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-xs capitalize leading-tight">
                            {d?.user?.name || "Guest"}
                        </span>
                        {d?.user?.email && (
                            <span className="text-[10px] text-gray-400 font-medium truncate max-w-[140px]">{d?.user?.email}</span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            text: "Payment",
            dataField: "payment",
            formatter: (_, d) => {
                const payStyle = getPaymentStatusBadge(d?.payment?.status);
                return (
                    <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase border ${payStyle.bg} ${payStyle.text} ${payStyle.border}`}>
                            {d?.payment?.status || 'N/A'}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium capitalize bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded w-fit">
                            {d?.payment?.method || '—'}
                        </span>
                    </div>
                );
            },
        },
        {
            text: "Order Total",
            dataField: "subTotal",
            formatter: (_, d) => (
                <span className="font-bold text-gray-800 text-sm">
                    {getCurrencySymbol(d?.payment?.currency)}{d?.subTotal || 0}
                </span>
            ),
        },
        {
            text: "Fulfillment Status",
            dataField: "status",
            formatter: (_, d) => {
                const style = getOrderStatusBadge(d?.status);
                return (
                    <div className="flex items-center gap-2 flex-nowrap">
                        <span className={`inline-flex items-center flex-shrink-0 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase border ${style.bg} ${style.text} ${style.border}`}>
                            {d?.status || 'PENDING'}
                        </span>
                        <Select
                            value={d?.status || "pending"}
                            onChange={(newStatus) => handleStatusChange(newStatus, d?._id)}
                            size="small"
                            className="!w-32 !text-xs flex-shrink-0"
                            options={
                                d?.status === "pending"
                                    ? [{ label: i18n.t("Cancel Order"), value: "cancelled" }]
                                    : AllStatus.map((item) => ({
                                        label: item.label,
                                        value: item.value,
                                    }))
                            }
                        />
                    </div>
                );
            },
        },
    ];

    const action = (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-gray-400">
                <FiFilter size={12} />
            </div>
            <Select
                allowClear
                placeholder={i18n?.t("Filter by Status")}
                style={{ minWidth: 150 }}
                size="small"
                className="!rounded-lg !text-xs"
                onClear={() => getData({ status: undefined })}
                onChange={value => getData({ status: value })}
            >
                <Select.Option value={undefined}>{i18n?.t("All Orders")}</Select.Option>
                <Select.Option value={'pending'}>{i18n?.t("Pending")}</Select.Option>
                <Select.Option value={'accepted'}>{i18n?.t("Accepted")}</Select.Option>
                <Select.Option value={'cancelled'}>{i18n?.t("Cancelled")}</Select.Option>
                <Select.Option value={'completed'}>{i18n?.t("Completed")}</Select.Option>
            </Select>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title="Orders Management" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    onView={(d) => router.push(`/admin/order/view/${d?._id}`)}
                    indexed
                    pagination
                    langCode={langCode}
                    action={action}
                />
            </div>
        </div>
    );
}

export default Page;
