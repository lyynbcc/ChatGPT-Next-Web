import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { IconButton } from "./button";
import { useNavigate } from "react-router-dom";
import styles from "./cRecharge.module.scss";
import { Path } from "../constant";
import CloseIcon from "../icons/close.svg";

import Locale from "../locales";
interface RechargeResponse {
  code: number;
  content: string;
  message: string;
}

export const CRecharge: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //   const mock = "https://apifoxmock.com/m1/5579269-5257196-default";
  const mock = "";

  const onFinish = async (values: { code: string }) => {
    setLoading(true);
    try {
      const response = await axios.get<RechargeResponse>(
        `${mock}/v1/recharge-code/redeem`,
        {
          params: { code: values.code },
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        },
      );
      if (response.data.code === 0) {
        message.success("充值成功!");
      } else {
        message.error(response.data.message);
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
