'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdCloseCircle } from 'react-icons/io';
import { MdKeyboardArrowDown, MdOutlineLanguage } from 'react-icons/md';
import { FiShoppingCart } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../common/button';
import { useUser } from '../../app/contexts/user';
import { useI18n } from '../../app/providers/i18n';
import { useCurrency } from '../../app/contexts/site';
import { useEnv } from '../../app/contexts/envContext';

const Navbar = () => {
  const { getUser, user, setActive } = useUser();
  const i18n = useI18n();
  const router = useRouter();
  const setting = useEnv();
  const { currencies, changeCurrency, currency, cartItems, findDefaultTheme } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState(currency);
  const [defaultLang, setDefaultLang] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const moreRef = useRef(null);
  const preferencesRef = useRef(null);
  const userMenuRef = useRef(null);

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
      if (selected) {
        setDefaultLang(selected.name);
      }
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
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
      if (preferencesRef.current && !preferencesRef.current.contains(event.target)) {
        setPreferencesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeMenus);
    return () => document.removeEventListener('mousedown', closeMenus);
  }, []);

  const selectedLanguageName =
    defaultLang ||
    i18n?.languages?.docs?.find((lang) => lang?.default)?.name ||
    i18n?.languages?.docs?.[0]?.name;

  const handleCurrencyChange = (selectedCurrency) => {
    changeCurrency(selectedCurrency);
    setActiveCurrency(selectedCurrency);
    setPreferencesOpen(false);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang?._id);
    localStorage.setItem('lang', lang?._id);
    setDefaultLang(lang?.name);
    setPreferencesOpen(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    await getUser();
    setActive('Sign Out');
    setUserMenuOpen(false);
    router.push('/signin');
  };

  const handleLinkClick = (path) => {
    setIsOpen(false);
    setMoreOpen(false);
    if (path) {
      router.push(path);
    }
  };

  const renderMoreDropdown = () => (
    <div className="absolute right-0 top-full z-[60] mt-3 w-56 rounded-md border border-white/20 bg-[#0f172a] p-2 shadow-2xl">
      {links.find((link) => link.dropdownItems)?.dropdownItems?.map(({ name, href }) => (
        <Link
          key={href}
          href={href}
          className="block rounded px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 hover:text-[#5572fc]"
          onClick={() => {
            setMoreOpen(false);
            setIsOpen(false);
          }}
        >
          {name}
        </Link>
      ))}
    </div>
  );

  const renderPreferencesPanel = () => (
    <div className="absolute right-0 top-full z-[60] mt-3 w-72 rounded-md border border-white/20 bg-white p-4 text-black shadow-2xl">
      <div>
        <p className="mb-3 text-sm font-semibold">{i18n?.t('Language')}</p>
        <div className="flex flex-col gap-2">
          {i18n?.languages?.docs?.map((lang) => (
            <button
              key={lang?._id}
              type="button"
              className={`rounded border px-4 py-2 text-left text-sm transition-colors ${
                selectedLanguageName === lang?.name
                  ? 'border-[#5572fc] bg-[#5572fc] text-white'
                  : 'border-[#D9D9D9] hover:border-[#5572fc] hover:bg-[#5572fc] hover:text-white'
              }`}
              onClick={() => handleLanguageChange(lang)}
            >
              {lang?.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="mb-3 text-sm font-semibold">{i18n?.t('Currency')}</p>
        <div className="flex flex-col gap-2">
          {currencies?.map((currencyItem) => (
            <button
              key={currencyItem?.code}
              type="button"
              className={`rounded border px-4 py-2 text-left text-sm transition-colors ${
                activeCurrency === currencyItem?.code
                  ? 'border-[#5572fc] bg-[#5572fc] text-white'
                  : 'border-[#D9D9D9] hover:border-[#5572fc] hover:bg-[#5572fc] hover:text-white'
              }`}
              onClick={() => handleCurrencyChange(currencyItem?.code)}
            >
              {currencyItem?.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserMenu = () => {
    const dashboardHref =
      user?.role === 'admin'
        ? '/admin'
        : user?.role === 'trainer'
          ? '/trainer'
          : user?.role === 'user'
            ? '/user'
            : '/signin';

    return (
      <div className="absolute right-0 top-full z-[60] mt-3 w-48 rounded-md border border-white/20 bg-[#0f172a] p-2 shadow-2xl">
        <Link
          href={dashboardHref}
          className="block rounded px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 hover:text-[#5572fc]"
          onClick={() => setUserMenuOpen(false)}
        >
          {i18n?.t('Dashboard')}
        </Link>
        {user?.role !== 'admin' && user?.role !== 'trainer' && (
          <Link
            href="/wishlist"
            className="block rounded px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 hover:text-[#5572fc]"
            onClick={() => setUserMenuOpen(false)}
          >
            {i18n?.t('Wishlist')}
          </Link>
        )}
        <button
          type="button"
          className="block w-full rounded px-4 py-2 text-left text-sm text-white transition-colors hover:bg-white/10 hover:text-[#5572fc]"
          onClick={handleLogout}
        >
          {i18n?.t('Sign Out')}
        </button>
      </div>
    );
  };

  const renderNavLinks = (mobile = false) =>
    links.map((link) => {
      if (link.dropdownItems) {
        if (mobile) {
          return (
            <div key={link.name} className="flex flex-col gap-2">
              <p className="font-noto text-[18px] font-medium text-white">{link.name}</p>
              <div className="ml-3 flex flex-col gap-2">
                {link.dropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-[#5572fc]"
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
              className="flex items-center space-x-1 text-white duration-500 hover:text-[#5572fc]"
              onClick={() => setMoreOpen((prev) => !prev)}
            >
              <span>{link.name}</span>
              <MdKeyboardArrowDown size={22} />
            </button>
            {moreOpen && renderMoreDropdown()}
          </div>
        );
      }

      return (
        <Link
          key={link.path}
          href={link.path || '#'}
          className="font-noto text-[18px] font-medium text-white duration-500 hover:text-[#5572fc]"
          onClick={() => handleLinkClick(link.path)}
        >
          {link.name}
        </Link>
      );
    });

  return (
    <nav
      className={`absolute z-50 w-full border-b border-white/20 ${findDefaultTheme?.name === 'home3' ? 'border-none bg-black text-white' : ''}`}
    >
      <div className="container flex items-center justify-between gap-4 py-4 lg:py-8">
        <Link href="/" className="flex items-center text-[#5572fc]">
          <img
            src={setting?.logo || '/logo.png'}
            alt="logoImage"
            className="h-[47px] w-auto max-w-[220px] object-contain"
            width={220}
            height={47}
            onError={(event) => {
              event.currentTarget.src = '/logo.png';
            }}
          />
        </Link>

        <div className="flex items-center gap-6 xl:gap-20">
          <div className="hidden items-center xl:space-x-10 space-x-6 text-[18px] font-medium text-white lg:flex">
            {renderNavLinks()}
          </div>

          <div className="hidden items-center gap-6 text-white lg:flex">
            <div className="relative" ref={preferencesRef}>
              <button
                type="button"
                aria-label={i18n?.t('Language preferences') || 'Language preferences'}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
                onClick={() => setPreferencesOpen((prev) => !prev)}
              >
                <MdOutlineLanguage size={24} className="cursor-pointer" />
              </button>
              {preferencesOpen && renderPreferencesPanel()}
            </div>

            {user?.role && user.role !== 'admin' && user.role !== 'trainer' && (
              <button
                type="button"
                aria-label={i18n?.t('Cart') || 'Cart'}
                className="relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
                onClick={() => router.push('/cart')}
              >
                <FiShoppingCart size={24} className="text-white" />
                <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-[#5572fc] px-1 text-center text-[10px] text-white">
                  {cartItems?.products?.length || 0}
                </span>
              </button>
            )}

            {user?.role === 'user' || user?.role === 'trainer' || user?.role === 'admin' ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  aria-label={i18n?.t('User menu') || 'User menu'}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                >
                  {user?.image ? (
                    <Image
                      className="h-[35px] w-[35px] cursor-pointer rounded-full md:h-[40px] md:w-[40px]"
                      src={user.image}
                      width={500}
                      height={400}
                      alt="profile"
                    />
                  ) : (
                    <div className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full border border-red-300 bg-gray-300 md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]">
                      {user?.name
                        ?.split(' ')
                        .map((word) => word.charAt(0))
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}
                </button>
                {userMenuOpen && renderUserMenu()}
              </div>
            ) : (
              <Link href="/signin" className="text-white">
                <Button className="!h-fit !py-2 text-white !bg-[#5572fc]">
                  {i18n?.t('Join Us')}
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center md:gap-6 gap-3 text-white lg:hidden">
            <div className="relative" ref={preferencesRef}>
              <button
                type="button"
                aria-label={i18n?.t('Language preferences') || 'Language preferences'}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
                onClick={() => setPreferencesOpen((prev) => !prev)}
              >
                <MdOutlineLanguage size={24} className="cursor-pointer" />
              </button>
              {preferencesOpen && renderPreferencesPanel()}
            </div>

            {user?.role && user.role !== 'admin' && user.role !== 'trainer' && (
              <button
                type="button"
                aria-label={i18n?.t('Cart') || 'Cart'}
                className="relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
                onClick={() => router.push('/cart')}
              >
                <FiShoppingCart size={24} className="text-white" />
                <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-[#5572fc] px-1 text-center text-[10px] text-white">
                  {cartItems?.products?.length || 0}
                </span>
              </button>
            )}

            {user?.role === 'user' || user?.role === 'trainer' || user?.role === 'admin' ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  aria-label={i18n?.t('User menu') || 'User menu'}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                >
                  {user?.image ? (
                    <Image
                      className="h-[30px] w-[30px] cursor-pointer rounded-full xl:h-[50px] xl:w-[50px]"
                      src={user.image}
                      width={500}
                      height={400}
                      alt="profile"
                    />
                  ) : (
                    <div className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full border border-red-300 bg-gray-300 md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]">
                      {user?.name
                        ?.split(' ')
                        .map((word) => word.charAt(0))
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}
                </button>
                {userMenuOpen && renderUserMenu()}
              </div>
            ) : (
              <Link href="/signin" className="text-white">
                <Button className="!h-fit !py-1 !px-2 text-white !bg-[#5572fc]">
                  {i18n?.t('Join Us')}
                </Button>
              </Link>
            )}

            <button
              type="button"
              aria-label={isOpen ? i18n?.t('Close menu') || 'Close menu' : i18n?.t('Open menu') || 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsOpen((prev) => !prev)}
              className="text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
            >
              {isOpen ? <IoMdCloseCircle size={25} /> : <GiHamburgerMenu size={25} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-nav"
          className="absolute left-0 top-[79px] flex w-full flex-col space-y-4 bg-textMain px-4 pb-5 pt-10 text-[18px] font-medium text-white lg:top-[110px] xl:hidden"
        >
          {renderNavLinks(true)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
