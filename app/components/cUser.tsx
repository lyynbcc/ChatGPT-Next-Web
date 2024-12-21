import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import styles from "./cUser.module.scss";
// const mockUrl = "https://apifoxmock.com/m1/5579269-5257196-default";
const mockUrl = "";
interface Response {
  code: number;
  message: string;
}
export const CUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values: { email: string; ceilPhoneNum?: string }) => {
    setLoading(true);
    try {
      const response = await axios.post<Response>(
        `${mockUrl}/api/license/gen`,
        values,
      );
      if (response.data.code === 0) {
        message.success("用户名创建成功!");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("用户名创建失败!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <Form name="create_user" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: "请输入您的邮箱!" }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item label="手机号" name="ceilPhoneNum">
          <Input type="tel" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
