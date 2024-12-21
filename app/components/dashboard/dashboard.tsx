import { FC, useMemo, useState } from "react";
import {
  Breadcrumb,
  Button,
  ConfigProvider,
  DatePicker,
  Table,
  TableProps,
  Tabs,
  TabsProps,
  theme,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";

import { useAccessStore } from "@/app/store";
import { Path } from "@/app/constant";
import styles from "./dashboard.module.scss";
import { useDarkMode } from "@/app/utils/hooks";
import { fetchRechargeRecords, fetchUsageRecords } from "@/app/client/lyy";
import { getLang } from "@/app/locales";
import { RangePickerProps } from "antd/es/date-picker";

const { RangePicker } = DatePicker;

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const lang = getLang();
if (lang === "cn") {
  dayjs.locale("zh-cn");
}
const locale = lang === "cn" ? zhCN : undefined;

interface RequestParams {
  pageNum: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
}

type TableType = "pay" | "usage";
const fetchDashboardData = (params: any, type: TableType) => {
  console.log(params);
  if (type === "pay") {
    return fetchRechargeRecords(params);
  }
  return fetchUsageRecords(params);
};

const DashboardTable: FC<{ type: TableType }> = (props) => {
  const [params, setParams] = useState<RequestParams>({
    pageNum: 1,
    pageSize: 10,
    startTime: dayjs().startOf("day").format(TIME_FORMAT),
    endTime: dayjs().endOf("day").format(TIME_FORMAT),
  });
  const { data: dataResp, isValidating } = useSWR([props.type, params], () =>
    fetchDashboardData(params, props.type),
  );
  const [dateFilterVal, setDateFilterVal] = useState<RangePickerProps["value"]>(
    [dayjs(), dayjs()],
  );

  const handleSearch = () => {
    setParams((params) => ({
      ...params,
      startTime: dateFilterVal?.[0]?.startOf("day").format(TIME_FORMAT),
      endTime: dateFilterVal?.[1]?.endOf("day").format(TIME_FORMAT),
      pageNum: 1,
    }));
  };

  const columns = useMemo<TableProps["columns"]>(() => {
    if (props.type === "pay") {
      return [
        {
          title: "日期",
          dataIndex: "rechargeTime",
        },
        {
          title: "金额",
          dataIndex: "rechargeAmount",
        },
      ];
    }
    return [
      {
        title: "日期",
        dataIndex: "callTime",
      },
      {
        title: "问题token数",
        dataIndex: "promptTokens",
      },
      {
        title: "响应token数",
        dataIndex: "completionTokens",
      },
      {
        title: "总tokens数",
        dataIndex: "totalTokens",
      },
      {
        title: "消耗金额",
        dataIndex: "moneyCost",
      },
    ];
  }, [props.type]);

  const dataSource = useMemo(() => dataResp?.data ?? [], [dataResp]);

  const pagination: TableProps["pagination"] = useMemo(
    () => ({
      showQuickJumper: true,
      hideOnSinglePage: true,
      current: params.pageNum,
      pageSize: params.pageSize,
      total: dataResp?.totalNum ?? 0,
      onChange: (pageNum) => {
        setParams((params) => ({ ...params, pageNum }));
      },
    }),
    [params, dataResp],
  );

  return (
    <div>
      <div className={styles.filter}>
        <div className={styles.filterMain}>
          <RangePicker value={dateFilterVal} onChange={setDateFilterVal} />
        </div>
        <Button type="primary" onClick={handleSearch}>
          查询
        </Button>
      </div>
      <Table
        bordered
        rowKey="rechargeTime"
        size="small"
        loading={isValidating}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  );
};

const Dashboard: FC = (props) => {
  const { accessCode } = useAccessStore();
  const navigate = useNavigate();
  const isDark = useDarkMode();

  if (!accessCode) {
    navigate(Path.Auth);
    return null;
  }

  const tabItems: TabsProps["items"] = [
    {
      label: "使用记录",
      key: "usage",
      children: <DashboardTable type="usage" />,
    },
    {
      label: "充值记录",
      key: "pay",
      children: <DashboardTable type="pay" />,
    },
  ];

  return (
    <div className={styles["dashboard"]}>
      <ConfigProvider
        theme={isDark ? { algorithm: theme.darkAlgorithm } : {}}
        locale={locale}
      >
        <div className={styles.nav}>
          <Breadcrumb
            items={[
              {
                title: <Link to={Path.Home}>Home</Link>,
              },
              {
                title: "Dashboard",
              },
            ]}
          />
        </div>
        <Tabs items={tabItems}></Tabs>
      </ConfigProvider>
    </div>
  );
};

export default Dashboard;
