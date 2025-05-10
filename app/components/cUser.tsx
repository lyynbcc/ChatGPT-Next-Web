import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { fetchLyyBackend } from "../client/lyy";
import { ApiPath } from "../constant";
import { useAccessStore } from "../store";
import styles from "./cUser.module.scss";
import { CopyOutlined } from "@ant-design/icons";

export const CUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const accessStore = useAccessStore();

  const onFinish = async (values: {
    email: string;
    ceilPhoneNum?: string;
    authorization?: string;
  }) => {
    setLoading(true);
    try {
      if (values.authorization) {
        accessStore.updateToken(values.authorization);
      }

      const result = await fetchLyyBackend(`${ApiPath.Lyy}/api/license/gen`, {
        email: values.email,
        ceilPhoneNum: values.ceilPhoneNum,
      });
      if (result) {
        setGeneratedContent(result);
        message.success("用户名创建成功!");
      }
    } catch (error) {
      message.error("用户名创建失败!");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedContent)
      .then(() => message.success("复制成功!"))
      .catch(() => message.error("复制失败!"));
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
          rules={[
            { required: true, message: "请输入您的邮箱!" },
            { type: "email", message: "请输入有效的邮箱地址!" },
          ]}
        >
          <Input type="email" placeholder="example@domain.com" />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="ceilPhoneNum"
          rules={[
            { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的中国手机号码!" },
          ]}
        >
          <Input type="tel" placeholder="请输入11位手机号码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </Form.Item>
      </Form>

      {generatedContent && (
        <div className={styles.result}>
          <div className={styles.content}>
            {generatedContent}
            <Button
              icon={<CopyOutlined />}
              onClick={copyToClipboard}
              type="link"
            >
              复制
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
