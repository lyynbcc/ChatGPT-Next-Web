import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { IconButton } from "./button";
import { useNavigate } from "react-router-dom";
import styles from "./cRecharge.module.scss";
import { Path } from "../constant";
import CloseIcon from "../icons/close.svg";
import { useAccessStore } from "../store";
import Locale from "../locales";
import { fetchLyyBackend } from "../client/lyy";
import { ApiPath } from "../constant";

interface RechargeResponse {
  code: number;
  content: string;
  message: string;
}

export const CRecharge: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const accessStore = useAccessStore.getState();

  const onFinish = async (values: { code: string }) => {
    setLoading(true);
    try {
      const result = await fetchLyyBackend(
        `${ApiPath.Lyy}/v1/recharge-code/redeem`,
        {
          code: values.code,
          access_token: accessStore.accessCode,
        },
      );
      if (result) {
        message.success("充值成功!");
      }
    } catch (error) {
      message.error("充值失败!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className="window-action-button"></div>
      <div className="window-action-button"></div>
      <div className="window-action-button"></div>
      {/* 返回home */}
      <IconButton
        aria={Locale.UI.Close}
        icon={<CloseIcon />}
        onClick={() => navigate(Path.Home)}
        bordered
        className={styles.close}
      />
      <Form name="recharge" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="充值码"
          name="code"
          rules={[{ required: true, message: "请输入充值码!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            充值
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
