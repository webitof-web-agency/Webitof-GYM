import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Table from '../../../components/form/table';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';
import { Form, Modal, Switch } from 'antd';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { useAction, useFetch } from '../../../../helpers/hooks';
import { delMarketingGroup, fetchGroups, postMarketingGroup } from '../../../../helpers/backend';
import { noSelected } from '../../../../helpers/utils';
import { useRouter } from 'next/navigation';
import { FiUsers, FiPlus, FiEdit2, FiCheckCircle, FiCalendar, FiSettings } from 'react-icons/fi';

const Group = ({ data, getData, loading }) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const { langCode, i18n } = useI18n();
    const [editingFeature, setEditingFeature] = useState(null);
    const [groups, getGroups] = useFetch(fetchGroups);
    const router = useRouter()

    useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open]);

    const handleSubmit = async (values) => {
        const submitData = {
            _id: editingFeature ? editingFeature._id : undefined,
            type: 'email',
            name: values?.name,
            status: values?.status,
        };
        const action = postMarketingGroup;
        try {
            await useAction(action, submitData, () => {
                setOpen(false);
                getData();
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const columns = [
        {
            text: 'Group Name',
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-[#F97316] flex items-center justify-center flex-shrink-0">
                        <FiUsers size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-800">{d?.name}</span>
                </div>
            ),
        },
        {
            text: 'Created On',
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: 'Status',
            dataField: 'status',
            formatter: (_, d) => (
                <div onClick={(e) => e.stopPropagation()} className="bg-slate-50 border border-slate-100 rounded-md px-2 py-1 inline-flex items-center">
                    <Switch
                        size="small"
                        checked={d?.status}
                        onChange={async (e) => {
                            await useAction(postMarketingGroup, { _id: d._id, status: e }, () => getData());
                        }}
                        className={d?.status ? '!bg-emerald-500' : '!bg-gray-400'}
                    />
                </div>
            ),
        },
        {
            text: 'Audience Management',
            dataField: 'contact',
            formatter: (_, d) => (
                <button
                    onClick={() => router.push(`/admin/marketing-group/${d?._id}`)}
                    className="flex items-center justify-center gap-1.5 bg-[#F97316]/10 hover:bg-[#F97316] text-[#F97316] hover:text-white border border-[#F97316]/20 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all w-fit whitespace-nowrap"
                >
                    <FiSettings size={12} /> Manage Contacts
                </button>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                action={
                    <Button
                        onClick={() => {
                            setEditingFeature(null);
                            form.resetFields();
                            setOpen(true);
                        }}
                        className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#F97316]/20 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                    >
                        <FiPlus size={14} /> {('Create Group')}
                    </Button>
                }
                onEdit={(data) => {
                    setEditingFeature(data);
                    form.setFieldsValue({
                        name: data?.name,
                        groups: data?.groups,
                        status: data?.status,
                    });
                    setOpen(true);
                }}
                indexed
                pagination
                onDelete={delMarketingGroup}
                langCode={langCode}
                shadow={false}
            />
            <Modal
                destroyOnClose
                width={420}
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                            {editingFeature ? <FiEdit2 size={15} /> : <FiUsers size={15} />}
                        </div>
                        <span className="text-base font-bold text-gray-800 leading-tight">
                            {editingFeature ? 'Edit Marketing Group' : 'Create Marketing Group'}
                        </span>
                    </div>
                }
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={handleSubmit}
                    className='mt-3 space-y-0'
                >
                    {editingFeature && <HiddenInput name="_id" />}
                    
                    <div className="grid grid-cols-1 gap-0">
                        <FormInput
                            placeholder={'e.g. VIP Members'}
                            name="name"
                            label={<span className="text-xs font-bold text-gray-600">Group Name</span>}
                            required={true}
                        />
                    </div>
                    
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-4">
                        <div className="flex items-center gap-2">
                            <FiCheckCircle size={14} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-700">{i18n?.t('Group Active Status')}</span>
                        </div>
                        <Form.Item name="status" valuePropName="checked" className="!mb-0">
                            <Switch size="small" />
                        </Form.Item>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                        <Button type="button" onClick={() => { setOpen(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs">
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            onClick={() => noSelected({ form })}
                            className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#F97316]/20 !font-semibold !rounded-lg !text-xs transition-all'
                        >
                            {editingFeature ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                            {editingFeature ? 'Save Changes' : 'Create Group'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Group;

