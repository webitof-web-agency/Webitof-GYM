'use client';
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import Footer from "../../../components/layout/footer";
import Navbar from "../../../components/layout/header";
import axios from "axios";

const Scroll = dynamic(() => import("../../../components/common/scroll-bar"), { ssr: false });
const CouponBar = dynamic(() => import("../../../components/layout/couponBar"), { ssr: false });

const Layout = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const hidePromoBar = pathname === '/signin' || pathname === '/signup' || pathname === '/setting';

    useEffect(() => {
      const checkEnvFile = async () => {
        try {
          const { data } = await axios.get(process.env.backend_url);
          if (data?.status === true && data?.env === false) {
            return router.push('/setting/')
          }
        } catch (error) {
          // Keep rendering the site even if the backend is temporarily unavailable.
        }
      }
      checkEnvFile()
    }, [router])

    return (
        <>
        <>
          {!hidePromoBar && <CouponBar/>}
          <Navbar />
          {children}
          <Footer />
          <Scroll/>
        </>
        </>
    );
};

export default Layout;
