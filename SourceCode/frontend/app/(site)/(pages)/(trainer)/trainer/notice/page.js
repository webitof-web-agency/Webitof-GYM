'use client'
import React, { useState } from 'react';
import { useAction, useFetch } from '../../../../../helpers/hooks';
import { delTrainerNotice, fetchTrainerNoticeList, updateTrainerNotice, postTrainerNotice, fetchTrainerGroupList } from '../../../../../helpers/backend';
import { useI18n } from '../../../../../providers/i18n';
import Button from '../../../../../../components/common/button';
import TrainerTable from '../../../../../../components/form/trainerTable';
import { Form, Modal } from 'antd';
import FormSelect from '../../../../../../components/form/select';
import FormInput, { HiddenInput } from '../../../../../../components/form/input';
import dayjs from 'dayjs';
import { columnFormatter } from '../../../../../helpers/utils';

const Notice = () => {
  const [data, getData] = useFetch(fetchTrainerNoticeList);
  const [groupList, getGroupList] = useFetch(fetchTrainerGroupList);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const i18n = useI18n();

  const columns = [
    {
      text: i18n?.t("Notice Date"),
      dataField: "start_date",
      formatter: (_, d) => <span>{dayjs(d?.start_date).format('DD/MM/YYYY')}</span>,
    },
    {
      text: i18n?.t("Notice Title"),
      dataField: "title",
      formatter: (_, d) => <span>{d?.title?.length > 20 ? d?.title.substring(0, 20) + "..." : d?.title}</span>,
    },
    {
      text: i18n?.t("Content"),
      dataField: "content",
      formatter: (_, d) => <span>{d?.content?.length > 20 ? d?.content.substring(0, 20) + "..." : (d?.content || "-")}</span>,
    },
    {
      text: i18n?.t("Group"),
      dataField: "group",
      formatter: (_, d) => <span>{columnFormatter(d?.group?.name) || "-"}</span>,
    },
  ];

  const openModal = (editData) => {
    setOpen(true);

    if (editData) {
      setIsEditMode(true);
      const groupId = editData?.group?._id;
      const _id = editData?._id;
      form.setFieldsValue({
        ...editData,
        group: groupId || undefined,
        _id: _id || undefined,
      });
    } else {
      setIsEditMode(false);
      form.resetFields();
    }
  };

  const handleSubmit = async (values) => {
    await useAction(isEditMode ? updateTrainerNotice : postTrainerNotice, values, () => {
      setOpen(false);
      getData();
    });


  };

  return (
    <div className="bg-white">
      <div className='flex justify-end mb-6'>
        <Button
          onClick={() => openModal()}
          type="button"
          className="!py-2.5 !px-6 !h-fit rounded-xl shadow-sm text-[14.5px] font-medium transition-transform hover:-translate-y-0.5"
        >
          {i18n?.t("Add Notice")}
        </Button>
      </div>
      <div className="w-full overflow-x-auto">
        <TrainerTable
          data={data}
          columns={columns}
          onReload={getData}
          pagination
          onEdit={(data) => openModal(data)}
          onDelete={delTrainerNotice}
          noHeader
        />
      </div>
      <Modal
        title={isEditMode ? i18n?.t("Edit Notice") : i18n?.t("Add Notice")}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
        >
          <HiddenInput name="_id" />
          <FormSelect
            name="group"
            label="Group"
            disabled={isEditMode}
            placeholder={i18n?.t("Select group")}
            rules={[{ required: true, message: i18n?.t('Please select a group') }]}
            options={groupList?.docs?.map((group) => ({
              label: columnFormatter(group?.name),
              value: group?._id,
            }))}
          />
          <FormInput
            name="title"
            label={i18n?.t("Title")}
            placeholder={i18n?.t("Enter Title")}
            rules={[{ required: true, message: i18n?.t('Please enter title') }]}
          />
          <FormInput
            textArea={true}
            name="content"
            label={i18n?.t("Content")}
            placeholder={i18n?.t("Enter Content")}
            rules={[{ required: true, message: i18n?.t('Please enter content') }]}
          />
          <Button type='submit' className="mt-4 !py-2">
            {isEditMode ? i18n?.t("Update") : i18n?.t("Submit")}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Notice;
