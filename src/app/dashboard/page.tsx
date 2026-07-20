"use client";

import { Button, Card, Typography } from "antd";

const { Title, Text } = Typography;

export default function DashboardPage() {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Dashboard shell</Title>
        <Text type="secondary">
          Ant Design, SSR&apos;d via @ant-design/nextjs-registry. Role-based
          content (admin/teacher/student) lands here in S3.
        </Text>
        <div style={{ marginTop: 16 }}>
          <Button type="primary">It renders</Button>
        </div>
      </Card>
    </div>
  );
}
