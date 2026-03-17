"use client";
import { useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import UserContext from "../contexts/user";
import { fetchSiteSettings, fetchUser } from "../helpers/backend";
import EnvContext from "../contexts/envContext";


const Providers = ({ children }) => {
    const [active, setActive] = useState('dashboard')
    const [user, setUser] = useState({});
    const [userLoaded, setUserLoaded] = useState(false);
    const [settings, setSettings] = useState();

    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {
        fetchSiteSettings().then(({ data, error }) => {
            if (!error) {
                setSettings(data);
            }
        }).catch(() => {
            setSettings(undefined);
        });
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
