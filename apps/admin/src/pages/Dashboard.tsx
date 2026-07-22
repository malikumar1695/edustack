import { useEffect, useState } from "react";
import { Card, List, Tag, Typography } from "antd";
import { apiFetch } from "../lib/api";

const { Title, Text } = Typography;

type ServiceHealth = { service: string; status: string };

const SERVICES: string[] = ["auth", "academic", "notifications"];

export default function DashboardPage() {
  const [results, setResults] = useState<
    Record<string, ServiceHealth | { error: string } | undefined>
  >({});

  useEffect(() => {
    SERVICES.forEach((name) => {
      apiFetch<ServiceHealth>(`${name}/health`)
        .then((data) => setResults((r) => ({ ...r, [name]: data })))
        .catch((err) =>
          setResults((r) => ({ ...r, [name]: { error: String(err) } })),
        );
    });
  }, []);

  return (
    <Card>
      <Title level={3}>Dashboard shell (plain React)</Title>
      <Text type="secondary">
        Same idea as the Next.js version, but every call here is a real
        cross-origin fetch straight to the service — no proxy in front. If
        the CORS config on a service doesn't list this app's origin
        (localhost:5174), these calls fail with a CORS error in the console,
        not a normal HTTP error.
      </Text>
      <List
        style={{ marginTop: 16 }}
        bordered
        dataSource={SERVICES}
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
