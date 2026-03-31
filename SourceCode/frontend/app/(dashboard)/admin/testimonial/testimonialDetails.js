"use client"
import { Modal, Rate } from 'antd';
import Image from 'next/image';
import { useI18n } from '../../../providers/i18n';
import { FiUser, FiMail, FiMessageSquare, FiStar, FiX } from 'react-icons/fi';

const TestimonialModal = ({ visible, onClose, testimonial }) => {
    const i18n = useI18n();
    const rating = parseFloat(testimonial?.rating) || 0;

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={500}
            title={
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                        <FiMessageSquare size={15} />
                    </div>
                    <span className="text-base font-bold text-gray-800 block leading-tight">
                        Testimonial Review
                    </span>
                </div>
            }
            className="custom-modal rounded-xl"
            styles={{ content: { padding: '20px' } }}
        >
            <div className="space-y-4 mt-3">
                {/* Reviewer Profile Card */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        {testimonial?.user?.image ? (
                            <Image
                                src={testimonial?.user?.image}
                                alt={testimonial?.user?.name || "user"}
                                width={56}
                                height={56}
                                className="rounded-full border-2 border-[#5572fc]/30 object-cover w-14 h-14"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center border-2 border-[#5572fc]/20">
                                <FiUser size={22} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm capitalize leading-tight">
                            {testimonial?.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <FiMail size={10} className="flex-shrink-0" />
                            {testimonial?.user?.email || 'No email'}
                        </span>
                    </div>
                </div>

                {/* Rating Card */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                        <FiStar size={14} className="text-[#5572fc]" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Rating Score</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Rate disabled value={rating} className="!text-[#5572fc] !text-sm" />
                        <span className="text-sm font-bold text-gray-800 bg-[#5572fc]/10 text-[#5572fc] px-2 py-0.5 rounded-md">
                            {rating}.0 / 5
                        </span>
                    </div>
                </div>

                {/* Review Content */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-3">
                        <FiMessageSquare size={12} className="text-[#5572fc]" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Review Content</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {testimonial?.description || 'No description provided.'}
                    </p>
                </div>

                {/* Close button */}
                <div className="flex justify-end pt-1 border-t border-gray-100 mt-2">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-lg transition-colors"
                    >
                        <FiX size={12} /> {i18n?.t('Close')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default TestimonialModal;
