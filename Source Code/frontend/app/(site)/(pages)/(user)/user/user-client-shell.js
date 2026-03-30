"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineLogout, HiOutlineMenu } from "react-icons/hi";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { usePathname, useRouter } from "next/navigation";
import { IoHome } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa";
import { useUser } from "../../../../contexts/user";
import { useI18n } from "../../../../providers/i18n";
import { notifySuccess } from "../../../../helpers/notify";

const UserClientShell = ({ children }) => {
  const { getUser, user, setActive } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const i18n = useI18n();

  useEffect(() => {
    let mounted = true;
    import("./menu")
      .then((mod) => {
        if (!mounted) {
          return;
        }
        const base = mod.buildBaseMenuItems();
        const extra = user?.activeSubscription
          ? mod.buildSubscriptionMenuItems(true)
          : mod.buildSubscriptionMenuItems(false);
        setMenuItems([...base, ...extra]);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [user?.activeSubscription]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    if (!user?._id || user?.role !== "user") {
      router.push("/signin");
    }
  }, [user?._id, user?.role, router]);

  useEffect(() => {
    const matchedItem = menuItems.find((item) => item.href === pathname);
    setCurrentName(matchedItem ? matchedItem.name : i18n?.t("User Dashboard"));
  }, [pathname, menuItems, i18n]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern thin banner to clear absolute site navigation and provide title */}
      <section className="w-full overflow-hidden bg-cover bg-center bg-[url(/basic.png)]">
        <div className="w-full h-full bg-black/80 pt-[110px] sm:pt-[130px] lg:pt-[160px] pb-[80px] px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-white capitalize font-montserrat tracking-tight">
              {i18n?.t(currentName)}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-[15px] text-white/90 font-medium font-poppins">
              <IoHome className="text-[#5572fc]" />
              <Link href="/" className="text-[#5572fc] hover:text-white transition-colors">
                {i18n?.t("Home")}
              </Link>
              <FaAngleRight className="text-white/60 text-sm" />
              <span className="capitalize text-white">{i18n?.t(currentName)}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative -mt-12 pb-12 z-10 w-full max-w-[1400px]">
        
        {/* Mobile Header & Menu Button */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-md border border-slate-200 mb-6">
          <h2 className="text-xl font-bold text-slate-800 capitalize font-montserrat tracking-tight">
            {i18n?.t("Dashboard Menu")}
          </h2>
          <button 
            onClick={toggleDrawer}
            className="p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <HiOutlineMenu className="text-2xl" />
          </button>
        </div>

        {/* Mobile Drawer */}
        {drawerOpen && (
          <div className="lg:hidden">
            <button type="button" onClick={toggleDrawer} className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity" />
            <div className="fixed left-0 top-0 z-[70] h-full w-[300px] overflow-y-auto bg-slate-50 shadow-2xl transition-transform border-r border-slate-200">
              <div className="flex justify-end items-center p-4 border-b border-slate-200/60">
                <button onClick={toggleDrawer} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-500 transition-colors">
                  <RxCross1 className="text-xl" />
                </button>
              </div>
              <div className="flex flex-col px-6 py-8 border-b border-slate-200/60 bg-white shadow-sm mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-shrink-0">
                    <Image
                      src={user?.image || "/defaultimg.jpg"}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-slate-800 tracking-tight leading-tight capitalize">{user?.name}</h2>
                    <p className="text-xs text-[#5572fc] font-bold mt-0.5 uppercase tracking-wider">{user?.role}</p>
                  </div>
                </div>
              </div>
              <nav className="px-4 pb-6">
                <ul className="space-y-1.5">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={`group flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                            isActive 
                              ? "bg-white text-[#5572fc] shadow-sm ring-1 ring-slate-200/80" 
                              : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                          }`}
                          onClick={() => setDrawerOpen(false)}
                        >
                          <span className={`text-[20px] mr-3.5 transition-colors ${isActive ? 'text-[#5572fc]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                            {item.icon}
                          </span>
                          <span className="text-[14.5px]">{i18n?.t(item.name)}</span>
                        </Link>
                      </li>
                    );
                  })}
                  <li className="pt-4 mt-4 border-t border-slate-200/60">
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        notifySuccess("Sign out successfully");
                        router.push("/signin");
                        getUser();
                        setActive("Sign Out");
                      }}
                      className="group flex items-center px-4 py-3.5 w-full rounded-xl transition-all duration-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:ring-1 hover:ring-red-100"
                    >
                      <span className="text-[20px] mr-3.5 text-slate-400 group-hover:text-red-500 transition-colors"><HiOutlineLogout /></span>
                      <span className="text-[14.5px] font-medium">{i18n?.t("Sign Out")}</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}

        {/* --- THE APP WINDOW --- */}
        <div className="flex flex-col lg:flex-row bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden min-h-[75vh]">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex lg:w-[300px] lg:shrink-0 flex-col bg-slate-50/70 border-r border-slate-200/80 relative">
            <div className="px-6 py-8 border-b border-slate-200/80 bg-white/50">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex-shrink-0 bg-white">
                  <Image
                    src={user?.image || "/defaultimg.jpg"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h2 className="font-bold text-[16px] text-slate-800 tracking-tight leading-tight truncate capitalize">
                    {user?.name}
                  </h2>
                  <p className="text-[11px] text-[#5572fc] font-bold mt-1 uppercase tracking-wider">{user?.role}</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <ul className="space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={`group flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                          isActive 
                            ? "bg-white text-[#5572fc] shadow-sm ring-1 ring-slate-200/80 relative overflow-hidden" 
                            : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                        }`}
                      >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5572fc]" />}
                        <span className={`text-[20px] mr-3.5 transition-colors ${isActive ? 'text-[#5572fc]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          {item.icon}
                        </span>
                        <span className="text-[14.5px]">{i18n?.t(item?.name)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            
            <div className="p-4 border-t border-slate-200/80 bg-white/50">
               <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    notifySuccess("Sign out successfully");
                    window.location.href = "/signin";
                    getUser();
                    setActive("Sign Out");
                  }}
                  className="group flex items-center px-4 py-3.5 w-full rounded-xl transition-all duration-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:ring-1 hover:ring-red-100 font-medium"
                >
                  <span className="text-[20px] mr-3.5 text-slate-400 group-hover:text-red-500 transition-colors"><HiOutlineLogout /></span>
                  <span className="text-[14.5px]">{i18n?.t("Sign Out")}</span>
                </button>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 bg-white p-6 md:p-10 lg:p-12 w-full overflow-x-auto relative min-h-full">
            <div className="hidden lg:block mb-8 pb-6 border-b border-slate-100">
              <h1 className="text-3xl font-extrabold text-slate-800 capitalize tracking-tight font-poppins">
                {i18n?.t(currentName)}
              </h1>
            </div>
            <div className="max-w-5xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserClientShell;
