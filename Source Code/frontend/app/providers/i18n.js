'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../helpers/hooks";
import { fetchLanguages, fetchPublicLanguages, fetchTranslations } from "../helpers/backend";


const I18nContext = createContext({
  languages: null,
  lang: null,
  setLang: () => {},
  t: (key) => key,
  changeLanguage: () => {},
  isRtl: 'ltr',
  langCode: null,
});

const findPreferredLanguage = (items = []) => {
  return items.find((language) => language?.code?.toLowerCase() === 'en')
    || items.find((language) => language?.name?.toLowerCase() === 'english')
    || items.find((language) => language?.default)
    || items[0];
};

export const I18nProvider = ({ children }) => {
  const [publicLanguages] = useFetch(fetchPublicLanguages);
  const [adminLanguages] = useFetch(fetchLanguages, { limit: 100 }, false);
  const [translations, setTranslations] = useState({});
  const [lang, setLang] = useState(null);
  const [langCode, setLangCode] = useState(null);
  const [isRtl, setIsRtl] = useState('ltr');
  const [isClient, setIsClient] = useState(false);
  const [languages, setLanguages] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const publicDocs = Array.isArray(publicLanguages?.docs)
      ? publicLanguages.docs
      : Array.isArray(publicLanguages)
        ? publicLanguages
        : [];
    const adminDocs = Array.isArray(adminLanguages?.docs)
      ? adminLanguages.docs
      : Array.isArray(adminLanguages)
        ? adminLanguages
        : [];

    if (publicDocs.length > 0) {
      setLanguages({
        ...(publicLanguages || {}),
        docs: publicDocs,
      });
      return;
    }

    if (adminDocs.length > 0) {
      setLanguages({
        ...(adminLanguages || {}),
        docs: adminDocs,
      });
      return;
    }

    setLanguages(null);
  }, [adminLanguages, publicLanguages]);

  useEffect(() => {
    if (isClient && localStorage.getItem('token')) {
      adminLanguages === undefined && fetchLanguages({ limit: 100 }).then(({ error, data }) => {
        if (!error && Array.isArray(data?.docs) && data.docs.length > 0) {
          setLanguages({
            ...data,
            docs: data.docs,
          });
        }
      }).catch(() => {});
    }
  }, [adminLanguages, isClient]);

  useEffect(() => {
    if (isClient) { 
      const storedLang = localStorage.getItem('lang');
      if (storedLang) {
        setLang(storedLang);
      } else if (languages?.docs?.length > 0) {
        const initialLang = findPreferredLanguage(languages.docs);
        if (initialLang) {
          setLang(initialLang._id);
          setIsRtl(initialLang.rtl ? 'rtl' : 'ltr');
          localStorage.setItem('lang', initialLang._id);
        }
      }
    }
  }, [isClient, languages]);

  useEffect(() => {
    if (lang) {
      fetchTranslations({ _id: lang }).then(({ error, data }) => {
        if (!error) {
          setTranslations(data?.translations || {});
        } else {
          console.error('Error fetching translations:', error);
        }
      });

      const selectedLang = languages?.docs?.find(l => l._id === lang) || findPreferredLanguage(languages?.docs || []);
      setLangCode(selectedLang?.code || null);
      setIsRtl(selectedLang?.rtl ? 'rtl' : 'ltr');
    }
  }, [lang, languages]);

  const changeLanguage = (value) => {
    if (isClient) {
      setLang(value);
      localStorage.setItem('lang', value);
    }
  };

  useEffect(() => {
    if (isClient) {
      document.documentElement.dir = isRtl;
    }
  }, [isRtl, isClient]);

  const t = (key) => translations[key] || key;

  return (
    <I18nContext.Provider value={{ languages, lang, setLang, t, changeLanguage, isRtl, langCode }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

export default I18nProvider;
