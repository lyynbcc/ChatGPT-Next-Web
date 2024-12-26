import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { fetchLyyBackend } from "../client/lyy";
import { ApiPath } from "../constant";
import { useAccessStore } from "../store";
import styles from "./cUser.module.scss";

export const CUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const accessStore = useAccessStore();

  const onFinish = async (values: {
    email: string;
    ceilPhoneNum?: string;
    authorization?: string;
  }) => {
    setLoading(true);
    try {
      // 保存 authorization 到 store
      if (values.authorization) {
        accessStore.updateToken(values.authorization);
      }

      const result = await fetchLyyBackend(`${ApiPath.Lyy}/api/license/gen`, {
        email: values.email,
        ceilPhoneNum: values.ceilPhoneNum,
      });
      if (result) {
        message.success("用户名创建成功!");
      }
    } catch (error) {
      message.error("用户名创建失败!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Form
        name="create_user"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          authorization: accessStore.token || "",
        }}
      >
        <Form.Item
          label="Authorization Token"
          name="authorization"
          rules={[{ required: true, message: "请输入 Authorization Token!" }]}
        >
          <Input.Password placeholder="请输入 Authorization Token" />
        </Form.Item>

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
