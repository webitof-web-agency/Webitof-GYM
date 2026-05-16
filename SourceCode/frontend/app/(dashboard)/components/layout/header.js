'use client';
import { FaBars } from 'react-icons/fa';
import { FiLock, FiLogOut, FiUser, FiChevronDown, FiKey, FiBell, FiMessageSquare } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '../../../contexts/user';
import { useI18n } from '../../../providers/i18n';
import NotificationDropdown from '../common/notification';
import { fetchAdminNotification } from '../../../helpers/backend';
import { initializeSocket } from '../../../helpers/socket';
import { useFetch } from '../../../helpers/hooks';
import Image from 'next/image';
import { notifyInfo, notifySuccess } from '../../../helpers/notify';
import { clearAuthStorage } from '../../../helpers/auth';

const findPreferredLanguage = (items = []) => {
    return (
        items.find((language) => language?.code?.toLowerCase() === 'en') ||
        items.find((language) => language?.name?.toLowerCase() === 'english') ||
        items.find((language) => language?.default) ||
        items[0]
    );
};

const fallbackEnglishOption = {
    _id: 'fallback-en',
    code: 'en',
    name: 'English',
};

const Header = () => {
    const { user } = useUser();
    const i18n = useI18n();
    const router = useRouter();
    const [limit, setLimit] = useState(5);
    const [notifications, getNotifications] = useFetch(fetchAdminNotification, { limit: limit });
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    const [defaultLang, setDefaultLang] = useState(null);
    const [selectedLangId, setSelectedLangId] = useState(null);
    const loadedLanguageOptions = Array.isArray(i18n?.languages?.docs) ? i18n.languages.docs : [];
    const languageOptions = loadedLanguageOptions.length > 0 ? loadedLanguageOptions : [fallbackEnglishOption];

    useEffect(() => {
        const socket = initializeSocket();
        socket.on('newNotification', (message) => {
            notifyInfo(message?.notification?.title);
            getNotifications();
        });
        return () => { socket.off('newNotification'); };
    }, []);

    useEffect(() => {
        let langId = localStorage.getItem('lang');
        const matchedLanguage = languageOptions.find((lang) => lang?._id === langId);
        const fallbackLanguage = findPreferredLanguage(languageOptions);
        const nextLanguage = matchedLanguage || fallbackLanguage;
        if (nextLanguage) {
            setSelectedLangId(nextLanguage._id);
            setDefaultLang(nextLanguage.name);
            if (nextLanguage._id !== fallbackEnglishOption._id) localStorage.setItem('lang', nextLanguage._id);
            if (nextLanguage._id !== fallbackEnglishOption._id && nextLanguage._id !== i18n?.lang) i18n?.changeLanguage(nextLanguage._id);
        } else {
            setSelectedLangId(null);
            setDefaultLang(null);
        }
    }, [i18n, languageOptions]);

    useEffect(() => {
        const closeMenus = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) setIsNotificationOpen(false);
            if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
        };
        document.addEventListener('mousedown', closeMenus);
        return () => document.removeEventListener('mousedown', closeMenus);
    }, []);

    const selectedLangName =
        defaultLang ||
        languageOptions.find((lang) => lang?._id === selectedLangId)?.name ||
        findPreferredLanguage(languageOptions)?.name ||
        languageOptions?.[0]?.name;

    const handleLogout = () => {
        try {
            clearAuthStorage();
            notifySuccess('Logged out successfully');
            window.location.href = '/signin';
        } catch (error) {
            console.log(error);
        }
    };

    const findUnreadNotifications = notifications?.docs?.filter((notice) => notice?.isRead === false);
    const unreadCount = findUnreadNotifications?.length || 0;

    // Get user initials for fallback avatar
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

    return (
        <header className='header z-10 border-b border-slate-100/80 bg-white/95 backdrop-blur-sm'>
            <div className='flex h-full items-center justify-between px-4 py-2.5'>
                
                {/* Left - hamburger (mobile) */}
                <div className='flex items-center gap-3'>
                    <button
                        type="button"
                        className='md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-gray-500 hover:bg-slate-50 transition-colors'
                        onClick={() => {
                            window.document.querySelector('.sidebar').classList.toggle('open');
                            window.document.querySelector('.sidebar-overlay').classList.toggle('open');
                        }}
                    >
                        <FaBars size={15} />
                    </button>
                </div>

                {/* Right - action row */}
                <div className='flex items-center gap-2'>

                    {/* Message Icon */}
                    <button
                        type='button'
                        onClick={() => router.push('/admin/message')}
                        className='relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-gray-500 hover:bg-slate-50 hover:text-[#F97316] hover:border-[#F97316]/30 transition-all'
                        title="Messages"
                    >
                        <Image
                            src='/messageIcon.gif'
                            width={40}
                            height={40}
                            alt='messages'
                            className='h-5 w-5 object-contain'
                        />
                    </button>

                    {/* Notification Bell */}
                    <div className='relative' ref={notificationRef}>
                        <button
                            type='button'
                            onClick={() => setIsNotificationOpen((open) => !open)}
                            className='relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-gray-500 hover:bg-slate-50 hover:text-[#F97316] hover:border-[#F97316]/30 transition-all'
                            title="Notifications"
                        >
                            <FiBell size={17} />
                            {unreadCount > 0 && (
                                <span className='absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm'>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                        {isNotificationOpen && (
                            <div className='absolute right-0 top-11 z-50 rounded-xl bg-white shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] ring-1 ring-slate-100 overflow-hidden'>
                                <NotificationDropdown
                                    setLimit={setLimit}
                                    limit={limit}
                                    notices={notifications}
                                    getNotifications={getNotifications}
                                />
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className='h-7 w-px bg-slate-200 mx-1' />

                    {/* Language Selector */}
                    <div className='relative'>
                        <select
                            value={selectedLangId || languageOptions?.[0]?._id || ''}
                            onChange={(e) => {
                                const nextValue = e.target.value;
                                setSelectedLangId(nextValue);
                                const nextLanguage = languageOptions.find((lang) => lang?._id === nextValue);
                                setDefaultLang(nextLanguage?.name || selectedLangName);
                                if (nextValue !== fallbackEnglishOption._id) {
                                    i18n.changeLanguage(nextValue);
                                    localStorage.setItem('lang', nextValue);
                                }
                            }}
                            className='h-9 appearance-none pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-[12px] font-semibold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all hover:bg-slate-50 capitalize'
                        >
                            {languageOptions.map((lang) => (
                                <option key={lang?._id} value={lang?._id}>{lang?.flag} {lang?.name}</option>
                            ))}
                        </select>
                        <FiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Divider */}
                    <div className='h-7 w-px bg-slate-200 mx-1' />

                    {/* Profile Dropdown */}
                    <div className='relative' ref={profileRef}>
                        <button
                            type='button'
                            className='flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#F97316]/30 transition-all'
                            onClick={() => setIsProfileOpen((open) => !open)}
                        >
                            {/* Avatar */}
                            {user?.image ? (
                                <img src={user?.image} alt="avatar" className='w-7 h-7 rounded-md object-cover border border-slate-200' />
                            ) : (
                                <div className='w-7 h-7 rounded-md bg-gradient-to-br from-[#F97316] to-[#FB923C] flex items-center justify-center text-white text-[10px] font-black'>
                                    {initials}
                                </div>
                            )}
                            <div className='hidden sm:flex flex-col items-start'>
                                <span className='text-[12px] font-bold text-gray-800 leading-tight'>{user?.name || 'Admin'}</span>
                                <span className='text-[9px] text-gray-400 font-medium tracking-wide uppercase'>Administrator</span>
                            </div>
                            <FiChevronDown size={13} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileOpen && (
                            <div className='absolute right-0 top-12 z-50 min-w-[200px] rounded-xl bg-white shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] ring-1 ring-slate-100 overflow-hidden'>
                                {/* Profile header */}
                                <div className='px-4 py-3 border-b border-slate-100 bg-slate-50/60'>
                                    <p className='text-[12px] font-bold text-gray-800'>{user?.name}</p>
                                    <p className='text-[10px] text-gray-400 truncate'>{user?.email}</p>
                                </div>

                                <div className='py-1.5'>
                                    <button
                                        type='button'
                                        onClick={() => { router.push('/admin/profile'); setIsProfileOpen(false); }}
                                        className='flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[12px] font-semibold text-gray-600 hover:bg-[#F97316]/5 hover:text-[#F97316] transition-colors'
                                    >
                                        <FiUser size={14} className='shrink-0' />
                                        {i18n?.t('My Profile')}
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => { router.push('/admin/profile/change-password'); setIsProfileOpen(false); }}
                                        className='flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[12px] font-semibold text-gray-600 hover:bg-[#F97316]/5 hover:text-[#F97316] transition-colors'
                                    >
                                        <FiKey size={14} className='shrink-0' />
                                        {i18n?.t('Change Password')}
                                    </button>
                                </div>

                                <div className='border-t border-slate-100 py-1.5'>
                                    <button
                                        type='button'
                                        onClick={handleLogout}
                                        className='flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[12px] font-semibold text-red-500 hover:bg-red-50 transition-colors'
                                    >
                                        <FiLogOut size={14} className='shrink-0' />
                                        {i18n?.t('Logout')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

