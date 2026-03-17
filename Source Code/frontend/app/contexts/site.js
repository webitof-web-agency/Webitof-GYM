"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchCartlist, fetchCurrency, fetchTheme } from "../helpers/backend";

const SiteContext = createContext({});

const SiteProvider = ({ children }) => {
    const [currencies, setCurrencies] = useState([]);
    const [currency, setCurrency] = useState();
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [currencyRate, setCurrencyRate] = useState(1);
    const [countCartQuantity, setCountCartQuantity] = useState(0);
    const [cartItems, setCartItems] = useState();
    const [allThemes, setAllThemes] = useState([]);
    const findDefaultTheme = allThemes?.find((theme) => theme?.isDefault === true);

    useEffect(() => {
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
                console.error("Unexpected data format:", data);
                setCurrencies([]);
            }
        }).catch(error => {
            console.error("Error fetching currencies:", error);
            setCurrencies([]);
        });
    }, []);

    useEffect(() => {
        fetchTheme().then(({ error, data }) => {
            if (!error) {
                setAllThemes(Array.isArray(data) ? data : []);
            }
        }).catch(() => {
            setAllThemes([]);
        });
    }, []);

    const getCartItems = async (query = {}) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setCartItems(undefined);
            return { data: undefined, error: false };
        }

        const response = await fetchCartlist(query);
        if (response?.error === false) {
            setCartItems(response.data);
        } else {
            setCartItems(undefined);
        }
        return response;
    };

    useEffect(() => {
        getCartItems().catch(() => {
            setCartItems(undefined);
        });
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

    const convertAmount = (amount) => {
        return (amount * currencyRate).toFixed(2);
    };
    //  i will send currency like USD/BDT then give me the symbol
    const getCurrencySymbol = (currency) => {
        const selectedCurrency = currencies.find(c => c.code === currency);
        return selectedCurrency ? selectedCurrency.symbol : '';
    }
    const convertAmoutnWithCurrency = (amount, currency) => {
        const selectedCurrency = currencies.find(c => c.code === currency);
        return (amount * selectedCurrency?.rate).toFixed(2);
    }

    const siteSettingsData = {
        currencies,
        currency,
        currencySymbol,
        currencyRate,
        changeCurrency,
        convertAmount,
        countCartQuantity,
        setCountCartQuantity,
        cartItems,
        getCartItems,
        getCurrencySymbol,
        convertAmoutnWithCurrency,
        findDefaultTheme
    };

    return (
        <SiteContext.Provider value={siteSettingsData}>
            {children}
        </SiteContext.Provider>
    );
};

export const useCurrency = () => useContext(SiteContext);
export default SiteProvider;
