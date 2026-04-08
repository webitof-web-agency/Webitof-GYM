import React from "react";
import { Modal } from "antd";
import { columnFormatter } from "../../../helpers/utils";
import { useCurrency } from "../../../contexts/site";
import { FiUser, FiTag, FiCreditCard, FiClock, FiActivity, FiHash, FiMail, FiCalendar } from "react-icons/fi";
import dayjs from "dayjs";

const SubscriptionModal = ({ isVisible, onClose, subscriptionData }) => {
  if (!subscriptionData) {
    return null;
  }
  const {currencySymbol} = useCurrency()

  const {
    uid,
    user,
    subscription,
    price,
    active,
    payment,
    start_date,
    end_date,
  } = subscriptionData;

  return (
    <Modal
        destroyOnClose={true}
        width={500}
        title={
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                    <FiActivity size={16} />
                </div>
                <div>
                    <span className="text-base font-bold text-gray-800 block leading-tight">Subscription Record</span>
                </div>
            </div>
        }
        open={isVisible}
        onCancel={onClose}
        footer={null}
        className="custom-modal rounded-xl"
        styles={{ content: { padding: '20px' } }}
    >
      <div className="space-y-3 mt-3">
        {/* User Card */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
             <FiUser className="text-[#5572fc]" size={14} />
             <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest leading-none">Subscriber Identity</h3>
          </div>
          <div className="grid grid-cols-1 gap-y-2 mt-3 pl-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Full Name</span>
              <span className="font-bold text-gray-800">{user?.name || "Deleted Account"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium flex items-center gap-1.5"><FiMail size={12} /> Email</span>
              <span className="font-bold text-gray-800">{user?.email || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Plan Card */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
             <FiTag className="text-[#5572fc]" size={14} />
             <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest leading-none">Plan Structure</h3>
          </div>
          <div className="grid grid-cols-1 gap-y-2 mt-3 pl-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Subscription Name</span>
              <span className="font-bold text-[#5572fc] capitalize bg-[#5572fc]/10 px-2.5 py-0.5 rounded-md">{columnFormatter(subscription?.name) || "Deleted Plan"}</span>
            </div>
          </div>
        </div>

        {/* Lifecycle Card */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 shadow-sm grid grid-cols-2 gap-x-4">
           <div>
               <div className="flex items-center gap-1.5 mb-2">
                  <FiCalendar className="text-[#5572fc]" size={14} />
                  <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest leading-none">Start Date</h3>
               </div>
               <span className="text-sm font-bold text-gray-800 pl-1">{dayjs(start_date).format('DD MMM YYYY')}</span>
           </div>
           <div>
               <div className="flex items-center gap-1.5 mb-2">
                  <FiClock className="text-[#5572fc]" size={14} />
                  <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest leading-none">End Date</h3>
               </div>
               <span className="text-sm font-bold text-gray-800 pl-1">{dayjs(end_date).format('DD MMM YYYY')}</span>
           </div>
        </div>

        {/* Financial Flow Card */}
        <div className="bg-white border-2 border-slate-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5">
             <FiCreditCard size={100} />
          </div>
          <div className="flex items-center gap-2 mb-3 relative z-10">
             <FiCreditCard className="text-[#5572fc]" size={14} />
             <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest leading-none">Financial Settlement</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10 mt-4">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-bold text-gray-400">Paid Amount</span>
                 <span className="text-lg font-bold text-gray-800">
                   {currencySymbol}{payment?.paid_amount ?? price}
                 </span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-bold text-gray-400">Due Amount</span>
                 <span className="text-lg font-bold text-gray-800">
                   {currencySymbol}{payment?.due_amount ?? 0}
                 </span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-bold text-gray-400">Method</span>
                 <span className="text-sm font-bold text-gray-700 uppercase">{payment?.method || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-bold text-gray-400">Transaction</span>
                 <span className="text-xs font-bold text-gray-500 font-mono tracking-tight">{payment?.transaction_id || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-bold text-gray-400">Condition</span>
                 <div className="flex gap-2 items-center">
                     {payment?.status === "paid" ? (
                        <span className="inline-flex rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 shadow-sm">Paid</span>
                     ) : payment?.status === "partial" ? (
                        <span className="inline-flex rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 shadow-sm">Partial</span>
                     ) : (
                        <span className="inline-flex rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-700 px-2 py-0.5 shadow-sm">{payment?.status || 'Pending'}</span>
                     )}
                     {active ? (
                        <span className="inline-flex rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 shadow-sm">Active Plan</span>
                     ) : (
                        <span className="inline-flex rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-700 px-2 py-0.5 shadow-sm">Expired</span>
                     )}
                 </div>
              </div>
          </div>
        </div>
        
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
