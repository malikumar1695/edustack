import { useEffect, useState } from "react";
import { Card, List, Tag, Typography } from "antd";
import { authApi, academicApi, notificationsApi } from "../lib/http";

const { Title, Text } = Typography;

type ServiceHealth = { service: string; status: string };

const CLIENTS = {
  auth: authApi,
  academic: academicApi,
  notifications: notificationsApi,
} as const;

type ServiceName = keyof typeof CLIENTS;
const SERVICE_NAMES = Object.keys(CLIENTS) as ServiceName[];

export default function DashboardPage() {
  const [results, setResults] = useState<
    Record<string, ServiceHealth | { error: string } | undefined>
  >({});

  useEffect(() => {
    SERVICE_NAMES.forEach((name) => {
      CLIENTS[name]
        .get<ServiceHealth>("/health")
        .then((res) => setResults((r) => ({ ...r, [name]: res.data })))
        .catch((err) =>
          setResults((r) => ({ ...r, [name]: { error: String(err) } })),
        );
    });
  }, []);

  return (
    <Card>
      <Title level={3}>Dashboard shell (plain React + axios)</Title>
      <Text type="secondary">
        Each service has its own axios instance (see lib/http.ts) with its own
        baseURL — no more hand-parsing a "service/path" string. The request
        interceptor attaches the auth token the same way for every call made
        through any of them.
      </Text>
      <List
        style={{ marginTop: 16 }}
        bordered
        dataSource={SERVICE_NAMES}
        renderItem={(name) => {
          const result = results[name];
          return (
            <List.Item>
              <Text code>{name} service</Text>
              {!result && <Tag>loading…</Tag>}
              {result && "status" in result && (
                <Tag color="success">
                  {result.service}: {result.status}
                </Tag>
              )}
              {result && "error" in result && (
                <Tag color="error">{result.error}</Tag>
              )}
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
