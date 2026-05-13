"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchCartlist, fetchCurrency, fetchSiteSettings, fetchTheme } from "../helpers/backend";

const SiteContext = createContext({});

// All supported Google Fonts
const GOOGLE_FONTS = [
    { label: 'Poppins', value: 'Poppins' },
    { label: 'Inter', value: 'Inter' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Montserrat', value: 'Montserrat' },
    { label: 'Nunito', value: 'Nunito' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Open Sans', value: 'Open+Sans' },
    { label: 'Raleway', value: 'Raleway' },
    { label: 'Playfair Display', value: 'Playfair+Display' },
    { label: 'DM Sans', value: 'DM+Sans' },
    { label: 'Outfit', value: 'Outfit' },
    { label: 'Josefin Sans', value: 'Josefin+Sans' },
];

export { GOOGLE_FONTS };

export const applyFont = (fontValue) => {
    if (typeof document === 'undefined' || !fontValue) return;
    const fontName = fontValue.replace(/\+/g, ' ');
    const fontSlug = fontValue.replace(/ /g, '+');

    // Inject / update <link> for Google Font
    const linkId = 'gf-dynamic-font';
    let link = document.getElementById(linkId);
    if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${fontSlug}:wght@300;400;500;600;700;800&display=swap`;

    // Inject / update <style> to force font on body
    const styleId = 'gf-dynamic-style';
    let style = document.getElementById(styleId);
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
    }
    style.textContent = `body, body * { font-family: '${fontName}', sans-serif !important; }`;
};

const SiteProvider = ({ children }) => {
    const [currencies, setCurrencies] = useState([]);
    const [currency, setCurrency] = useState();
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [currencyRate, setCurrencyRate] = useState(1);
    const [countCartQuantity, setCountCartQuantity] = useState(0);
    const [cartItems, setCartItems] = useState();
    const [allThemes, setAllThemes] = useState([]);
    const [siteSettings, setSiteSettings] = useState({});
    const findDefaultTheme = allThemes?.find((theme) => theme?.isDefault === true);

    // Fetch settings & apply global font
    useEffect(() => {
        const run = () => {
            fetchSiteSettings().then(({ error, data }) => {
                if (!error && data) {
                    setSiteSettings(data);
                    if (data?.font_family) {
                        applyFont(data.font_family);
                    }
                }
            }).catch(() => {});
        };
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(run);
        } else {
            setTimeout(run, 1);
        }
    }, []);

    useEffect(() => {
        const run = () => {
            fetchCurrency().then(({ data }) => {
                const isDefault = data?.find(c => c.default === true);
                if (Array.isArray(data)) {
                    setCurrencies(data);
                    const savedCurrency = localStorage.getItem('currency') || isDefault?.code;
                    const defaultCurrency = data.find(c => c.code === savedCurrency);
                    if (defaultCurrency) {
                        setCurrency(defaultCurrency.code);
                        setCurrencySymbol(defaultCurrency.symbol);
                        setCurrencyRate(defaultCurrency.rate);
                        localStorage.setItem('currency', defaultCurrency.code);
                    }
                } else {
                    setCurrencies([]);
                }
            }).catch(() => setCurrencies([]));
        };
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(run);
        } else {
            setTimeout(run, 1);
        }
    }, []);

    useEffect(() => {
        const run = () => {
            fetchTheme().then(({ error, data }) => {
                if (!error) setAllThemes(Array.isArray(data) ? data : []);
            }).catch(() => setAllThemes([]));
        };
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(run);
        } else {
            setTimeout(run, 1);
        }
    }, []);

    const getCartItems = async (query = {}) => {
        const token = localStorage.getItem('token');
        if (!token) { setCartItems(undefined); return { data: undefined, error: false }; }
        const response = await fetchCartlist(query);
        if (response?.error === false) setCartItems(response.data);
        else setCartItems(undefined);
        return response;
    };

    useEffect(() => {
        const run = () => {
            if (!localStorage.getItem('token')) { setCartItems(undefined); return; }
            getCartItems().catch(() => setCartItems(undefined));
        };
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(run);
        } else {
            setTimeout(run, 1);
        }
    }, []);

    const changeCurrency = (code) => {
        const selectedCurrency = currencies.find(c => c.code === code);
        if (selectedCurrency) {
            setCurrency(selectedCurrency.code);
            setCurrencySymbol(selectedCurrency.symbol);
            setCurrencyRate(selectedCurrency.rate);
            localStorage.setItem('currency', selectedCurrency.code);
            Cookies.set('currency', selectedCurrency.code, { expires: 365 });
        }
    };

    const convertAmount = (amount) => (amount * currencyRate).toFixed(2);
    const getCurrencySymbol = (currency) => currencies.find(c => c.code === currency)?.symbol || '';
    const convertAmoutnWithCurrency = (amount, currency) => {
        const selected = currencies.find(c => c.code === currency);
        return (amount * selected?.rate).toFixed(2);
    };

    return (
        <SiteContext.Provider value={{
            currencies, currency, currencySymbol, currencyRate,
            changeCurrency, convertAmount, countCartQuantity,
            setCountCartQuantity, cartItems, getCartItems,
            getCurrencySymbol, convertAmoutnWithCurrency,
            findDefaultTheme, siteSettings, applyFont, GOOGLE_FONTS,
        }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useCurrency = () => useContext(SiteContext);
export default SiteProvider;
