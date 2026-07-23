import { Card, Typography } from "antd";

const { Title, Text } = Typography;

export default function NotYetPorted({ pageName }: { pageName: string }) {
  return (
    <Card>
      <Title level={4}>{pageName}</Title>
      <Text type="secondary">
        Not yet ported from the Ant Design Pro template — coming in a later
        session.
      </Text>
    </Card>
  );
}
