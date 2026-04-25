import { Modal, Button } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { FiMail, FiUsers, FiClock, FiCheck, FiFileText, FiX } from 'react-icons/fi';

const EmailDetails = ({ open, setOpen, details }) => {
    const [showAllRecipients, setShowAllRecipients] = useState(false);
    const maxRecipientsToShow = 4;
    
    return (
        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            width={700}
            footer={null}
            destroyOnClose
            title={
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                        <FiMail size={15} />
                    </div>
                    <div>
                        <span className="text-base font-bold text-gray-800 block leading-tight">
                            Email Campaign Details
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">View the broadcast summary</span>
                    </div>
                </div>
            }
            className="custom-modal rounded-xl"
            styles={{ content: { padding: '20px' } }}
        >
            <div className="space-y-4 mt-3">
                {/* Meta Header */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-start flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <FiClock size={10} /> Date Sent
                        </span>
                        <span className="text-xs font-bold text-gray-800">
                            {dayjs(details?.createdAt).format('DD MMM YYYY, hh:mm A')}
                        </span>
                    </div>
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-start flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <FiUsers size={10} /> Sender Detail
                        </span>
                        <span className="text-xs font-bold text-[#F97316]">
                            {details?.from || 'Default Sender Address'}
                        </span>
                    </div>
                </div>

                {/* Audience Selection */}
                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-1.5">
                        <FiUsers size={12} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Recipient Audience List</span>
                    </div>
                    <div className="p-4 bg-white">
                        <div className={`overflow-y-auto hide-scrollbar ${showAllRecipients ? 'max-h-[160px]' : 'h-fit'} transition-all duration-300`}>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                {details?.to && (showAllRecipients ? details.to : details.to.slice(0, maxRecipientsToShow)).map((recipient, index) => (
                                    <li key={index} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                                            <FiCheck size={8} />
                                        </div>
                                        <span className="truncate">{recipient}</span>
                                    </li>
                                ))}
                            </ul>
                            {!details?.to?.length && (
                                <p className="text-xs text-gray-400 italic">No direct email targets selected.</p>
                            )}
                        </div>
                        {details?.to?.length > maxRecipientsToShow && (
                            <div className="mt-3 pt-3 border-t border-slate-50 flex justify-center">
                                <button 
                                    className="text-[10px] font-bold text-[#F97316] hover:text-[#F97316]/80 uppercase tracking-wide bg-[#F97316]/10 px-3 py-1 rounded"
                                    onClick={() => setShowAllRecipients(!showAllRecipients)}
                                >
                                    {showAllRecipients ? 'Collapse Target List' : `View ${details.to.length - maxRecipientsToShow} More Target Emails`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Body */}
                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-1.5">
                        <FiFileText size={12} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Email Message</span>
                    </div>
                    <div className="bg-white p-4">
                        <div className="mb-4 pb-3 border-b border-slate-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Subject Line</span>
                            <span className="text-sm font-bold text-gray-800 leading-snug">{details?.subject || 'No Subject Provided'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">HTML Content Block</span>
                            <div 
                                className="bg-slate-50/50 border border-slate-100 rounded-lg p-5 text-sm text-gray-700 min-h-[120px] max-h-[250px] overflow-y-auto prose prose-sm max-w-none shadow-inner" 
                                dangerouslySetInnerHTML={{ __html: details?.content }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-6 py-2 rounded-lg transition-colors"
                    >
                        <FiX size={13} /> Close Window
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EmailDetails;

