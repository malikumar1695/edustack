"use client";

import { useEffect, useState } from "react";
import { Card, List, Tag, Typography } from "antd";
import { apiFetch } from "@/lib/api";

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
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Dashboard shell</Title>
        <Text type="secondary">
          Every row below is a different backend service (auth-service :4001,
          academic-service :4002, notification-service :4003) — but this page
          only ever calls its own origin at <code>/api/&#123;service&#125;/health</code>.
          The proxy in <code>app/api/[service]/[...path]</code> forwards each
          one server-to-server.
        </Text>
        <List
          style={{ marginTop: 16 }}
          bordered
          dataSource={SERVICES}
          renderItem={(name) => {
            const result = results[name];
            return (
              <List.Item>
                <Text code>/api/{name}/health</Text>
                {!result && <Tag>loading…</Tag>}
                {result && "status" in result && (
                  <Tag color="success">{result.service}: {result.status}</Tag>
                )}
                {result && "error" in result && (
                  <Tag color="error">{result.error}</Tag>
                )}
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
}
