/**
 * Ported from ant-design-pro-master/src/pages/list/basic-list/index.tsx.
 * Original used `@tanstack/react-query` (useQuery/useMutation); admin
 * doesn't have that dependency, so data fetching is plain useState +
 * useEffect, and "invalidate then refetch" becomes a direct re-call of
 * `fetchList()` after each mutation. Original also used `createStyles`
 * (antd-style) for all its layout/spacing — that's inlined here, and the
 * pure `@media` breakpoint rules (mobile list-item stacking, card-head
 * responsive tweaks) are dropped since inline styles can't express media
 * queries; the page still renders correctly at desktop widths, just
 * without those small-screen refinements.
 */
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Modal,
  Progress,
  Row,
  Segmented,
} from "antd";
import dayjs from "dayjs";
import type { FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import OperationModal from "./components/OperationModal";
import type { BasicListItemDataType } from "./data";
import {
  addFakeList,
  queryFakeList,
  removeFakeList,
  updateFakeList,
} from "./mockData";

const { Search } = Input;

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => {
  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <span
        style={{
          display: "inline-block",
          marginBottom: 4,
          color: "rgba(0, 0, 0, 0.45)",
        }}
      >
        {title}
      </span>
      <p style={{ margin: 0, color: "rgba(0, 0, 0, 0.88)", fontSize: 24, lineHeight: "32px" }}>
        {value}
      </p>
      {bordered && (
        <em
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 1,
            height: 56,
            backgroundColor: "rgba(5, 5, 5, 0.06)",
          }}
        />
      )}
    </div>
  );
};

const ListContent = ({
  data: { owner, createdAt, percent, status },
}: {
  data: BasicListItemDataType;
}) => {
  const itemStyle: React.CSSProperties = {
    display: "inline-block",
    marginLeft: 40,
    color: "rgba(0, 0, 0, 0.45)",
    verticalAlign: "middle",
  };
  return (
    <div>
      <div style={itemStyle}>
        <span>Owner</span>
        <p style={{ marginTop: 4, marginBottom: 0 }}>{owner}</p>
      </div>
      <div style={itemStyle}>
        <span>Start Time</span>
        <p style={{ marginTop: 4, marginBottom: 0 }}>
          {dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
        </p>
      </div>
      <div style={itemStyle}>
        <Progress
          percent={percent}
          status={status}
          size={6}
          style={{
            width: 180,
          }}
        />
      </div>
    </div>
  );
};

const BasicList: FC = () => {
  const [done, setDone] = useState<boolean>(false);
  const [open, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<
    Partial<BasicListItemDataType> | undefined
  >(undefined);
  const [listData, setListData] = useState<{
    list: BasicListItemDataType[];
  }>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Basic List - Ant Design Pro";
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await queryFakeList({ count: 50 });
      setListData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const runListOperation = async (method: string, params: any) => {
    if (method === "remove") {
      await removeFakeList(params);
    } else if (method === "update") {
      await updateFakeList(params);
    } else {
      await addFakeList(params);
    }
    fetchList();
  };

  const list = listData?.list || [];
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: list.length,
  };
  const showEditModal = (item: BasicListItemDataType) => {
    setVisible(true);
    setCurrent(item);
  };
  const deleteItem = (id: string) => {
    runListOperation("remove", {
      id,
    });
  };
  const editAndDelete = (
    key: string | number,
    currentItem: BasicListItemDataType,
  ) => {
    if (key === "edit") showEditModal(currentItem);
    else if (key === "delete") {
      Modal.confirm({
        title: "Delete Task",
        content: "Are you sure you want to delete this task?",
        okText: "Confirm",
        cancelText: "Cancel",
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };
  const extraContent = (
    <div>
      <Segmented
        defaultValue="all"
        options={[
          { label: "All", value: "all" },
          { label: "In Progress", value: "progress" },
          { label: "Waiting", value: "waiting" },
        ]}
      />
      <Search
        style={{ width: 272, marginLeft: 16 }}
        placeholder="Please enter"
        onSearch={() => ({})}
        variant="filled"
      />
    </div>
  );

  const renderMoreBtn = (item: BasicListItemDataType) => {
    return (
      <Dropdown
        menu={{
          onClick: ({ key }) => editAndDelete(key, item),
          items: [
            {
              key: "edit",
              label: "Edit",
            },
            {
              key: "delete",
              label: "Delete",
            },
          ],
        }}
      >
        <Button type="link">
          More <DownOutlined />
        </Button>
      </Dropdown>
    );
  };

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrent({});
  };
  const handleSubmit = (values: BasicListItemDataType) => {
    setDone(true);
    const method = values?.id ? "update" : "add";
    runListOperation(method, values);
  };
  return (
    <div>
      <PageContainer>
        <div>
          <Card variant="borderless">
            <Row>
              <Col sm={8} xs={24}>
                <Info title="My To-Dos" value="8 tasks" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info
                  title="Avg. Task Processing Time This Week"
                  value="32 min"
                  bordered
                />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="Tasks Completed This Week" value="24 tasks" />
              </Col>
            </Row>
          </Card>

          <Card
            variant="borderless"
            title="Basic List"
            style={{
              marginTop: 24,
            }}
            styles={{
              body: {
                padding: "0 32px 40px 32px",
              },
            }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="edit"
                      type="link"
                      onClick={() => showEditModal(item)}
                    >
                      Edit
                    </Button>,
                    renderMoreBtn(item),
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.logo} shape="square" size="large" />
                    }
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>
      <Button
        type="dashed"
        onClick={() => {
          setVisible(true);
        }}
        style={{
          width: "100%",
          marginBottom: 8,
        }}
      >
        <PlusOutlined />
        Add
      </Button>
      <OperationModal
        done={done}
        open={open}
        current={current}
        onDone={handleDone}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default BasicList;
