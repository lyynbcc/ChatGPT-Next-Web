import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { fetchLyyBackend } from "../client/lyy";
import { ApiPath } from "../constant";
import styles from "./code.module.scss";

interface Request {
  accessToken: string;
  amount: string;
}

interface Response {
  code: number;
  content: string;
  message: string;
}

export const Code: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const onFinish = async (values: Request) => {
    setLoading(true);
    try {
      const result = await fetchLyyBackend(
        `${ApiPath.Lyy}/api/recharge-code/generate`,
        values,
      );
      if (result) {
        setGeneratedCode(result);
        message.success("充值码生成成功!");
      }
    } catch (error) {
      message.error("生成失败!");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedCode)
      .then(() => message.success("复制成功!"))
      .catch(() => message.error("复制失败!"));
  };

  return (
    <div className={styles.container}>
      <Form name="generate_code" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="token"
          name="accessToken"
          rules={[{ required: true, message: "请输入Access Token!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="充值金额"
          name="amount"
          rules={[{ required: true, message: "请输入充值金额!" }]}
        >
          <Input placeholder="例如: 1.5" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            生成充值码
          </Button>
        </Form.Item>
        {generatedCode && (
          <div className={styles.result}>
            <div className={styles.content}>
              <span>生成的充值码: {generatedCode}</span>
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
      </Form>
    </div>
  );
};
