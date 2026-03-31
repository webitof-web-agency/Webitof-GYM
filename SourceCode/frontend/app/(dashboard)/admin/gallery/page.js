'use client';

import dayjs from "dayjs";
import { useState } from "react";
import { Form, Modal } from "antd";
import Button from "../../../../components/common/button";
import { fetchAdminGallery, deleteGallery, postLocalSingleImage, postGallery } from "../../../helpers/backend";
import { useAction, useFetch } from "../../../helpers/hooks";
import { useI18n } from "../../../providers/i18n";
import Table, { TableImage } from "../../components/form/table";
import MultipleImageInput from "../../components/form/multiImage";
import PageTitle from "../../components/common/page-title";
import { FiPlus, FiImage, FiCalendar } from 'react-icons/fi';

const Page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchAdminGallery);
    const [open, setOpen] = useState(false);

    const columns = [
        {
            text: 'Preview',
            dataField: 'image',
            formatter: (_, d) => (
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                    {d?.image
                        ? <TableImage url={d?.image} className="w-full h-full object-cover" />
                        : <FiImage size={18} className="text-slate-300" />
                    }
                </div>
            ),
        },
        {
            text: 'Uploaded On',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
    ];

    const onFinish = async (values) => {
        if (!values?.image?.length) return;
        if (values?.image[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postLocalSingleImage({ image, image_name: 'gallery' });
            values.image = data;
        } else {
            values.image = values?.image[0]?.url;
        }
        return useAction(postGallery, { ...values }, () => {
            setOpen(false);
            getData();
        });
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-3 animate-fade-in relative">
            <div className="mb-4">
                <PageTitle title="Photo Gallery" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    indexed
                    action={
                        <Button
                            onClick={() => { form.resetFields(); setOpen(true); }}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} /> {i18n?.t('Upload Image')}
                        </Button>
                    }
                    data={data}
                    columns={columns}
                    onReload={getData}
                    loading={loading}
                    onDelete={deleteGallery}
                    pagination
                />
            </div>

            <Modal
                destroyOnClose
                width={440}
                open={open}
                onCancel={() => { setOpen(false); form.resetFields(); }}
                footer={null}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 border border-orange-100/50 flex items-center justify-center">
                            <FiImage size={15} />
                        </div>
                        <span className="text-base font-bold text-gray-800 leading-tight">
                            {i18n?.t('Upload Gallery Image')}
                        </span>
                    </div>
                }
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                <Form form={form} onFinish={onFinish} layout="vertical" className="mt-3">
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 mb-4">
                        <MultipleImageInput name="image" label={i18n?.t('Select Image')} required />
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                        <Button type="button" onClick={() => { setOpen(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs">
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading}
                            className="flex items-center gap-1.5 !px-5 !py-1.5 shadow-md shadow-[#5572fc]/20 !font-semibold !rounded-lg !text-xs transition-all">
                            <FiPlus size={13} /> {i18n?.t('Upload')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Page;
