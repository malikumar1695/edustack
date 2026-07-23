import { PageContainer } from "@ant-design/pro-components";
import { Card } from "antd";
import { useEffect } from "react";

// Simplified from the original, which rendered the entire cheatsheet.en-US.md
// through a custom markdown component with syntax highlighting — that's
// project documentation, not welcome-page UI, so it's dropped here.
const infoCards = [
  {
    index: 1,
    href: "https://reactrouter.com",
    title: "Learn React Router",
    desc: "Client-side routing — nested routes, loaders, and the <Outlet/> pattern this app's layout uses.",
  },
  {
    index: 2,
    href: "https://ant.design",
    title: "Learn Ant Design",
    desc: "The component library this whole UI is built on top of.",
  },
  {
    index: 3,
    href: "https://procomponents.ant.design",
    title: "Learn Pro Components",
    desc: "Higher-abstraction components on top of Ant Design — ProTable, ProForm, ProLayout.",
  },
];

function InfoCard({
  title,
  index,
  desc,
  href,
}: {
  title: string;
  index: number;
  desc: string;
  href: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={title}>
      <Card hoverable size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              display: "flex",
              width: 40,
              height: 40,
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background: "#1677ff",
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {index}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h4 style={{ margin: "0 0 4px" }}>{title}</h4>
            <p style={{ margin: 0, fontSize: 12, color: "#71717a" }}>{desc}</p>
          </div>
        </div>
      </Card>
    </a>
  );
}

export default function Welcome() {
  useEffect(() => {
    document.title = "Welcome - Ilm Admin";
  }, []);

  return (
    <PageContainer title="Welcome 🎉">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {infoCards.map((card) => (
          <InfoCard key={card.href} {...card} />
        ))}
      </div>
    </PageContainer>
  );
}
