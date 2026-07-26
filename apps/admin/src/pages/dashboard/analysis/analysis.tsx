import { EllipsisOutlined } from "@ant-design/icons";
import { GridContent } from "@ant-design/pro-components";
import { Col, Dropdown, Row } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { getFakeChartData } from "./_mock";
import IntroduceRow from "./components/IntroduceRow";
import OfflineData from "./components/OfflineData";
import ProportionSales from "./components/ProportionSales";
import SalesCard from "./components/SalesCard";
import TopSearch from "./components/TopSearch";
import { iconGroupStyle } from "./styles";
import { getTimeDistance, type TimeType } from "./utils/utils";

type RangePickerValue = RangePickerProps["value"];
type SalesType = "all" | "online" | "stores";

/**
 * Ported from ant-design-pro-master's dashboard/analysis/index.tsx. The
 * original loaded its (fake) chart data through `@tanstack/react-query` +
 * `request('/api/fake_analysis_chart_data')`; apps/admin has neither a
 * backend nor react-query installed, so the mock data is computed once,
 * synchronously, via a local function (`./_mock`). That also means there's
 * no real "loading" state any more — cards render with data immediately.
 */
const Analysis = () => {
  const [salesType, setSalesType] = useState<SalesType>("all");
  const [currentTabKey, setCurrentTabKey] = useState<string>("");
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    () => getTimeDistance("year"),
  );
  const [data] = useState(() => getFakeChartData());

  useEffect(() => {
    document.title = "Analysis - Ant Design Pro";
  }, []);

  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type));
  };
  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value);
  };
  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return false;
    }
    const value = getTimeDistance(type);
    if (!value) {
      return false;
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return false;
    }
    return (
      rangePickerValue[0].isSame(value[0] as Dayjs, "day") &&
      rangePickerValue[1].isSame(value[1] as Dayjs, "day")
    );
  };

  let salesPieData: any;
  if (salesType === "all") {
    salesPieData = data.salesTypeData;
  } else {
    salesPieData =
      salesType === "online" ? data.salesTypeDataOnline : data.salesTypeDataOffline;
  }

  const renderDropdownGroup = () => (
    <span>
      <Dropdown
        menu={{
          items: [
            { key: "1", label: "Action One" },
            { key: "2", label: "Action Two" },
          ],
        }}
        placement="bottomRight"
      >
        <EllipsisOutlined style={iconGroupStyle} />
      </Dropdown>
    </span>
  );
  const handleChangeSalesType = (value: SalesType) => {
    setSalesType(value);
  };
  const handleTabChange = (key: string) => {
    setCurrentTabKey(key);
  };
  const activeKey = currentTabKey || data.offlineData[0]?.name || "";
  return (
    <GridContent>
      <IntroduceRow loading={false} visitData={data.visitData || []} />

      <SalesCard
        rangePickerValue={rangePickerValue}
        salesData={data.salesData || []}
        isActive={isActive}
        handleRangePickerChange={handleRangePickerChange}
        loading={false}
        selectDate={selectDate}
      />

      <Row
        gutter={24}
        style={{
          marginTop: 24,
        }}
      >
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <TopSearch
            loading={false}
            visitData2={data.visitData2 || []}
            searchData={data.searchData || []}
            renderDropdownGroup={renderDropdownGroup}
          />
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <ProportionSales
            renderDropdownGroup={renderDropdownGroup}
            salesType={salesType}
            loading={false}
            salesPieData={salesPieData || []}
            handleChangeSalesType={handleChangeSalesType}
          />
        </Col>
      </Row>

      <OfflineData
        activeKey={activeKey}
        loading={false}
        offlineData={data.offlineData || []}
        offlineChartData={data.offlineChartData || []}
        handleTabChange={handleTabChange}
      />
    </GridContent>
  );
};
export default Analysis;
