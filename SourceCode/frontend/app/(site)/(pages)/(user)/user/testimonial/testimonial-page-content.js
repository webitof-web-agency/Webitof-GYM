'use client';
import React, { useState } from 'react'
import TrainerTable from '../../../../../../components/form/trainerTable';
import { useAction, useFetch } from '../../../../../helpers/hooks';
import { fetchUserTestimonial, postUserTestimonial, deleteUserTestimonials } from '../../../../../helpers/backend';
import { Form, Modal, Rate } from 'antd';
import Button from '../../../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../../../components/form/input';
import { useI18n } from '../../../../../providers/i18n';

const TestimonialPageContent = () => {
  const [data, getData] = useFetch(fetchUserTestimonial);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const i18n = useI18n();

  const columns = [
    {
      text: i18n?.t("Description") || "Description",
      dataField: "description",
      formatter: (_) => <span className='text-wrap line-clamp-2 w-[150px] sm:w-[250px]'>{_}</span>,
    },
    {
      text: i18n?.t("rating") || "rating",
      dataField: "rating",
      formatter: (_, d) => <Rate className='!text-[#F97316]' disabled defaultValue={d?.rating} />,
    },
    {
      text: i18n?.t("active") || "active",
      dataField: "active",
      formatter: (_, d) => <div>{d?.active === true ? <p className='bg-green-300 text-white px-2 py-1 text-center rounded-xl font-poppins'>{i18n?.t("Active") || "Active"}</p> : <p className='bg-red-300 text-white font-poppins text-center px-2 py-1 rounded-xl'>{i18n?.t("Inactive") || "Inactive"}</p>}</div>,
    },
  ];

  const onFinish = async (values) => {
    useAction(postUserTestimonial, {
      _id: values._id,
      description: values.description,
      rating: values.rating,
      active: values.active
    }, () => {
      form.resetFields()
      setOpen(false)
      getData()
    });
  };

  return (
    <div className="bg-white">
      <div className='flex justify-end mb-6'>
        <Button onClick={() => setOpen(true)} type="button" className="!h-fit !py-2.5 !px-6 rounded-xl shadow-sm text-[14.5px] font-medium transition-transform hover:-translate-y-0.5">
          {i18n?.t("Add Testimonial")}
        </Button>
      </div>
      <TrainerTable
        data={data}
        columns={columns}
        onReload={getData}
        onEdit={(item) => {
          setIsEdit(true)
          form.setFieldsValue(item)
          setOpen(true)
          getData()
        }}
        noHeader
        pagination
        onDelete={deleteUserTestimonials}
      />
      <Modal
        title={isEdit ? i18n?.t("Edit Testimonial") : i18n?.t("Add Testimonial")}
        open={open}
        onCancel={() => { setOpen(false); form.resetFields() }}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          {isEdit && <HiddenInput name="_id" />}
          <Form.Item name="rating" label={i18n?.t("Rating")} rules={[{ required: true, message: i18n?.t("Please provide a rating") }]}>
            <Rate className='!text-[#F97316]' />
          </Form.Item>
          <FormInput name="description" label={i18n?.t("Description")} className="mt-4" />

          <div className="flex justify-start mt-4">
            <Button type='submit' className=" !h-fit !py-3">{i18n?.t("Submit")}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default TestimonialPageContent;

