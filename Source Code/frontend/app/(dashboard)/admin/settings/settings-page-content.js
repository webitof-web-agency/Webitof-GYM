'use client';
import React, { useEffect } from 'react';
import { Card, Col, Form, Radio, Row } from 'antd';
import { message } from 'antd';
import PageTitle from '../../components/common/page-title';
import { fetchAdminSettings, postAdminSettings } from '../../../helpers/backend';
import FormInput, { HiddenInput } from '../../components/form/input';
import PhoneNumberInput from '../../components/form/phoneNumberInput';
import MultipleImageInput from '../../components/form/multiImage';
import { useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import { useI18n } from '../../../providers/i18n';

const SettingsPageContent = () => {
    const [baseForm] = Form.useForm();
    const [storageForm] = Form.useForm();
    const i18n = useI18n()
    const [data, getData] = useFetch(fetchAdminSettings)
    const storageProvider = Form.useWatch('storage_provider', storageForm) || 'local';

    useEffect(() => {
        if (data) {
            const baseSettingsData = {
                ...data,
                logo: data?.logo?.length > 0 ? [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data?.logo,
                    },
                ] : []
            };
            const storageSettingsData = {
                _id: data?._id,
                storage_provider: data?.storage?.provider || 'local',
                local_base_url: data?.storage?.local?.base_url || '',
                s3_access_key_id: data?.storage?.s3?.access_key_id || '',
                s3_secret_access_key: data?.storage?.s3?.secret_access_key || '',
                s3_region: data?.storage?.s3?.region || '',
                s3_bucket_name: data?.storage?.s3?.bucket_name || '',
                s3_base_path: data?.storage?.s3?.base_path || '',
            };
            baseForm.setFieldsValue(baseSettingsData);
            storageForm.setFieldsValue(storageSettingsData);
        }
    }, [baseForm, data, storageForm]);

    const handleBaseFinish = async (values) => {
        const submitData = {
            ...values,
            _id: values?._id || undefined,
            logo: values?.logo[0]?.originFileObj,
        }
        const { error, msg } = await postAdminSettings(submitData)
        if (error) {
            message.error(msg)
        } else {
            message.success(msg)
            getData()
        }
    }

    const handleStorageFinish = async (values) => {
        const submitData = {
            _id: values?._id || data?._id || undefined,
            storage_provider: values?.storage_provider || 'local',
            local_base_url: values?.local_base_url || '',
            s3_access_key_id: values?.s3_access_key_id || '',
            s3_secret_access_key: values?.s3_secret_access_key || '',
            s3_region: values?.s3_region || '',
            s3_bucket_name: values?.s3_bucket_name || '',
            s3_base_path: values?.s3_base_path || '',
        };

        const { error, msg } = await postAdminSettings(submitData);
        if (error) {
            message.error(msg);
        } else {
            message.success(msg);
            getData();
        }
    };

    return (
        <div>
            <PageTitle title="Admin Settings" />
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title={i18n?.t('Base Settings')}>
                        <Form form={baseForm} layout="vertical" onFinish={handleBaseFinish}>
                            <div className=" user-phone grid lg:grid-cols-2 grid-cols-1 gap-x-10 gap-y-5">
                                <HiddenInput name="_id" />
                                <FormInput placeholder={i18n?.t("Enter Title")} name="title" label={"Title"} required />
                                <FormInput placeholder={i18n?.t("Enter Description")} name="description" label={"Description"} required />
                                <FormInput placeholder={i18n?.t("Enter Email")} name="email" label={"Email"} required isEmail />
                                <PhoneNumberInput placeholder={i18n?.t("Enter Phone Number")} name="phone" label={"Phone Number"} required />
                                <FormInput placeholder={i18n?.t("Enter Address")} name="address" label={"Address"} required />
                                <FormInput placeholder={i18n?.t("Enter Copyright")} name="footer_text" label={"Copyright"} required />
                                <FormInput placeholder={i18n?.t("Enter Facebook Link")} name="facebook" label={"Facebook Link"} required />
                                <FormInput placeholder={i18n?.t("Enter Twitter Link")} name="twitter" label={"Twitter Link"} required />
                                <FormInput placeholder={i18n?.t("Enter Instagram Link")} name="instagram" label={"Instagram Link"} required />
                                <FormInput placeholder={i18n?.t("Enter Linkedin Link")} name="linkedin" label={"Linkedin Link"} required />
                                <FormInput placeholder={i18n?.t("Enter Youtube Link")} name="youtube" label={"Youtube Link"} required />
                                <div className='grid grid-cols-2'>
                                    <MultipleImageInput name="logo" label={"Logo"} required />
                                </div>
                            </div>
                            <Button type='submit' className="mt-4"> {i18n?.t("Save Base Settings")} </Button>
                        </Form>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title={i18n?.t('Upload Provider Settings')}>
                        <Form form={storageForm} layout="vertical" onFinish={handleStorageFinish}>
                            <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-10 gap-y-5">
                                <HiddenInput name="_id" />
                                <div className="lg:col-span-2">
                                    <Form.Item
                                        name="storage_provider"
                                        label={i18n?.t("Upload Provider")}
                                        rules={[{ required: true, message: 'Please select an upload provider' }]}
                                        initialValue="local"
                                        className="mb-1"
                                    >
                                        <Radio.Group>
                                            <Radio value="local">{i18n?.t("Local Server")}</Radio>
                                            <Radio value="s3">{i18n?.t("AWS S3")}</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                                {storageProvider === 'local' && (
                                    <div className="lg:col-span-2">
                                        <FormInput placeholder={i18n?.t("Enter Local Base URL")} name="local_base_url" label={"Local Base URL"} />
                                    </div>
                                )}
                                {storageProvider === 's3' && (
                                    <>
                                        <FormInput placeholder={i18n?.t("Enter AWS Access Key ID")} name="s3_access_key_id" label={"AWS Access Key ID"} required />
                                        <FormInput placeholder={i18n?.t("Enter AWS Secret Access Key")} name="s3_secret_access_key" label={"AWS Secret Access Key"} required type="password" />
                                        <FormInput placeholder={i18n?.t("Enter AWS Region")} name="s3_region" label={"AWS Region"} required />
                                        <FormInput placeholder={i18n?.t("Enter AWS Bucket Name")} name="s3_bucket_name" label={"AWS Bucket Name"} required />
                                        <FormInput placeholder={i18n?.t("Enter S3 Base Path")} name="s3_base_path" label={"S3 Base Path"} />
                                    </>
                                )}
                            </div>
                            <Button type='submit' className="mt-4">{i18n?.t("Save Upload Settings")}</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SettingsPageContent;
