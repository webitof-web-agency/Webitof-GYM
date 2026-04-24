'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MdKeyboardArrowDown, MdOutlineLanguage } from 'react-icons/md';
import { FiShoppingCart, FiX, FiMenu, FiChevronDown, FiLogOut, FiUser, FiHeart, FiGlobe, FiCheck } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '../../app/contexts/user';
import { useI18n } from '../../app/providers/i18n';
import { useCurrency } from '../../app/contexts/site';
import { useEnv } from '../../app/contexts/envContext';
import Cookies from 'js-cookie';
import { notifySuccess } from '../../app/helpers/notify';
import dynamic from 'next/dynamic';

const CouponBar = dynamic(() => import('./couponBar'), { ssr: false });

const Navbar = () => {
  const { getUser, user, setActive, setUser } = useUser();
  const i18n = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const setting = useEnv();
  const { currencies, changeCurrency, currency, cartItems, findDefaultTheme } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState(currency);
  const [defaultLang, setDefaultLang] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hidePromoBar = pathname === "/signin" || pathname === "/signup" || pathname === "/setting";

  const moreRef = useRef(null);
  const preferencesRefDesktop = useRef(null);
  const preferencesRefMobile = useRef(null);
  const userMenuRefDesktop = useRef(null);
  const userMenuRefMobile = useRef(null);

  const isHome3 = findDefaultTheme?.name === 'home3';

  // Scroll listener for sticky glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = useMemo(
    () => [
      { name: i18n?.t('Home'), path: '/' },
      { name: i18n?.t('About'), path: '/about' },
      { name: i18n?.t('Services'), path: '/services' },
      { name: i18n?.t('Shop'), path: '/shop' },
      {
        name: i18n?.t('More'),
        dropdownItems: [
          { name: i18n?.t('Pricing Plan'), href: '/pricing-plan' },
          { name: i18n?.t('Trainers'), href: '/trainers' },
          { name: i18n?.t('Fitness Calculator'), href: '/bmi-calculator' },
          { name: i18n?.t('Image Gallery'), href: '/gallary' },
          { name: i18n?.t('Event'), href: '/event' },
          { name: i18n?.t('Blogs'), href: '/blog' },
          { name: i18n?.t('Class Schedule'), href: '/classSchedule' },
          { name: i18n?.t('Group'), href: '/group' },
        ],
      },
    ],
    [i18n]
  );

  useEffect(() => {
    const langId = localStorage.getItem('lang');
    if (langId) {
      const selected = i18n?.languages?.docs?.find((lang) => lang?._id === langId);
      if (selected) setDefaultLang(selected.name);
    } else if (i18n?.languages?.docs?.length > 0) {
      const selected = i18n.languages.docs.find((lang) => lang?.default) || i18n.languages.docs[0];
      setDefaultLang(selected?.name || null);
    }
  }, [i18n?.languages?.docs]);

  useEffect(() => {
    const storedCurrency = localStorage.getItem('currency');
    if (storedCurrency) {
      changeCurrency(storedCurrency);
      setActiveCurrency(storedCurrency);
    } else if (currencies?.[0]?.code) {
      changeCurrency(currencies[0].code);
      setActiveCurrency(currencies[0].code);
    }
  }, [changeCurrency, currencies]);

  useEffect(() => {
    const closeMenus = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) setMoreOpen(false);
      if (!preferencesRefDesktop.current?.contains(event.target) && !preferencesRefMobile.current?.contains(event.target))
        setPreferencesOpen(false);
      if (!userMenuRefDesktop.current?.contains(event.target) && !userMenuRefMobile.current?.contains(event.target))
        setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenus);
    return () => document.removeEventListener('mousedown', closeMenus);
  }, []);

  const selectedLanguageName =
    defaultLang ||
    i18n?.languages?.docs?.find((lang) => lang?.default)?.name ||
    i18n?.languages?.docs?.[0]?.name;

  const handleCurrencyChange = (code) => { changeCurrency(code); setActiveCurrency(code); setPreferencesOpen(false); };
  const handleLanguageChange = (lang) => { i18n.changeLanguage(lang?._id); localStorage.setItem('lang', lang?._id); setDefaultLang(lang?.name); setPreferencesOpen(false); };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      Cookies.remove('token');
      Cookies.remove('auth');
      Cookies.remove('access_token');
    } catch (error) { console.log(error); }
    setUser({});
    notifySuccess('Sign out successfully');
    await getUser();
    setActive('Sign Out');
    setUserMenuOpen(false);
    router.replace('/signin');
  };

  const handleLinkClick = (path) => { setIsOpen(false); setMoreOpen(false); if (path) router.push(path); };

  const isActive = (path) => pathname === path;

  // ── More Dropdown ─────────────────────────────────────────────────────
  const renderMoreDropdown = () => (
    <div className="absolute right-0 top-full z-[60] mt-3 w-56 overflow-hidden rounded-xl border border-slate-700/60 bg-[#0f172a] shadow-2xl">
      <div className="p-1.5">
        {links.find((l) => l.dropdownItems)?.dropdownItems?.map(({ name, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-white/80 transition-all hover:bg-white/8 hover:text-[#5572fc]"
            onClick={() => { setMoreOpen(false); setIsOpen(false); }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#5572fc]/50" />
            {name}
          </Link>
        ))}
      </div>
    </div>
  );

  // ── Preferences Panel ─────────────────────────────────────────────────
  const renderPreferencesPanel = () => (
    <div className="absolute right-0 top-full z-[60] mt-3 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
      <div className="border-b border-slate-100 px-4 py-3 flex items-center gap-2">
        <FiGlobe size={15} className="text-[#5572fc]" />
        <span className="text-[12px] font-extrabold text-gray-700 uppercase tracking-widest">Preferences</span>
      </div>
      <div className="p-4 space-y-4">
        {/* Language */}
        <div>
          <p className="mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{i18n?.t('Language')}</p>
          <div className="flex flex-wrap gap-2">
            {i18n?.languages?.docs?.map((lang) => (
              <button
                key={lang?._id}
                type="button"
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-all ${
                  selectedLanguageName === lang?.name
                    ? 'border-[#5572fc] bg-[#5572fc] text-white shadow-sm shadow-[#5572fc]/30'
                    : 'border-slate-200 text-gray-600 hover:border-[#5572fc] hover:text-[#5572fc]'
                }`}
                onClick={() => handleLanguageChange(lang)}
              >
                {selectedLanguageName === lang?.name && <FiCheck size={10} strokeWidth={3} />}
                {lang?.name}
              </button>
            ))}
          </div>
        </div>
        {/* Currency */}
        <div>
          <p className="mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{i18n?.t('Currency')}</p>
          <div className="flex flex-wrap gap-2">
            {currencies?.map((c) => (
              <button
                key={c?.code}
                type="button"
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-all ${
                  activeCurrency === c?.code
                    ? 'border-[#5572fc] bg-[#5572fc] text-white shadow-sm shadow-[#5572fc]/30'
                    : 'border-slate-200 text-gray-600 hover:border-[#5572fc] hover:text-[#5572fc]'
                }`}
                onClick={() => handleCurrencyChange(c?.code)}
              >
                {activeCurrency === c?.code && <FiCheck size={10} strokeWidth={3} />}
                {c?.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── User Menu ─────────────────────────────────────────────────────────
  const renderUserMenu = () => {
    const dashboardHref = user?.role === 'admin' ? '/admin' : user?.role === 'trainer' ? '/trainer' : user?.role === 'user' ? '/user' : '/signin';
    const initials = user?.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

    return (
      <div className="absolute right-0 top-full z-[60] mt-3 w-52 overflow-hidden rounded-xl border border-slate-700/60 bg-[#0f172a] shadow-2xl">
        {/* User info header */}
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-[13px] font-bold text-white truncate">{user?.name}</p>
          <p className="text-[10px] text-[#5572fc] font-bold uppercase tracking-widest capitalize mt-0.5">{user?.role}</p>
        </div>
        <div className="p-1.5">
          <Link
            href={dashboardHref}
            className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-white/80 transition-all hover:bg-white/8 hover:text-[#5572fc]"
            onClick={() => setUserMenuOpen(false)}
          >
            <FiUser size={14} /> {i18n?.t('Dashboard')}
          </Link>
          {user?.role !== 'admin' && user?.role !== 'trainer' && (
            <Link
              href="/wishlist"
              className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-white/80 transition-all hover:bg-white/8 hover:text-[#5572fc]"
              onClick={() => setUserMenuOpen(false)}
            >
              <FiHeart size={14} /> {i18n?.t('Wishlist')}
            </Link>
          )}
        </div>
        <div className="border-t border-white/10 p-1.5">
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-[13px] font-medium text-red-400 transition-all hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <FiLogOut size={14} /> {i18n?.t('Sign Out')}
          </button>
        </div>
      </div>
    );
  };

  // ── User Avatar Button ────────────────────────────────────────────────
  const UserAvatar = ({ size = 'md' }) => {
    const initials = user?.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    const dims = size === 'sm' ? 'w-8 h-8 text-[11px]' : 'w-10 h-10 text-[12px]';
    return user?.image ? (
      <Image className={`${dims} cursor-pointer rounded-xl object-cover border-2 border-white/20`} src={user.image} width={40} height={40} alt="profile" />
    ) : (
      <div className={`${dims} cursor-pointer flex items-center justify-center rounded-xl bg-gradient-to-br from-[#5572fc] to-[#7c93ff] font-black text-white border-2 border-white/20`}>
        {initials}
      </div>
    );
  };

  // ── Nav Links ─────────────────────────────────────────────────────────
  const renderNavLinks = (mobile = false) =>
    links.map((link) => {
      if (link.dropdownItems) {
        if (mobile) {
          return (
            <div key={link.name} className="space-y-2">
              <p className="text-[14px] font-bold text-white/50 uppercase tracking-widest">{link.name}</p>
              <div className="grid grid-cols-2 gap-1">
                {link.dropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/8 hover:text-[#5572fc]"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div key={link.name} className="relative" ref={moreRef}>
            <button
              type="button"
              className={`flex items-center gap-1 text-[14px] font-semibold transition-colors ${moreOpen ? 'text-[#5572fc]' : 'text-white/85 hover:text-white'}`}
              onClick={() => setMoreOpen((prev) => !prev)}
            >
              {link.name}
              <FiChevronDown size={15} className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreOpen && renderMoreDropdown()}
          </div>
        );
      }
      return (
        <Link
          key={link.path}
          href={link.path || '#'}
          className={`relative text-[14px] font-semibold transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#5572fc] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ${
            isActive(link.path) ? 'text-white after:scale-x-100' : 'text-white/85 hover:text-white'
          }`}
          onClick={() => handleLinkClick(link.path)}
        >
          {link.name}
        </Link>
      );
    });

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/80 bg-black/40 backdrop-blur-md shadow-md py-0'
          : 'bg-transparent border-b border-white/10'
      }`}
    >
      {!hidePromoBar && <CouponBar />}
      <div className="container flex items-center justify-between gap-4 py-4 lg:py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src={setting?.logo || '/logo.png'}
            alt="Logo"
            className="h-[42px] w-auto max-w-[200px] object-contain"
            onError={(e) => { e.currentTarget.src = '/logo.png'; }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {renderNavLinks()}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Language/Currency */}
          <div className="relative" ref={preferencesRefDesktop}>
            <button
              type="button"
              aria-label="Preferences"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
              onClick={() => setPreferencesOpen((prev) => !prev)}
            >
              <FiGlobe size={16} />
            </button>
            {preferencesOpen && renderPreferencesPanel()}
          </div>

          {/* Cart */}
          {user?.role && user.role !== 'admin' && user.role !== 'trainer' && (
            <button
              type="button"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
              onClick={() => router.push('/cart')}
            >
              <FiShoppingCart size={16} />
              {cartItems?.products?.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#5572fc] px-1 text-[9px] font-black text-white shadow-sm">
                  {cartItems.products.length}
                </span>
              )}
            </button>
          )}

          {/* User */}
          {user?.role ? (
            <div className="relative" ref={userMenuRefDesktop}>
              <button
                type="button"
                aria-label="User menu"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((prev) => !prev)}
              >
                <UserAvatar />
              </button>
              {userMenuOpen && renderUserMenu()}
            </div>
          ) : (
            <Link
              href="/signin"
              className="flex items-center gap-2 rounded-xl bg-[#5572fc] px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-[#5572fc]/25 transition-all hover:bg-[#4461eb] hover:shadow-xl hover:shadow-[#5572fc]/35 hover:-translate-y-0.5"
            >
              {i18n?.t('Join Us')}
            </Link>
          )}
        </div>

        {/* Mobile Right Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="relative" ref={preferencesRefMobile}>
            <button
              type="button"
              aria-label="Preferences"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
              onClick={() => setPreferencesOpen((prev) => !prev)}
            >
              <FiGlobe size={16} />
            </button>
            {preferencesOpen && renderPreferencesPanel()}
          </div>

          {user?.role && user.role !== 'admin' && user.role !== 'trainer' && (
            <button
              type="button"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70"
              onClick={() => router.push('/cart')}
            >
              <FiShoppingCart size={16} />
              {cartItems?.products?.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#5572fc] px-0.5 text-[8px] font-black text-white">
                  {cartItems.products.length}
                </span>
              )}
            </button>
          )}

          {user?.role ? (
            <div className="relative" ref={userMenuRefMobile}>
              <button type="button" aria-label="User menu" aria-expanded={userMenuOpen} onClick={() => setUserMenuOpen((prev) => !prev)}>
                <UserAvatar size="sm" />
              </button>
              {userMenuOpen && renderUserMenu()}
            </div>
          ) : (
            <Link href="/signin" className="rounded-lg bg-[#5572fc] px-3 py-2 text-[12px] font-bold text-white">
              {i18n?.t('Join Us')}
            </Link>
          )}

          {/* Hamburger */}
          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10"
          >
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isOpen && (
        <div
          id="mobile-nav"
          className="border-t border-slate-700/60 bg-[#0f172a] px-5 pb-6 pt-5 space-y-5 xl:hidden"
        >
          {/* Main links */}
          {links.filter(l => !l.dropdownItems).map((link) => (
            <Link
              key={link.path}
              href={link.path || '#'}
              className={`block text-[15px] font-bold transition-colors ${isActive(link.path) ? 'text-[#5572fc]' : 'text-white/85 hover:text-white'}`}
              onClick={() => handleLinkClick(link.path)}
            >
              {link.name}
            </Link>
          ))}
          {/* More dropdown items in 2-col grid */}
          {renderNavLinks(true).filter((el, i) => links[i]?.dropdownItems)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
