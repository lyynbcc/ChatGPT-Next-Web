import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
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
  // const mockUrl = "https://apifoxmock.com/m1/5579269-5257196-default";
  const mockUrl = "";
  const onFinish = async (values: Request) => {
    setLoading(true);
    try {
      const response = await axios.post<Response>(
        mockUrl + "/api/recharge-code/generate",
        values,
      );
      if (response.data.code === 0) {
        setGeneratedCode(response.data.content);
        message.success("充值码生成成功!");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("生成失败!");
    } finally {
      setLoading(false);
    }
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
            <h3>生成的充值码:</h3>
            <div className={styles.code}>{generatedCode}</div>
          </div>
        )}
      </Form>
    </div>
  );
};
