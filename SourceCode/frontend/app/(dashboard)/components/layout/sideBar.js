"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "../../../providers/i18n";
const Sidebar = ({ title, menu }) => {
    const i18n = useI18n()

    useEffect(() => {
        const items = document.querySelectorAll('.menu > li');
        items.forEach(item => {
            let link = item.querySelector('a');
            let submenu = item.querySelector('.submenu');
            if (!!link && !!submenu) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    link.classList.toggle('active');
                    submenu.classList.toggle('active');
                    submenu.style.maxHeight = submenu.classList.contains('active') ? submenu.scrollHeight + "px" : 0;
                })
            }
        })
    }, [])

    const pathName = usePathname()
    useEffect(() => {
        const items = document.querySelectorAll('.menu a');
        let activeItem
        items.forEach(item => {
            item.classList.remove('active')
            let itemParent = item.parentElement.parentElement
            if (itemParent.classList.contains('submenu')) {
                itemParent.classList.remove('active')
                itemParent.style.maxHeight = 0
                itemParent.parentElement.firstChild?.classList?.remove('active')
            }
            if (item.href === window.location.href) {
                activeItem = item
            }
        })
        if (activeItem) {
            activeItem.classList.add('active')
            let itemParent = activeItem.parentElement.parentElement
            if (itemParent.classList.contains('submenu')) {
                itemParent.classList.add('active')
                itemParent.style.maxHeight = itemParent.scrollHeight + "px"
                itemParent.parentElement.firstChild?.classList?.add('active')
            }
        }
    }, [pathName])


    return (
        <>
            <div
                onClick={() => {
                    window.document.querySelector('.sidebar').classList.toggle('open')
                    window.document.querySelector('.sidebar-overlay').classList.toggle('open')
                }}
                className="sidebar-overlay !z-40" />
            <aside className="sidebar !z-40 ">
                <div className="title">
                    <Link href="/admin" className="flex items-center justify-center w-full h-full px-4">
                        <Image
                            // src="/logonight.png"
                            src="/GYM-admin.png"
                            alt={title || "webitofgym"}
                            width={200}
                            height={60}
                            className="h-36 mt-8 w-auto object-contain text-center"
                            priority
                        />
                    </Link>
                </div>
                <ul className="menu">
                    {menu?.map((item, index) => (
                        <li key={index}>
                            {item.menu && <div className="nav-menu font-bold text-sm">{i18n?.t(item.menu)}</div>}
                            {item.label && !item.child && (
                                <Link href={item.href || '#!'} className="nav-link"
                                    onClick={() => {
                                        window.document.querySelector('.sidebar').classList.toggle('open')
                                        window.document.querySelector('.sidebar-overlay').classList.toggle('open')
                                    }}
                                >
                                    {item.icon && <span className="icon">{item.icon}</span>}
                                    <span className="label">{i18n?.t(item.label)}</span>
                                </Link>
                            )}
                            {item.child && (
                                <>
                                    <a role="button" className="nav-link-sub has-arrow">
                                        {item.icon && <span className="icon">{item.icon}</span>}
                                        <span className="label">{i18n?.t(item.label)}</span>
                                    </a>
                                    <ul className="submenu">
                                        {item.child.map((item, index) => (
                                            <li key={index}>
                                                <Link href={item.href || '#!'} className="nav-link"
                                                    onClick={() => {
                                                        window.document.querySelector('.sidebar').classList.toggle('open')
                                                        window.document.querySelector('.sidebar-overlay').classList.toggle('open')
                                                    }}
                                                >
                                                    {item.icon && <span className="icon">{item.icon}</span>}
                                                    <span>
                                                        {i18n?.t(item.label)}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </aside>
        </>

    )
}

export default Sidebar
