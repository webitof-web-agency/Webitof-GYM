'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { Form, Modal } from 'antd';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { deleteRole, fetchRoleList, postRole } from '../../../../helpers/backend';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import Table from '../../../components/form/table';
import { useAction, useFetch } from '../../../../helpers/hooks';
import { useRouter } from 'next/navigation';
import { FiPlus, FiShield, FiCalendar, FiSettings, FiEdit2 } from "react-icons/fi";

const Page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchRoleList);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { push } = useRouter();

    const columns = [
        {
            text: i18n.t('Role Name'),
            dataField: 'name',
            formatter: (_, d) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-[#5572fc] flex items-center justify-center flex-shrink-0">
                        <FiShield size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">{d?.name}</span>
                </div>
            )
        },
        {
            text: i18n.t('Created On'),
            dataField: 'createdAt',
            formatter: (_, d) => (
                <span className="text-[10px] text-gray-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    <FiCalendar className="text-gray-400" size={10} />
                    {dayjs(d?.createdAt).format('DD MMM YYYY')}
                </span>
            ),
        },
        {
            text: 'Permissions List',
            dataField: 'name',
            formatter: (_, d) => (
                <button
                    onClick={() => push(`/admin/hrm/permission/${d?._id}`)}
                    className="flex items-center justify-center gap-1.5 bg-[#5572fc]/10 hover:bg-[#5572fc] text-[#5572fc] hover:text-white border border-[#5572fc]/20 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all w-fit whitespace-nowrap"
                >
                    <FiSettings size={12} /> Assign Permissions
                </button>
            ),
        }
    ];

    const onFinish = async (values) => {
        const submitData = { ...values };
        return useAction(postRole, submitData, () => {
            setOpen(false);
            getData();
            form.resetFields();
        });
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in relative">
            <div className="mb-2">
                <PageTitle title={i18n.t('System Roles')} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100/80">
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    action={
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setIsEdit(false);
                                setOpen(true);
                            }}
                            className="flex items-center gap-1.5 !px-4 shadow-md shadow-[#5572fc]/20 hover:shadow-lg hover:shadow-[#5572fc]/30 transition-all !h-8 !py-0 !rounded-lg block !w-auto !text-xs whitespace-nowrap"
                        >
                            <FiPlus size={14} /> {i18n.t('Create Role')}
                        </Button>
                    }
                    onEdit={(values) => {
                        setIsEdit(true);
                        setOpen(true);
                        if (values?._id) {
                            form.setFieldsValue({
                                ...values,
                                name: values?.name,
                            });
                        }
                    }}
                    onDelete={deleteRole}
                    indexed
                    pagination
                    shadow={false}
                />
            </div>

            <Modal
                destroyOnClose
                width={400}
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                title={
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#5572fc]/10 text-[#5572fc] flex items-center justify-center">
                            {isEdit ? <FiEdit2 size={15} /> : <FiShield size={15} />}
                        </div>
                        <span className="text-base font-bold text-gray-800 leading-tight">
                            {isEdit ? 'Edit System Role' : 'Create System Role'}
                        </span>
                    </div>
                }
                className="custom-modal rounded-xl"
                styles={{ content: { padding: '20px' } }}
            >
                <Form form={form} onFinish={onFinish} layout='vertical' className='mt-3 space-y-0'>
                    <HiddenInput name="_id"/>
                    
                    <div className="grid grid-cols-1 gap-0 mb-4">
                        <FormInput
                            name='name'
                            placeholder={i18n.t('e.g. Area Manager')}
                            label={<span className="text-xs font-bold text-gray-600">Role Designation</span>}
                            rules={[{ required: true, message: i18n.t('please enter name') }]}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                        <Button type="button" onClick={() => { setOpen(false); form.resetFields(); }}
                            className="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !py-1.5 !px-4 !font-semibold !rounded-lg !text-xs">
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            loading={loading}
                            className='!px-5 !py-1.5 flex items-center gap-1.5 shadow-md shadow-[#5572fc]/20 !font-semibold !rounded-lg !text-xs transition-all'
                        >
                            {isEdit ? <FiEdit2 size={13} /> : <FiPlus size={13} />}
                            {isEdit ? 'Save Changes' : 'Create Role'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Page;
