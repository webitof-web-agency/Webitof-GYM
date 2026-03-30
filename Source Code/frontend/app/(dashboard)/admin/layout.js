"use client";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../contexts/user";
import { InfinitySpin } from "react-loader-spinner";

const Sidebar = dynamic(() => import("../components/layout/sideBar"));
const Header = dynamic(() => import("../components/layout/header"));

const Layout = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, userLoaded } = useUser();
    const push = router.push;
    const [menuBuilder, setMenuBuilder] = useState(null);

    useEffect(() => {
        let mounted = true;
        import("./menu")
            .then((mod) => {
                if (mounted) {
                    setMenuBuilder(() => mod.buildMenu);
                }
            })
            .catch(() => {});
        return () => {
            mounted = false;
        };
    }, []);

    const menu = useMemo(() => {
        if (!menuBuilder) {
            return [];
        }
        return menuBuilder(user, push, pathname);
    }, [menuBuilder, user, pathname, push]);

    useEffect(() => {
        if (!userLoaded) {
            return;
        }

        if (user?.role !== "admin" && user?.role !== "employee") {
            router.replace("/signin");
        }
    }, [router, user?.role, userLoaded]);

    if (!userLoaded || !menuBuilder || (user?.role !== "admin" && user?.role !== "employee")) {
        return (
            <div className="flex justify-center items-center h-screen ">
                <InfinitySpin width='140' color='#5572fc' />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar title="Gymstick" menu={menu} />
            <Header title="Gymstick" />
            <div className="content">
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default Layout;
