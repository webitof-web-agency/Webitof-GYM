'use client'
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import { FiSend, FiChevronLeft, FiPaperclip, FiSearch, FiMessageCircle, FiImage, FiDownload, FiMoreVertical } from 'react-icons/fi'
import { useAction, useActionConfirm, useFetch } from '../../../../../helpers/hooks'
import { deleteMessage, fetchUser, messageList, pdfFileUpload, postMessage, postSingleImage, userListMessaged } from '../../../../../helpers/backend'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { initializeSocket } from '../../../../../helpers/socket'
import { MdDownload } from 'react-icons/md'
import { Form, Modal, Image as AntImage, Tooltip } from 'antd'
import MultipleImageInput from '../../../../../(dashboard)/components/form/multiImage'
import UploadFileComponent from '../../../../../(dashboard)/components/form/pdfUpload'
dayjs.extend(relativeTime);
import { useI18n } from '../../../../../providers/i18n';
import { HiDotsVertical } from "react-icons/hi";

export default function MedicalChat() {
    const i18n = useI18n()
    const [imageForm] = Form.useForm();
    const [users, getUsers] = useFetch(userListMessaged)
    const [messageLists, getmessageList, { loading }] = useFetch(messageList, {}, false)
    const [pdfUpload, setPdfUpload] = useState(false)
    const [activeChat, setActiveChat] = useState(null)
    const [activeChatId, setActiveChatId] = useState(null)
    const [message, setMessage] = useState(null)
    const [imageModal, setImageModal] = useState(false)
    const [memberRole, setMemberRole] = useState(null)
    const [image, setImage] = useState(null)
    const [limit, setLimit] = useState(10)

    const chatEndRef = useRef(null)
    useEffect(() => {
        if (chatEndRef.current && limit <= 10) {
            chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight
        }
    }, [messageLists, activeChatId]);

    useEffect(() => {
        if (activeChatId != null) {
            getmessageList({ to: activeChatId, activeId: activeChatId })
        }
    }, [activeChatId])

    const handleSendMessage = async (e) => {
        if (message == null || message.trim() === '') return
        e.preventDefault()
        const { error } = await postMessage({ to: activeChatId, message: message })
        if (error === false) {
            setMessage('')
            getmessageList({ to: activeChatId })
            getUsers()
        }
    }

    useEffect(() => {
        const socket = initializeSocket()
        socket.on("newMessage", (message) => {
            fetchUser().then(({ error, data }) => {
                if (error === false && data?._id === message?.to) {
                    getmessageList({ to: message?.from })
                    getUsers()
                }
            });
        });
    }, [])

    useEffect(() => {
        getmessageList({ limit: limit, to: activeChatId })
    }, [limit])

    const handleChatClick = (id, name, role) => {
        setActiveChat(null); setActiveChatId(null); setMemberRole(null)
        setMemberRole(role); setActiveChat(name); setActiveChatId(id)
    }

    // ── Sidebar / Chat List ───────────────────────────────────────────────────
    const renderChatList = () => (
        <div className={`w-full md:w-[320px] md:border-r border-slate-100 flex-shrink-0 flex flex-col bg-white ${activeChat ? "hidden lg:flex" : "flex"}`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h1 className="text-base font-extrabold text-gray-800 tracking-tight">Messages</h1>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Platform communication hub</p>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-slate-100">
                <div className="relative">
                    <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="chat-search"
                        autoComplete="off"
                        placeholder="Search conversations…"
                        onChange={(e) => getUsers({ search: e.target.value })}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5572fc]/20 focus:border-[#5572fc] transition-all"
                    />
                </div>
            </div>

            {/* User List */}
            <div className="overflow-y-auto hide-scrollbar flex-1">
                {users?.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
                        <FiMessageCircle size={28} className="opacity-50" />
                        <p className="text-xs font-medium">No conversations yet</p>
                    </div>
                )}
                {users?.map((item, index) => {
                    const isActive = activeChatId === item?.chatUser?._id;
                    const initials = item?.chatUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
                    return (
                        <div
                            key={index}
                            className={`px-4 py-3.5 cursor-pointer transition-all duration-200 border-b border-slate-50 ${isActive
                                ? "bg-[#5572fc]/5 border-l-2 border-l-[#5572fc]"
                                : "hover:bg-slate-50 border-l-2 border-l-transparent"
                                }`}
                            onClick={() => {
                                handleChatClick(item?.chatUser?._id, item?.chatUser?.name, item?.chatUser?.role)
                                setImage(item?.chatUser?.image || "/defaultimg.jpg")
                            }}
                        >
                            <div className="flex gap-3 items-center">
                                <div className="relative shrink-0">
                                    {item?.chatUser?.image ? (
                                        <Image width={40} height={40} src={item?.chatUser?.image} alt="User"
                                            className="h-10 w-10 rounded-xl border border-slate-200 object-cover" />
                                    ) : (
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5572fc] to-[#7c93ff] flex items-center justify-center text-white text-xs font-black">
                                            {initials}
                                        </div>
                                    )}
                                    {item?.unseenCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm">
                                            {item.unseenCount > 9 ? '9+' : item.unseenCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-[13px] font-bold capitalize truncate ${isActive ? 'text-[#5572fc]' : 'text-gray-800'}`}>
                                            {item?.chatUser?.name}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 font-medium shrink-0 ml-2">
                                            {dayjs(item?.lastMessage?.createdAt).fromNow()}
                                        </p>
                                    </div>
                                    <p className="text-[10px] text-[#5572fc] font-bold uppercase tracking-wide mb-0.5 capitalize">{item?.chatUser?.role}</p>
                                    {item?.lastMessage?.message && (
                                        <p className={`text-[11px] truncate ${item?.unseenCount > 0 ? "text-gray-700 font-semibold" : "text-gray-400"}`}>
                                            {item?.lastMessage?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // ── Chat Area ─────────────────────────────────────────────────────────────
    const renderChatArea = () => (
        <div className={`flex-1 flex flex-col min-w-0 ${activeChat ? 'flex' : 'hidden lg:flex'}`}>
            {/* Chat Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3 bg-white">
                <button
                    className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-gray-500 hover:bg-slate-50 transition-colors"
                    onClick={() => { setActiveChat(null); setActiveChatId(null); getmessageList() }}
                >
                    <FiChevronLeft size={18} />
                </button>
                {image ? (
                    <Image width={40} height={40} src={image} alt={activeChat} className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                ) : (
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5572fc] to-[#7c93ff] flex items-center justify-center text-white text-xs font-black shrink-0">
                        {activeChat?.slice(0, 2).toUpperCase()}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h2 className="text-[13px] font-extrabold text-gray-800 leading-tight capitalize truncate">{activeChat}</h2>
                    <p className="text-[10px] text-[#5572fc] font-bold uppercase tracking-widest capitalize">{memberRole}</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto hide-scrollbar bg-slate-50/30" ref={chatEndRef}>
                {messageLists?.totalDocs >= limit && (
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={() => setLimit(limit + 10)}
                            className="text-[11px] font-semibold px-4 py-1.5 rounded-full bg-white border border-slate-200 text-gray-500 hover:bg-[#5572fc] hover:text-white hover:border-[#5572fc] transition-all shadow-sm"
                        >
                            {loading ? "Loading…" : "Load earlier messages"}
                        </button>
                    </div>
                )}

                <div className="flex flex-col-reverse gap-3">
                    {messageLists?.docs?.map((msg) => {
                        const isSent = msg?.to === activeChatId;
                        return (
                            <div key={msg?._id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                                {/* Image Message */}
                                {msg?.image ? (
                                    <div className={`max-w-[55%] flex flex-col relative ${isSent ? "items-end pr-6" : "items-start"}`}>
                                        {isSent && (
                                            <Tooltip trigger="click" placement="left" title={
                                                <div className='cursor-pointer' onClick={() => useActionConfirm(deleteMessage, { _id: msg?._id }, getmessageList, i18n.t("Are you sure you want to delete this message?"), i18n.t("warning"), false)}>
                                                    <p className="text-red-400 font-semibold text-xs">{i18n.t('Delete')}</p>
                                                </div>
                                            }>
                                                <div className="absolute -right-1 top-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 cursor-pointer transition-colors">
                                                    <HiDotsVertical size={14} className="text-gray-400" />
                                                </div>
                                            </Tooltip>
                                        )}
                                        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                            <AntImage alt="message-img" src={msg?.image} width={200} className="h-[200px] w-[200px] object-contain" />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 font-medium">{dayjs(msg?.createdAt).fromNow()}</p>
                                    </div>
                                ) : msg?.file ? (
                                    /* File Message */
                                    <div className={`max-w-[55%] flex flex-col relative ${isSent ? "items-end pr-6" : "items-start"}`}>
                                        {isSent && (
                                            <Tooltip trigger="click" placement="left" title={
                                                <div className='cursor-pointer' onClick={() => useActionConfirm(deleteMessage, { _id: msg?._id }, getmessageList, i18n.t("Are you sure you want to delete this message?"), i18n.t("warning"), false)}>
                                                    <p className="text-red-400 font-semibold text-xs">{i18n.t('Delete')}</p>
                                                </div>
                                            }>
                                                <div className="absolute -right-1 top-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 cursor-pointer transition-colors">
                                                    <HiDotsVertical size={14} className="text-gray-400" />
                                                </div>
                                            </Tooltip>
                                        )}
                                        <div className={`rounded-xl px-4 py-3 shadow-sm ${isSent ? "bg-[#5572fc]" : "bg-white border border-slate-200"}`}>
                                            <a href={msg?.file} target="_blank" rel="noopener noreferrer" download
                                                className={`flex items-center gap-2 text-xs font-semibold underline ${isSent ? "text-white/90" : "text-gray-700"}`}>
                                                <MdDownload size={16} />
                                                {i18n.t('Download')} — {msg?.file?.split("/")?.pop()?.slice(0, 20)}
                                            </a>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 font-medium">{dayjs(msg?.createdAt).fromNow()}</p>
                                    </div>
                                ) : (
                                    /* Text Message */
                                    <div className={`max-w-[60%] flex flex-col relative ${isSent ? "items-end pr-6" : "items-start"}`}>
                                        {isSent && (
                                            <Tooltip trigger="click" placement="left" title={
                                                <div className='cursor-pointer' onClick={() => useActionConfirm(deleteMessage, { _id: msg?._id }, getmessageList, i18n.t("Are you sure you want to delete this message?"), i18n.t("warning"), false)}>
                                                    <p className="text-red-400 font-semibold text-xs">{i18n.t('Delete')}</p>
                                                </div>
                                            }>
                                                <div className="absolute -right-1 top-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 cursor-pointer transition-colors">
                                                    <HiDotsVertical size={14} className="text-gray-400" />
                                                </div>
                                            </Tooltip>
                                        )}
                                        <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isSent
                                            ? "bg-[#5572fc] rounded-tr-sm"
                                            : "bg-white border border-slate-200 rounded-tl-sm"
                                        }`}>
                                            <p className={`text-[13px] font-medium leading-snug ${isSent ? "text-white" : "text-gray-800"}`}>
                                                {msg?.message}
                                            </p>
                                        </div>
                                        <p className={`text-[10px] text-gray-400 mt-1 font-medium ${isSent ? 'text-right' : 'text-left'}`}>
                                            {dayjs(msg?.createdAt).fromNow()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Message Input Bar */}
            <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 border-t border-slate-100 px-4 py-3 bg-white"
            >
                <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#5572fc]/20 focus-within:border-[#5572fc] transition-all">
                    <input
                        required
                        name="message"
                        type="text"
                        autoComplete="off"
                        placeholder="Type a message…"
                        aria-label="Message"
                        className="flex-1 bg-transparent text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none"
                        value={message || ''}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setImageModal(!imageModal)}
                        aria-label="Add image"
                        title="Send image"
                        className="text-gray-400 hover:text-[#5572fc] transition-colors"
                    >
                        <FiImage size={17} />
                    </button>
                    <button
                        type="button"
                        onClick={() => { setImageModal(!pdfUpload); setPdfUpload(!pdfUpload) }}
                        aria-label="Attach file"
                        title="Attach file"
                        className="text-gray-400 hover:text-[#5572fc] transition-colors"
                    >
                        <FiPaperclip size={17} />
                    </button>
                </div>
                <button
                    type="submit"
                    aria-label="Send message"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#5572fc] text-white hover:bg-[#4461eb] shadow-md shadow-[#5572fc]/30 transition-all hover:shadow-lg hover:shadow-[#5572fc]/40 shrink-0"
                >
                    <FiSend size={16} />
                </button>
            </form>

            {/* Attachment Modal */}
            <Modal
                open={imageModal}
                onCancel={() => { setImageModal(false); setPdfUpload(false) }}
                maskClosable={false}
                footer={null}
                title={
                    <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                        <div className="w-7 h-7 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                            {pdfUpload ? <FiPaperclip size={14} /> : <FiImage size={14} />}
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                            {pdfUpload ? "Attach Document (Max 6 MB)" : "Send Image (Max 6 MB)"}
                        </span>
                    </div>
                }
                className="rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                <Form form={imageForm} onFinish={async (values) => {
                    if (!pdfUpload && values?.image[0]?.originFileObj) {
                        const { error, data } = await postSingleImage({ image: values?.image[0]?.originFileObj, image_name: "message" });
                        if (!error) {
                            const { error: e2 } = await postMessage({ to: activeChatId, message: "", image: data })
                            if (!e2) {
                                setMessage(""); getmessageList({ to: activeChatId }); getUsers();
                                setImageModal(false); imageForm.resetFields();
                            }
                        }
                    } else if (values?.pdf?.file?.originFileObj) {
                        const { error, data } = await pdfFileUpload({ files: values?.pdf?.file?.originFileObj, pdf_name: "message" });
                        if (!error) {
                            const { error: e2 } = await postMessage({ to: activeChatId, message: "", file: data })
                            if (!e2) {
                                setMessage(""); getmessageList({ to: activeChatId }); getUsers();
                                setPdfUpload(false); setImageModal(false); imageForm.resetFields();
                            }
                        }
                    }
                }}>
                    <div className="space-y-4 mt-4">
                        {pdfUpload ? (
                            <UploadFileComponent label="Choose PDF file" name="pdf" required className="w-full" />
                        ) : (
                            <MultipleImageInput label="Choose Image" name="image" required className="w-full" />
                        )}
                        <button type="submit" className="w-full bg-[#5572fc] text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:bg-[#4461eb] transition-colors shadow-md shadow-[#5572fc]/20">
                            <FiSend size={14} className="inline mr-1.5" /> Send
                        </button>
                    </div>
                </Form>
            </Modal>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto animate-fade-in pb-6">
            <div className="bg-white rounded-xl shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] border border-slate-100/80 overflow-hidden flex h-[85vh]">
                {renderChatList()}
                {activeChat ? renderChatArea() : (
                    <div className="flex-1 hidden md:flex items-center justify-center flex-col text-center p-8 bg-slate-50/30">
                        <div className="w-20 h-20 rounded-2xl bg-[#5572fc]/10 flex items-center justify-center mb-6">
                            <FiMessageCircle size={36} className="text-[#5572fc]" />
                        </div>
                        <h3 className="text-base font-extrabold text-gray-700 mb-2">Select a Conversation</h3>
                        <p className="text-sm text-gray-400 font-medium max-w-xs">
                            Choose a contact from the sidebar to start messaging
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
