'use client';
import { Form, Input, message } from "antd";
import { postChangePassword } from "../../../../../helpers/backend";
import Button from "../../../../../../components/common/button";
import { useI18n } from "../../../../../providers/i18n";

const Page = () => {
  const [form] = Form.useForm();
  const i18n = useI18n();

  return (
    <div>
      <h1 className="text-[28px] font-semibold leading-[44.8px] ">{i18n?.t('Change Password')}</h1>
      <hr />
      <Form layout="vertical" form={form}
        onFinish={async (values) => {
          const { error, msg } = await postChangePassword(values)
          if (!error) {
            localStorage.removeItem('token')
            message.success(msg)
            window.location.href = '/signin'
          } else {
            message.error(msg)
          }
        }}
        className=" mt-1">

        <div className="space-y-2 sm:space-y-6 sm:mt-[25px] mt-2 passwordInput">
          <Form.Item
            name="old_password"
            label={i18n?.t('Old Password')}
            rules={[
              {
                required: true,
                message: i18n?.t('Please input your old password!'),
              },
            ]}
          >
            <Input.Password
              placeholder={i18n?.t('Old Password *')}
              autoComplete="current-password"
              className=" w-full px-2 sm:px-2 py-2 sm:py-[15px] border !border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            />
          </Form.Item>
          <Form.Item
            name="new_password"
            label={i18n?.t('New Password')}
            rules={[
              { required: true, message: i18n?.t('Please input your new password!') },
            ]}
          >
            <Input.Password
              placeholder={i18n?.t('New Password *')}
              autoComplete="new-password"
              className=" w-full px-2 sm:px-2 py-2 sm:py-[15px] border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label={i18n?.t('Confirm Password')}
            dependencies={['new_password']}
            rules={[
              { required: true, message: i18n?.t('Please re-type your confirm password') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const newPassword = getFieldValue('new_password');
                  if (!value || value === newPassword) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(i18n?.t('Passwords do not match')));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={i18n?.t('Retype Confirm Password *')}
              autoComplete="new-password"
              className=" w-full px-2 sm:px-2 py-2 sm:py-[15px] border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            />
          </Form.Item>
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit">
            {i18n?.t('Save Change')}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Page

