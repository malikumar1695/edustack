import {
  ClusterOutlined,
  ContactsOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { GridContent } from "@ant-design/pro-components";
import {
  Avatar,
  Card,
  Col,
  Divider,
  Flex,
  Input,
  type InputRef,
  Row,
  Tag,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useAuth, type CurrentUser } from "../../../context/AuthContext";
import Applications from "./components/Applications";
import Articles from "./components/Articles";
import Projects from "./components/Projects";
import { getProjectNotice } from "./_mock";

type tabKeyType = "articles" | "applications" | "projects";
type TagType = { key: string; label: string };

const operationTabList = [
  {
    key: "articles",
    tab: (
      <span>
        Articles <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: "applications",
    tab: (
      <span>
        Applications <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: "projects",
    tab: (
      <span>
        Projects <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
];
const TagList: React.FC<{
  tags: CurrentUser["tags"];
}> = ({ tags }) => {
  const ref = useRef<InputRef | null>(null);
  const [newTags, setNewTags] = useState<TagType[]>([]);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const showInput = () => {
    setInputVisible(true);
    if (ref.current) {
      ref.current?.focus();
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    let tempsTags = [...newTags];
    if (
      inputValue &&
      tempsTags.filter((tag) => tag.label === inputValue).length === 0
    ) {
      tempsTags = [
        ...tempsTags,
        { key: `new-${tempsTags.length}`, label: inputValue },
      ];
    }
    setNewTags(tempsTags);
    setInputVisible(false);
    setInputValue("");
  };
  return (
    <div>
      <div style={{ marginBottom: 12, fontWeight: 500 }}>Tags</div>
      <Flex wrap gap="small">
        {(tags || []).concat(newTags).map((item) => (
          <Tag key={item.key}>{item.label}</Tag>
        ))}
        {inputVisible && (
          <Input
            ref={ref}
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={showInput} style={{ borderStyle: "dashed" }}>
            <PlusOutlined />
          </Tag>
        )}
      </Flex>
    </div>
  );
};
const UserInfo: React.FC<{ user: CurrentUser }> = ({ user }) => {
  return (
    <div>
      <p style={{ position: "relative", marginBottom: 8, paddingLeft: 26 }}>
        <ContactsOutlined style={{ marginRight: 8 }} />
        {user.title}
      </p>
      <p style={{ position: "relative", marginBottom: 8, paddingLeft: 26 }}>
        <ClusterOutlined style={{ marginRight: 8 }} />
        {user.group}
      </p>
      <p style={{ position: "relative", marginBottom: 0, paddingLeft: 26 }}>
        <HomeOutlined style={{ marginRight: 8 }} />
        {(user.geographic || { province: { label: "" } }).province?.label}
        {(user.geographic || { city: { label: "" } }).city?.label}
      </p>
    </div>
  );
};

const TabContent: React.FC<{ tabValue: tabKeyType }> = ({ tabValue }) => {
  if (tabValue === "projects") {
    return <Projects />;
  }
  if (tabValue === "applications") {
    return <Applications />;
  }
  if (tabValue === "articles") {
    return <Articles />;
  }
  return null;
};

export default function Center() {
  const [tabKey, setTabKey] = useState<tabKeyType>("articles");
  const { currentUser } = useAuth();
  // Ported from center/_mock.ts's getProjectNotice() — see _mock.ts for why
  // this isn't part of useAuth()'s currentUser shape.
  const [notice] = useState(getProjectNotice);
  const loading = !currentUser;

  useEffect(() => {
    document.title = "Account Center - Ilm Admin";
  }, []);

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card
            variant="borderless"
            style={{ marginBottom: 24 }}
            loading={loading}
          >
            {!loading && currentUser && (
              <>
                <div style={{ marginBottom: 24, textAlign: "center" }}>
                  <img
                    alt=""
                    src={currentUser.avatar}
                    style={{
                      display: "block",
                      width: 104,
                      height: 104,
                      margin: "0 auto 20px",
                    }}
                  />
                  <div style={{ marginBottom: 4, fontWeight: 500, fontSize: 20, lineHeight: "28px" }}>
                    {currentUser.name}
                  </div>
                  <div>{currentUser?.signature}</div>
                </div>
                <UserInfo user={currentUser} />
                <Divider dashed />
                <TagList tags={currentUser.tags || []} />
                <Divider style={{ marginTop: 16 }} dashed />
                <div>
                  <div style={{ marginBottom: 12, fontWeight: 500 }}>Team</div>
                  <Row gutter={36}>
                    {notice?.map((item) => (
                      <Col key={item.id} lg={24} xl={12}>
                        <a
                          href={item.href}
                          style={{
                            display: "block",
                            marginBottom: 24,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Avatar
                            size="small"
                            src={item.logo}
                            style={{ marginRight: 12 }}
                          />
                          {item.member}
                        </a>
                      </Col>
                    ))}
                  </Row>
                </div>
              </>
            )}
          </Card>
        </Col>
        <Col lg={17} md={24}>
          <Card
            variant="borderless"
            tabList={operationTabList}
            activeTabKey={tabKey}
            onTabChange={(_tabKey: string) => {
              setTabKey(_tabKey as tabKeyType);
            }}
          >
            <TabContent tabValue={tabKey} />
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
}
