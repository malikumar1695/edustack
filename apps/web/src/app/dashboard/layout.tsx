import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AntdRegistry>{children}</AntdRegistry>;
}
