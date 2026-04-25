"use client"
import { useEffect, useState } from "react";
import { Form } from "antd";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../../providers/i18n";
import { useFetch } from "../../../../../helpers/hooks";
import { allProductCategory, singleProductAdmin } from "../../../../../helpers/backend";
import ProductForm from "../../add/productForm";
import { FiGlobe } from "react-icons/fi";

const fallbackLanguage = { code: 'en', name: 'English' };

const page = ({ params }) => {
    const [form] = Form.useForm();
    const router = useRouter()
    const i18n = useI18n()
    let { languages, langCode } = useI18n();
    const [data, getData] = useFetch(singleProductAdmin, {}, false);
    const [category, getCategory] = useFetch(allProductCategory);
    const [selectedLang, setSelectedLang] = useState();
    const [isVarient, setIsVarient] = useState(false);
    const [formData, setFromData] = useState([])
    
    const availableLanguages = Array.isArray(languages?.docs) && languages.docs.length > 0
        ? languages.docs
        : [fallbackLanguage];

    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en')
    }, [availableLanguages, langCode])

    useEffect(() => {
        getData({ _id: params?.id })
    }, [params?.id, getData])

    useEffect(() => {
        getCategory();
    }, [getCategory])

    useEffect(() => {
        if (!data?.product) return;
        
        form.setFieldsValue({
            name: data?.product?.name,
            short_description: data?.product?.short_description,
            category: data?.product?.category?._id,
            price: data?.product?.price,
            quantity: data?.product?.quantity,
            description: data?.product?.description,
            thumbnail_image: data?.product?.thumbnail_image?.length > 0
                ? [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data?.product?.thumbnail_image,
                    },
                ]
                : [],
            images: data?.product?.images?.map((img, index) => ({
                uid: `-${index + 1}`,
                name: img,
                status: 'done',
                url: img,
            })),
            variants: data?.product?.variants?.map(variant => ({
                name: variant.name,
                price: variant.price,
                in_stock: variant.in_stock,
            })),
            _id: data?.product?._id
        })
        if (data?.product?.variants?.length > 0) {
            setIsVarient(true)
        }
    }, [data, form])

    return (
        <div className="max-w-[1200px] mx-auto pb-10 animate-fade-in relative px-4 sm:px-0">
            <div className="flex justify-between items-center mb-6 pt-2">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="flex flex-shrink-0 items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-lg shadow-sm text-gray-500 hover:text-[#F97316] hover:border-[#F97316] transition-all"
                    >
                        <FaArrowLeft size={14} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-none relative top-[1px]">{i18n?.t('Edit Product Structure')}</h1>
                </div>

                {availableLanguages.length > 1 && (
                    <div className='flex items-center justify-start gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100 overflow-x-auto'>
                        <div className="pl-2 pr-1 text-slate-400"><FiGlobe size={14} /></div>
                        {availableLanguages.map((l, index) => (
                            <button
                                type="button"
                                onClick={() => setSelectedLang(l.code)}
                                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                                    l.code === selectedLang
                                        ? 'bg-slate-50 text-[#F97316] shadow-inner border border-slate-200'
                                        : 'text-gray-500 hover:bg-slate-50 hover:text-gray-700'
                                }`}
                                key={index}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ProductForm 
                isVarient={isVarient} 
                setIsVarient={setIsVarient} 
                category={category} 
                data={data} 
                languages={{ ...(languages || {}), docs: availableLanguages }} 
                langCode={langCode} 
                selectedLang={selectedLang} 
                setSelectedLang={setSelectedLang} 
                form={form} 
                formData={formData} 
                setFromData={setFromData} 
                i18n={i18n} 
                router={router} 
                productId={params.id} 
            />
        </div>
    );
};

export default page;
