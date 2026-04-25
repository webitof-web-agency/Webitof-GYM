'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Switch, Tooltip, Form } from 'antd';
import { useRouter } from 'next/navigation';
import PageTitle from '../../components/common/page-title';
import Table, { TableImage } from '../../components/form/table';
import { useAction, useActionConfirm, useFetch } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';
import { blogCategoryList, delBlog, fetchBlogsList, fetchPopularBlog, fetchPublicBlog, fetchTagsList, postBlog, postSingleImage } from '../../../helpers/backend';
import Button from '../../../../components/common/button';
import { columnFormatter, noSelected } from '../../../helpers/utils';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import FormSelect from '../../../../components/form/select';
import JodiEditor from '../../../../components/form/jodiEditor';
import MultipleImageInput from '../../../../components/form/multiImage';
import dayjs from 'dayjs';
import Image from 'next/image';
import { FiPlus, FiCalendar, FiFileText, FiEdit2, FiTag, FiFolder, FiStar, FiGlobe, FiEye } from 'react-icons/fi';

const fallbackLanguage = { code: 'en', name: 'English' };

const AdminBlogCreate = () => {
    const { push } = useRouter();
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { languages, langCode } = useI18n();
    const availableLanguages =
        Array.isArray(languages?.docs) && languages.docs.length > 0
            ? languages.docs
            : [fallbackLanguage];

    const [data, getData, { loading }] = useFetch(fetchBlogsList);
    const [category, getCategory] = useFetch(blogCategoryList);
    const [tags, getTags] = useFetch(fetchTagsList);

    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [selectedLang, setSelectedLang] = useState();
    const [formLoader, setFormLoader] = useState(false);
    let imageUrl = '';

    const handleEdit = (record) => {
        setEditData(record);
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
        setEdit(true);
    };
    
    useEffect(() => {
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en')
    }, [availableLanguages, langCode])
    
    const handleAddNew = () => {
        form.resetFields();
        setEditData(null);
        setSelectedLang(langCode || availableLanguages[0]?.code || 'en');
        setEdit(true);
    };

    useEffect(() => {
        getCategory();
        getTags();
    }, []);

    useEffect(() => {
        if (editData) {
            form.setFieldsValue({
                ...editData,
                category: editData?.category?._id,
                tags: editData?.tags?.map((tag) => tag._id),
                image: editData?.image
                    ? [
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: editData?.image,
                        },
                    ]
                    : [],
            });
        }
    }, [editData]);

    const columns = [
        {
            text: 'Blog Post',
            dataField: 'title',
            formatter: (title, d) => (
                <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 relative">
                         {d?.image ? (
                             <Image src={d?.image} alt="blog cover" fill className="object-cover" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300"><FiFileText/></div>
                         )}
                     </div>
                     <div className="flex flex-col max-w-[200px]">
                         <span className="font-bold text-gray-800 text-xs truncate" title={columnFormatter(title)}>
                             {columnFormatter(title)}
                         </span>
                         <span className="text-[9px] font-bold text-[#F97316] mt-0.5 truncate flex items-center gap-1">
                             <FiFolder size={9}/> {columnFormatter(d?.category?.name) || 'Uncategorized'}
                         </span>
                     </div>
                </div>
            ),
        },
        {
            text: 'Date Published',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: 'Tags',
            dataField: 'tags',
            formatter: (_, d) => (
                <div className="flex flex-wrap gap-1 max-w-[150px]">
                     {d?.tags?.slice(0, 2).map((t, idx) => (
                         <span key={idx} className="text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                             <FiTag size={8}/> {columnFormatter(t?.name)}
                         </span>
                     ))}
                     {d?.tags?.length > 2 && <span className="text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">+{d?.tags?.length - 2}</span>}
                </div>
            ),
        },
        {
            text: 'Global State',
            dataField: 'published',
            formatter: (_, d) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="w-[50px] text-[10px] font-bold text-gray-500 flex items-center gap-1"><FiGlobe size={11}/> Public</span>
                        <Switch
                            checked={d?.published}
                            onChange={async () => await useActionConfirm(fetchPublicBlog, { _id: d._id }, getData, 'Are you sure you want to change published status?', 'Yes, Change')}
                            size="small"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-[50px] text-[10px] font-bold text-yellow-600 flex items-center gap-1"><FiStar size={11}/> Star</span>
                        <Switch
                            checked={d?.add_to_popular}
                            onChange={async () => await useActionConfirm(fetchPopularBlog, { _id: d._id }, getData, 'Are you sure you want to change add popular status?', 'Yes, Change')}
                            size="small"
                        />
                    </div>
                </div>
            ),
        },
    ];

    const handleSubmit = async (values) => {
        setFormLoader(true);
        try {
            if (values?.image?.[0]?.originFileObj) {
                const image = values?.image[0]?.originFileObj;
                const { data } = await postSingleImage({ image, image_name: 'blog' });
                imageUrl = data;
            } else {
                imageUrl = values?.image?.[0]?.url || '';
            }

            const multiLangFields = ['title', 'short_description', 'details'];
            const formattedData = multiLangFields.reduce((acc, field) => {
                acc[field] = {};
                availableLanguages.forEach((lang) => {
                    if (values[field] && values[field][lang.code]) {
                        acc[field][lang.code] = values[field][lang.code];
                    }
                });
                return acc;
            }, {});

            const submitData = {
                _id: values?._id,
                ...formattedData,
                category: values.category,
                tags: values.tags,
                add_to_popular: values.add_to_popular,
                published: values.published,
                image: imageUrl,
            };

            await useAction(editData ? postBlog : postBlog, submitData, () => {
                setEdit(false);
                getData();
                form.resetFields();
            });
        } finally {
            setFormLoader(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative z-0">
            <div className="mb-2">
                <PageTitle title={i18n.t("Blog Database")} />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    onDelete={delBlog}
                    action={
                        <Button onClick={handleAddNew} className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap">
                            <FiPlus size={14} /> {i18n?.t("Create Post")}
                        </Button>
                    }
                    onEdit={handleEdit}
                    onView={(data) => push(`/admin/blog/view/${data?._id}`)}
                    indexed
                    pagination
                    langCode={langCode}
                    shadow={false}
                />
            </div>

            <Modal
                width={850}
                open={edit}
                onCancel={() => setEdit(false)}
                footer={null}
                destroyOnClose={true}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                            {editData ? <FiEdit2 size={15} /> : <FiFileText size={15} />}
                        </div>
                        <span className="text-base font-bold text-gray-800 leading-tight">
                            {editData ? i18n?.t("Edit Blog Post") : i18n?.t("Draft New Blog Post")}
                        </span>
                    </div>
                }
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '24px' } }}
            >
                <div className="flex justify-start flex-wrap gap-2 mt-2 mb-5">
                    {availableLanguages.map((l, index) => (
                        <button
                            onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wide transition-all border ${
                                l.code === selectedLang
                                ? 'bg-[#F97316] text-white border-[#F97316]'
                                : 'bg-transparent text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-gray-800'
                            }`}
                            key={index}
                        >
                            {l.name} Localization
                        </button>
                    ))}
                </div>

                <Form layout='vertical' form={form} onFinish={handleSubmit} className="space-y-0">
                    <HiddenInput name='_id' />
                    
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 mb-5">
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1.5"><FiFileText size={12}/> Post Content Core</h4>
                        {availableLanguages.map((l, index) => (
                            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                                <FormInput
                                    label={<span className="text-xs font-bold text-gray-700">Display Title</span>}
                                    name={['title', l.code]}
                                    required
                                    initialValue={editData?.title?.[l.code] || ''}
                                    placeholder={i18n?.t('Enter optimized title snippet')}
                                />
                                
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 place-items-start'>
                                    {category && (
                                        <div className="w-full">
                                            <FormSelect
                                                label={<span className="text-xs font-bold text-gray-700">Content Category</span>}
                                                placeholder={'Select category'}
                                                name={'category'}
                                                required
                                                className="!w-full"
                                                options={category?.docs?.map((cat) => ({
                                                    label: cat?.name[l.code] ?? cat?.name["en"],
                                                    value: cat?._id,
                                                }))}
                                            />
                                        </div>
                                    )}
                                    {tags && (
                                        <div className="w-full multiselect">
                                            <FormSelect
                                                label={<span className="text-xs font-bold text-gray-700">Assigned Tags</span>}
                                                name={'tags'}
                                                placeholder={i18n?.t('Select grouping tags')}
                                                required
                                                multi={true}
                                                className='!w-full'
                                                options={tags?.docs?.map((tag) => ({
                                                    label: tag?.name[l.code] ?? tag?.name['en'],
                                                    value: tag?._id,
                                                }))}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-2">
                                     <FormInput
                                        label={<span className="text-xs font-bold text-gray-700">SEO Short Description</span>}
                                        name={['short_description', l.code]}
                                        placeholder={i18n?.t('Preview text for search engines and lists')}
                                        textArea
                                        initialValue={editData?.short_description?.[l.code] || ''}
                                        required
                                     />
                                </div>
                                <div className="mt-2 text-editor-container">
                                    <JodiEditor
                                        label={<span className="text-xs font-bold text-gray-700">Rich Text Details</span>}
                                        name={['details', l.code]}
                                        placeholder={i18n?.t('Author your content')}
                                        required
                                        initialValue={editData?.details?.[l.code] || ''}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                         <div className="flex flex-col gap-3">
                             <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><FiGlobe size={12}/> Post Distribution</h4>
                             <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                                 <div>
                                     <span className="text-xs font-bold text-gray-800 block">Publication Target</span>
                                     <span className="text-[10px] text-gray-500">Live instantly to public audience</span>
                                 </div>
                                 <Form.Item name="published" valuePropName="checked" className="!mb-0">
                                     <Switch className="bg-[#505d69]" />
                                 </Form.Item>
                             </div>
                             
                             <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                                 <div>
                                     <span className="text-xs font-bold text-gray-800 block flex items-center gap-1 text-yellow-600"><FiStar size={12}/> Editor's Choice</span>
                                     <span className="text-[10px] text-gray-500">Feature block in popular sections</span>
                                 </div>
                                 <Form.Item name="add_to_popular" valuePropName="checked" className="!mb-0">
                                     <Switch className="bg-[#505d69]" />
                                 </Form.Item>
                             </div>
                         </div>
                         <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">Cover Media</h4>
                              <MultipleImageInput name={"image"} required />
                         </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-gray-100">
                         <Button 
                            type="button" 
                            onClick={() => { setEdit(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs"
                         >
                            Cancel
                         </Button>
                         <Button type='submit' loading={formLoader} onClick={() => noSelected({ form, setSelectedLang })} className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg !text-xs transition-all'>
                            {editData ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                            {editData ? i18n.t('Save Changes') : i18n.t('Publish Post')}
                         </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminBlogCreate;

