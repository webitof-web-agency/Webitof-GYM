'use client';
import { useEffect } from 'react';
import { useAction, useFetch } from '../../../../../helpers/hooks';
import { orderDetails, updateOrderStatus } from '../../../../../helpers/backend';
import { useI18n } from '../../../../../providers/i18n';
import { columnFormatter } from '../../../../../helpers/utils';
import Image from 'next/image';
import { Select, message } from 'antd';
import { useCurrency } from '../../../../../contexts/site';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiUser, FiMapPin, FiCalendar, FiCreditCard, FiShoppingBag, FiHash, FiMail, FiPhone } from 'react-icons/fi';

const Page = ({ params }) => {
  const i18n = useI18n();
  const { convertAmoutnWithCurrency, getCurrencySymbol } = useCurrency();
  const [data, getData, { loading }] = useFetch(orderDetails, {}, false);
  const router = useRouter();

  useEffect(() => {
    if (params?._id) {
      getData({ _id: params?._id });
    }
  }, [params?._id]);

  const handleStatusChange = async (newStatus) => {
    try {
      useAction(updateOrderStatus, { orderId: params?._id, status: newStatus }, () => getData());
    } catch (error) {
      message.error('Failed to update order status.');
    }
  };

  const getOrderStatusStyle = (status) => {
    const map = {
      pending:   { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-100' },
      accepted:  { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100'   },
      completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100'},
      cancelled: { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100'   },
    };
    return map[status] || map['pending'];
  };

  const getPayStatusStyle = (status) => {
    const map = {
      paid:    { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100'   },
      unpaid:  { bg: 'bg-rose-50',   text: 'text-rose-600',   border: 'border-rose-100'   },
      pending: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
    };
    return map[status] || map['pending'];
  };

  const orderStyle = getOrderStatusStyle(data?.status);
  const payStyle = getPayStatusStyle(data?.payment?.status);

  return (
    <div className="max-w-[1200px] mx-auto pb-10 animate-fade-in relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-lg shadow-sm text-gray-500 hover:text-[#5572fc] hover:border-[#5572fc] transition-all"
          >
            <FaArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-none">{i18n?.t('Order Details')}</h1>
            <span className="text-xs text-gray-400 font-medium font-mono">#{data?.uid}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase border ${orderStyle.bg} ${orderStyle.text} ${orderStyle.border}`}>
            {data?.status || 'Pending'}
          </span>
          <Select
            value={data?.status || 'pending'}
            onChange={handleStatusChange}
            size="small"
            className="!w-40 !rounded-lg"
            options={[
              { label: i18n?.t('Pending'),   value: 'pending'   },
              { label: i18n?.t('Accepted'),  value: 'accepted'  },
              { label: i18n?.t('Completed'), value: 'completed' },
              { label: i18n?.t('Cancelled'), value: 'cancelled' },
            ]}
          />
        </div>
      </div>

      {/* Top Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

        {/* Customer Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5 col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
              <FiUser size={13} />
            </div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{i18n?.t('Customer')}</h3>
          </div>
          <div className="space-y-2.5 pl-1 text-sm">
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 capitalize">{data?.user?.name || '—'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FiMail size={11} className="flex-shrink-0" />
              <span className="truncate">{data?.user?.email || '—'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FiPhone size={11} className="flex-shrink-0" />
              <span>{data?.user?.phone || '—'}</span>
            </div>
          </div>
        </div>

        {/* Shipping Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5 col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-500 border border-orange-100/50 flex items-center justify-center">
              <FiMapPin size={13} />
            </div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{i18n?.t('Shipping')}</h3>
          </div>
          <div className="space-y-2.5 pl-1 text-sm">
            <div className="flex flex-col">
              <span className="font-bold text-gray-800">{data?.location || '—'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="font-medium">{data?.city}</span>
              {data?.city && data?.zip_code && <span className="text-gray-300">·</span>}
              <span>{data?.zip_code}</span>
            </div>
          </div>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5 col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-500 border border-purple-100/50 flex items-center justify-center">
              <FiCalendar size={13} />
            </div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{i18n?.t('Order Info')}</h3>
          </div>
          <div className="space-y-2.5 pl-1 text-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Placed On</span>
              <span className="font-bold text-gray-800">{dayjs(data?.createdAt).format('DD MMM YYYY')}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Reference</span>
              <span className="font-mono font-bold text-[#5572fc] text-xs bg-[#5572fc]/10 px-1.5 py-0.5 rounded w-fit">#{data?.uid}</span>
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5 col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 border border-emerald-100/50 flex items-center justify-center">
              <FiCreditCard size={13} />
            </div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{i18n?.t('Payment')}</h3>
          </div>
          <div className="space-y-2 pl-1">
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase border ${payStyle.bg} ${payStyle.text} ${payStyle.border}`}>
              {data?.payment?.status || 'N/A'}
            </span>
            <div className="text-xs text-gray-600 capitalize font-medium">{data?.payment?.method || '—'}</div>
            <div className="text-[10px] text-gray-400 break-all font-mono mt-1">{data?.payment?.transaction_id}</div>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden mb-5">
        <div className="flex items-center gap-2 p-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
            <FiShoppingBag size={16} />
          </div>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-none">{i18n?.t("Order Items")}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-gray-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 font-bold">Product</th>
                <th className="px-5 py-3 font-bold">Category</th>
                <th className="px-5 py-3 font-bold text-center">Qty</th>
                <th className="px-5 py-3 font-bold text-right">Unit Price</th>
                <th className="px-5 py-3 font-bold text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.items?.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 bg-white">
                        {item?.thumbnail_image ? (
                          <Image
                            src={item?.thumbnail_image}
                            alt="product"
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <FiShoppingBag size={16} className="text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-xs capitalize leading-tight">{columnFormatter(item?.name)}</span>
                        {item?.variant && (
                          <span className="text-[10px] text-gray-400 font-medium mt-0.5 capitalize">{columnFormatter(item?.variant?.name)}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-gray-600 capitalize font-medium">{columnFormatter(item?.category) || '—'}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 rounded-lg text-xs font-bold text-gray-700">
                      {item?.quantity}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-bold text-gray-700 text-sm">
                      {getCurrencySymbol(data?.payment?.currency)}{convertAmoutnWithCurrency(item?.variant?.price || item?.price, data?.payment?.currency)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-bold text-[#5572fc] text-sm">
                      {getCurrencySymbol(data?.payment?.currency)}{item?.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Total Footer */}
        <div className="flex items-center justify-between bg-slate-50 border-t border-slate-100 px-5 py-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
            <FiHash size={12} />
            {data?.items?.length || 0} {i18n?.t('Item(s) Ordered')}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">{i18n?.t('Order Total')}</span>
            <span className="text-xl font-bold text-gray-800 leading-none">
              {getCurrencySymbol(data?.payment?.currency)}{data?.subTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;