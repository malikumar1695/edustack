import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from "@ant-design/pro-components";
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Drawer, type FormInstance, Input, message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import { queryRuleList, removeRule, type RuleListItem } from "./mockData";

const Users: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<RuleListItem[]>([]);

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Table List - Ant Design Pro";
  }, []);

  const columns: ProColumns<RuleListItem>[] = [
    {
      title: "Rule name",
      dataIndex: "name",
      render: (dom, entity) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </Button>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "desc",
      valueType: "textarea",
    },
    {
      title: "Number of service calls",
      dataIndex: "callNo",
      sorter: true,
      hideInForm: true,
      renderText: (val: string) => `${val} 10K`,
    },
    {
      title: "Status",
      dataIndex: "status",
      hideInForm: true,
      valueEnum: {
        0: {
          text: "Shut down",
          status: "Default",
        },
        1: {
          text: "Running",
          status: "Processing",
        },
        2: {
          text: "Online",
          status: "Success",
        },
        3: {
          text: "Abnormal",
          status: "Error",
        },
      },
    },
    {
      title: "Last scheduled time",
      sorter: true,
      dataIndex: "updatedAt",
      valueType: "dateTime",
      formItemRender: (
        item: ProColumns<RuleListItem>,
        {
          defaultRender,
          ...rest
        }: {
          defaultRender: (item: ProColumns<RuleListItem>) => React.ReactNode;
        },
        form: FormInstance,
      ) => {
        const status = form.getFieldValue("status");
        if (`${status}` === "0") {
          return false;
        }
        if (`${status}` === "3") {
          return (
            <Input
              {...rest}
              placeholder="Please enter the reason for the exception!"
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: "Operating",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => [
        <UpdateForm
          trigger={<Button type="link">Configuration</Button>}
          key="config"
          onOk={actionRef.current?.reload}
          values={record}
        />,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          Subscribe to alerts
        </a>,
      ],
    },
  ];

  /**
   *  Delete node
   *
   * @param selectedRows
   */
  const handleRemove = useCallback(
    async (selectedRows: RuleListItem[]) => {
      if (!selectedRows?.length) {
        messageApi.warning("Please select items to delete");

        return;
      }

      setLoading(true);
      try {
        await removeRule(selectedRows.map((row) => row.key));
        setSelectedRows([]);
        actionRef.current?.reloadAndRest?.();
        messageApi.success("Deleted successfully and will refresh soon");
      } catch {
        messageApi.error("Delete failed, please try again");
      } finally {
        setLoading(false);
      }
    },
    [messageApi],
  );

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<RuleListItem, { current?: number; pageSize?: number }>
        headerTitle="Enquiry form"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <CreateForm key="create" reload={actionRef.current?.reload} />,
        ]}
        request={queryRuleList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Chosen{" "}
              <span style={{ fontWeight: 600 }}>
                {selectedRowsState.length}
              </span>{" "}
              item(s)
              &nbsp;&nbsp;
              <span>
                Total number of service calls{" "}
                {selectedRowsState.reduce(
                  (pre, item) => pre + (item.callNo ?? 0),
                  0,
                )}{" "}
                10K
              </span>
            </div>
          }
        >
          <Button
            loading={loading}
            onClick={() => {
              handleRemove(selectedRowsState);
            }}
          >
            Batch deletion
          </Button>
          <Button type="primary">Batch approval</Button>
        </FooterToolbar>
      )}

      <Drawer
        size={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Users;
