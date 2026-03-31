"use client";

import { Form, message, Radio, Switch } from "antd";
import { useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";

import FormInput, { HiddenInput } from "../../../../../components/form/input";
import Button from "../../../../../components/common/button";
import FormSelect from "../../../../../components/form/select";
import { postMultipleImage, postProduct, postSingleImage, updateProduct } from "../../../../helpers/backend";
import JodiEditor from "../../../components/form/jodiEditor";
import MultipleImageInput from "../../../../../components/form/multiImage";
import { noSelected } from "../../../../helpers/utils";
import { FiLayers, FiImage, FiFileText, FiTag, FiTrash2, FiPlus } from "react-icons/fi";

const ProductForm = ({ isVarient, setIsVarient, category, languages, selectedLang, setSelectedLang, formData, setFromData, i18n, router, form }) => {
    const [loading, setLoading] = useState(false);
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs
            : [{ code: 'en', name: 'English' }];

    const handleFinish = async (values) => {
        setLoading(true);
        const imgArray = [];
        const preImg = [];
        try {
            if (values?.images?.length > 0) {
                for (let i = 0; i < values?.images.length; i++) {
                    if (values?.images[i]?.url) {
                        preImg.push(values?.images[i]?.url);
                    } else {
                        imgArray.push(values?.images[i].originFileObj);
                    }
                }
            }
            if (imgArray.length > 0) {
                const image = { images: imgArray, image_name: "product" };
                const { data } = await postMultipleImage(image);
                data?.map((item) => preImg.push(item));
                values.images = preImg;
            }
            if (values?.thumbnail_image?.length > 0) {
                if (values?.thumbnail_image?.[0]?.originFileObj) {
                    let image = { image: values?.thumbnail_image?.[0]?.originFileObj, image_name: "thumbnail_image" };
                    const { data } = await postSingleImage(image);
                    values.thumbnail_image = data;
                }
            }
            if (values?.images?.length > 0) {
                values.images = values?.images?.map(item => item?.url ? item?.url : item)
            }
            let payload = {
                _id: values?._id || undefined,
                name: values?.name,
                short_description: values?.short_description,
                description: values?.description,
                images: values?.images,
                thumbnail_image: values?.thumbnail_image?.[0]?.url ? values?.thumbnail_image[0]?.url : values?.thumbnail_image,
                category: values?.category,
                price: parseFloat(values?.price),
                quantity: parseInt(values?.quantity),
                variants: isVarient
                    ? values?.variants?.map(variant => ({
                        ...variant,
                        price: parseFloat(variant.price),
                    }))
                    : [],
                is_active: true,
            };
            if (values?._id) {
                await updateProduct(payload)
                message.success("Product updated successfully!");
                form.resetFields();
                router.push("/admin/product");
            } else {
                await postProduct(payload);
                message.success("Product added successfully!");
                form.resetFields();
                router.push("/admin/product");
            }
        } catch (error) {
            console.error("Error in handleFinish:", error);
            message.error("Something went wrong while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-slate-100/80">
                <BiLoader size={50} className="animate-spin" color={"#5572fc"} />
            </div>
        );
    }

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-2 space-y-4">
            {availableLanguages.map((l, index) => (
                <div key={index} style={{ display: l.code === selectedLang ? "block" : "none" }} className="space-y-4">
                    <HiddenInput name={'_id'} />
                    
                    {/* Top Row: Identity + Operational Settings side by side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

                    {/* Basic Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-6 h-full">
                         <div className="flex items-center gap-2 pb-4 border-b border-gray-100/80 mb-5">
                             <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center font-bold">
                                 <FiFileText size={16} />
                             </div>
                             <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-none">{i18n?.t("Core Product Identity")}</h3>
                         </div>
                         <div className="space-y-4">
                             <FormInput
                                 name={['name', l.code]}
                                 label={`${i18n?.t('Product Name')} (${l.code.toUpperCase()})`}
                                 required
                                 onBlur={(e) => {
                                     const uniqueData = formData?.filter(data => data?.lang !== selectedLang);
                                     setFromData([...uniqueData, { lang: selectedLang, value: e.target.value }]);
                                 }}
                                 placeholder={`e.g. Premium Protein Powder`}
                             />
                             <FormInput
                                 name={['short_description', l.code]}
                                 label={`${i18n?.t('Short Description Outline')} (${l.code.toUpperCase()})`}
                                 placeholder={`Brief overview of the product`}
                                 textArea={true}
                                 required
                             />
                         </div>
                    </div>

                    {/* Operational Details Grid Panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-6 h-full">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100/80 mb-5">
                             <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold border border-emerald-100/50">
                                 <FiTag size={16} />
                             </div>
                             <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-none">{i18n?.t("Operational Settings")}</h3>
                         </div>
                        <div className="space-y-4">
                            <FormSelect
                                label={'Store Category'}
                                name={'category'}
                                placeholder="Select Category binding"
                                options={category?.docs?.map((c) => ({
                                    value: c?._id,
                                    label: c?.name?.[l?.code] ?? c?.name?.['en'],
                                }))}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput placeholder={"0.00"} name={'price'} label={'Base Price (USD)'} type={"number"} required />
                                <FormInput placeholder={"0"} name={'quantity'} label={'Stock Quantity'} type={"number"} required />
                            </div>
                        </div>
                    </div>

                    </div>{/* End 2-col grid */}

                    {/* Variants Control Engine */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-6 overflow-hidden">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100/80 mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 border border-purple-100/50 flex items-center justify-center font-bold">
                                    <FiLayers size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-none mt-1">{i18n?.t("Product Variants")}</h3>
                                    <span className="text-[10px] text-gray-400 font-medium">Configure size/flavor varieties</span>
                                </div>
                            </div>
                            <Switch
                                checked={isVarient}
                                onChange={() => setIsVarient(!isVarient)}
                                checkedChildren={<span className="text-white">{i18n?.t("Enabled")}</span>}
                                unCheckedChildren={<span className="text-white">{i18n?.t("Off")}</span>}
                                className="!rounded-full"
                            />
                        </div>

                        {isVarient && (
                            <div className="pt-2">
                                <Form.List name={'variants'} initialValue={[{ name: '', price: 0, in_stock: true }]}>
                                    {(fields, { add, remove }) => (
                                        <div className="space-y-3">
                                            {fields.map(({ key, name, ...restField }, index) => (
                                                <div key={key} className="flex gap-4 items-start bg-slate-50 border border-slate-100 p-4 rounded-xl relative">
                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-grow items-start">
                                                        {availableLanguages.map((l_var, langIndex) => (
                                                            <div className="col-span-5" key={langIndex} style={{ display: l_var.code === selectedLang ? 'block' : 'none' }}>
                                                                <FormInput {...restField} placeholder={`e.g. Size L`} name={[name, 'name', l_var.code]} label={'Variant Alias'} className="!mb-0" />
                                                            </div>
                                                        ))}
                                                        <div className="col-span-4">
                                                            <FormInput {...restField} placeholder={"0.00"} type={"number"} name={[name, 'price']} label={'Price override'} className="!mb-0" />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <Form.Item {...restField} name={[name, 'in_stock']} label={i18n?.t("Variant Stock Status")} required className="!mb-0">
                                                                <Radio.Group className="flex gap-2 w-full mt-1">
                                                                    <Radio.Button value={true} className="flex-1 text-center scale-90">In Stock</Radio.Button>
                                                                    <Radio.Button value={false} className="flex-1 text-center scale-90">Empty</Radio.Button>
                                                                </Radio.Group>
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                    {fields.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-100/50 hover:bg-red-500 hover:text-white transition-all duration-300 mt-7"
                                                            onClick={() => remove(index)}
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="w-full border-2 border-dashed border-slate-200 hover:border-[#5572fc] bg-slate-50 hover:bg-[#5572fc]/5 text-gray-500 hover:text-[#5572fc] transition-all duration-300 rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-1.5 mt-2"
                                                onClick={() => add()}
                                            >
                                                <FiPlus size={16} /> {i18n?.t("Attach New Variant")}
                                            </button>
                                        </div>
                                    )}
                                </Form.List>
                            </div>
                        )}
                    </div>

                    {/* Rich Description */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100/80 mb-5">
                             <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 border border-blue-100/50 flex items-center justify-center font-bold">
                                 <FiFileText size={16} />
                             </div>
                             <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-none">{i18n?.t("Extended Technical Description")}</h3>
                         </div>
                        <JodiEditor placeholder={i18n?.t("Write comprehensive description...")} name={['description', l.code]} required />
                    </div>

                    {/* Media Uploads Grid */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100/80 mb-5">
                             <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center font-bold border border-orange-100/50">
                                 <FiImage size={16} />
                             </div>
                             <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide leading-none">{i18n?.t("Product Creative Assets")}</h3>
                         </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Primary Display Thumbnail (1 required)</h4>
                                <MultipleImageInput name={'thumbnail_image'} label={''} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Supporting Gallery Media (Up to 4)</h4>
                                <MultipleImageInput name={'images'} label={''} max={4} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            <div className="flex justify-end pt-2 pb-8">
                <Button 
                    onClick={(e) => { e.preventDefault(); noSelected({ form, setSelectedLang }); form.submit(); }} 
                    type="submit" 
                    className="!px-8 !py-3 flex items-center gap-2 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 !font-semibold !rounded-xl block w-fit !text-sm transition-all"
                >
                    {i18n?.t("Validate & Save")}
                </Button>
            </div>
        </Form>
    );
};

export default ProductForm;
