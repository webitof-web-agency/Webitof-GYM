'use client';
import { FaBars } from 'react-icons/fa';
import { FiLock, FiLogOut, FiUser } from 'react-icons/fi';
import { BiUser } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '../../../contexts/user';
import Link from 'next/link';
import { ImExit } from 'react-icons/im';
import { useI18n } from '../../../providers/i18n';
import NotificationDropdown from '../common/notification';
import { fetchAdminNotification } from '../../../helpers/backend';
import { initializeSocket } from '../../../helpers/socket';
import { IoMdNotifications } from 'react-icons/io';
import { useFetch } from '../../../helpers/hooks';
import Image from 'next/image';
import { notifyInfo, notifySuccess } from '../../../helpers/notify';

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
    const languageOptions =
        loadedLanguageOptions.length > 0 ? loadedLanguageOptions : [fallbackEnglishOption];

    useEffect(() => {
        const socket = initializeSocket();
        socket.on('newNotification', (message) => {
            notifyInfo(message?.notification?.title);
            getNotifications();
        });
        return () => {
            socket.off('newNotification');
        };
    }, []);
    useEffect(() => {
        let langId = localStorage.getItem('lang');
        const matchedLanguage = languageOptions.find((lang) => lang?._id === langId);
        const fallbackLanguage = findPreferredLanguage(languageOptions);
        const nextLanguage = matchedLanguage || fallbackLanguage;

        if (nextLanguage) {
            setSelectedLangId(nextLanguage._id);
            setDefaultLang(nextLanguage.name);
            if (nextLanguage._id !== fallbackEnglishOption._id) {
                localStorage.setItem('lang', nextLanguage._id);
            }
            if (nextLanguage._id !== fallbackEnglishOption._id && nextLanguage._id !== i18n?.lang) {
                i18n?.changeLanguage(nextLanguage._id);
            }
        } else {
            setSelectedLangId(null);
            setDefaultLang(null);
        }
    }, [i18n, languageOptions]);

    useEffect(() => {
        const closeMenus = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
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
            localStorage.removeItem('token');
            notifySuccess('Logged out successfully');
            window.location.href = '/signin';
        } catch (error) {
            console.log(error);
        }
    };

    const handleProfile = () => {
        router.push('/admin/profile');
    };

    const handleChangePassword = () => {
        router.push('/admin/profile/change-password');
    };

    const findUnreadNotifications = notifications?.docs?.filter(
        (notice) => notice?.isRead === false
    );
    return (
        <header className='header z-10'>
            {
                <div className='flex h-full items-center justify-between p-4'>
                    <div className=''>
                        <FaBars
                            className='md:hidden'
                            role='button'
                            onClick={() => {
                                window.document.querySelector('.sidebar').classList.toggle('open');
                                window.document
                                    .querySelector('.sidebar-overlay')
                                    .classList.toggle('open');
                            }}
                        />
                    </div>

                    <div className='notification-popover flex items-center gap-x-3 sm:gap-x-6'>
                        <div className='flex items-center gap-3'>
                            <button
                                type='button'
                                onClick={() => router.push('/admin/message')}
                                className='admin-header-icon-button'
                            >
                                <Image
                                    src='/messageIcon.gif'
                                    width={40}
                                    height={40}
                                    alt='logo'
                                    className='h-6 w-7 object-contain'
                                />
                            </button>
                            <div className='relative' ref={notificationRef}>
                                <button
                                    type='button'
                                    onClick={() => setIsNotificationOpen((open) => !open)}
                                    className='admin-header-icon-button relative'
                                >
                                    <IoMdNotifications className='admin-header-icon' size={24} />
                                    {(findUnreadNotifications?.length || 0) > 0 && (
                                        <span className='absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#5572fc] px-1.5 text-[10px] font-semibold text-white'>
                                            {findUnreadNotifications?.length || 0}
                                        </span>
                                    )}
                                </button>
                                {isNotificationOpen && (
                                    <div className='absolute right-0 top-10 z-20 rounded-md bg-white shadow-lg ring-1 ring-black/5'>
                                        <NotificationDropdown
                                            setLimit={setLimit}
                                            limit={limit}
                                            notices={notifications}
                                            getNotifications={getNotifications}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <select
                                value={selectedLangId || languageOptions?.[0]?._id || ''}
                                onChange={(value) => {
                                    const nextValue = value.target.value;
                                    setSelectedLangId(nextValue);
                                    const nextLanguage = languageOptions.find(
                                        (lang) => lang?._id === nextValue
                                    );
                                    setDefaultLang(nextLanguage?.name || selectedLangName);
                                    if (nextValue !== fallbackEnglishOption._id) {
                                        i18n.changeLanguage(nextValue);
                                        localStorage.setItem('lang', nextValue);
                                    }
                                }}
                                className='inline-flex items-center justify-center rounded border border-gray-200 bg-white px-3 py-2 text-sm capitalize text-black'
                            >
                                {languageOptions.map((lang) => (
                                    <option key={lang?._id} value={lang?._id}>
                                        {lang?.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='relative' ref={profileRef}>
                            <button
                                type='button'
                                className='admin-header-profile-trigger flex items-center gap-2'
                                onClick={() => setIsProfileOpen((open) => !open)}
                            >
                                {user && (
                                    <span className='hidden cursor-pointer sm:block'>
                                        {user?.name}
                                    </span>
                                )}
                                <BiUser className='admin-header-icon' size={20} />
                            </button>
                            {isProfileOpen && (
                                <div className='absolute right-0 top-10 z-20 min-w-52 rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5'>
                                    <button
                                        type='button'
                                        onClick={handleProfile}
                                        className='flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50'
                                    >
                                        <FiUser />
                                        <span>{i18n?.t('Profile')}</span>
                                    </button>
                                    <button
                                        type='button'
                                        onClick={handleChangePassword}
                                        className='flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50'
                                    >
                                        <FiLock />
                                        <span>{i18n?.t('Change Password')}</span>
                                    </button>
                                    <button
                                        type='button'
                                        onClick={handleLogout}
                                        className='flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50'
                                    >
                                        <FiLogOut />
                                        <span>{i18n?.t('Logout')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
        </header>
    );
};

export default Header;
