"use client";
import { useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import UserContext from "../contexts/user";
import { fetchSiteSettings, fetchUser } from "../helpers/backend";
import { clearAuthStorage } from "../helpers/auth";
import EnvContext from "../contexts/envContext";


const Providers = ({ children }) => {
    const [active, setActive] = useState('dashboard')
    const [user, setUser] = useState({});
    const [userLoaded, setUserLoaded] = useState(false);
    const [settings, setSettings] = useState();

    useEffect(() => {
        const run = () => getUser();
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(run);
        } else {
            setTimeout(run, 1);
        }
    }, []);

    useEffect(() => {
        const run = () => {
            fetchSiteSettings().then(({ data, error }) => {
                if (!error) {
                    setSettings(data);
                }
            }).catch(() => {
                setSettings(undefined);
            });
        };
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(run);
        } else {
            setTimeout(run, 1);
        }
    }, []);

    const getUser = async () => {
        if (!localStorage.getItem('token')) {
            setUser({});
            setUserLoaded(true);
            return;
        }
        const { data, error } = await fetchUser();
        if (error === false) {
            setUser(data);
        } else {
            clearAuthStorage();
            setUser({});
        }
        setUserLoaded(true);
    };


    return (
        <EnvContext.Provider value={settings}>
            <UserContext.Provider value={{ user, setUser, getUser, userLoaded, active, setActive }}>
                <SkeletonTheme color="#0F172A" highlightColor="#444">
                    {children}
                </SkeletonTheme>
            </UserContext.Provider>
        </EnvContext.Provider>
    )
}

export default Providers;
