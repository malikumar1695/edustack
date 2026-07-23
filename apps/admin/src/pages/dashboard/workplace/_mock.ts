import type { ActivitiesType, NoticeType, RadarData } from "./data";

/**
 * Ported from ant-design-pro-master's dashboard/workplace/_mock.ts, which
 * was an Express-style mock behind `request('/api/project/notice')`,
 * `request('/api/activities')` and `request('/api/fake_workplace_chart_data')`.
 * There's no backend here, so these are plain local functions returning
 * the same shapes directly, no network call.
 *
 * Simplification: the original's `fakeChartData` mock also generated a
 * full analysis-shaped payload (visitData, salesData, searchData,
 * offlineData, ...) even though dashboard/workplace/index.tsx only ever
 * reads `radarData` off it (for the "XX Index" Radar chart) — the rest
 * was dead weight already in the source. Only `radarData` is ported here.
 */

const titles = [
  "Alipay",
  "Angular",
  "Ant Design",
  "Ant Design Pro",
  "Bootstrap",
  "React",
  "Vue",
  "Webpack",
];
const avatars = [
  "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png", // Alipay
  "https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png", // Angular
  "https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png", // Ant Design
  "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png", // Ant Design Pro
  "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png", // Bootstrap
  "https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png", // React
  "https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png", // Vue
  "https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png", // Webpack
];

const avatars2 = [
  "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
  "https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png",
  "https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png",
  "https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png",
  "https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png",
  "https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png",
];

export function getProjectNotice(): NoticeType[] {
  return [
    {
      id: "xxx1",
      title: titles[0],
      logo: avatars[0],
      description:
        "It's something inside them that they can't reach, and can't touch.",
      updatedAt: new Date().toISOString(),
      member: "Code Monkey Squad",
      href: "",
      memberLink: "",
    },
    {
      id: "xxx2",
      title: titles[1],
      logo: avatars[1],
      description:
        "Hope is a good thing, maybe the best of things, and no good thing ever dies.",
      updatedAt: new Date("2017-07-24").toISOString(),
      member: "The Whole Team Looks Like Movie Stars",
      href: "",
      memberLink: "",
    },
    {
      id: "xxx3",
      title: titles[2],
      logo: avatars[2],
      description:
        "Of all the gin joints in all the towns in all the world, she walks into mine.",
      updatedAt: new Date().toISOString(),
      member: "Chuunibyou Girls Squad",
      href: "",
      memberLink: "",
    },
    {
      id: "xxx4",
      title: titles[3],
      logo: avatars[3],
      description:
        "Back then I only thought about what I wanted, never about what I had.",
      updatedAt: new Date("2017-07-23").toISOString(),
      member: "Programmer Life",
      href: "",
      memberLink: "",
    },
    {
      id: "xxx5",
      title: titles[4],
      logo: avatars[4],
      description: "Winter is Coming",
      updatedAt: new Date("2017-07-23").toISOString(),
      member: "Fancy Design Squad",
      href: "",
      memberLink: "",
    },
    {
      id: "xxx6",
      title: titles[5],
      logo: avatars[5],
      description:
        "Life is like a box of chocolates, you never know what you're gonna get.",
      updatedAt: new Date("2017-07-23").toISOString(),
      member: "Tricked You Into CS",
      href: "",
      memberLink: "",
    },
  ];
}

export function getActivities(): ActivitiesType[] {
  const now = new Date().toISOString();
  return [
    {
      id: "trend-1",
      updatedAt: now,
      user: { name: "Alice Chen", avatar: avatars2[0] },
      group: { name: "Fancy Design Squad", link: "https://github.com/" },
      project: { name: "June Iteration", link: "https://github.com/" },
      template: "created project @{project} in @{group}",
    },
    {
      id: "trend-2",
      updatedAt: now,
      user: { name: "Bob Xiao", avatar: avatars2[1] },
      group: { name: "Fancy Design Squad", link: "https://github.com/" },
      project: { name: "June Iteration", link: "https://github.com/" },
      template: "created project @{project} in @{group}",
    },
    {
      id: "trend-3",
      updatedAt: now,
      user: { name: "Cathy Lin", avatar: avatars2[2] },
      group: { name: "Chuunibyou Girls Squad", link: "https://github.com/" },
      project: { name: "June Iteration", link: "https://github.com/" },
      template: "created project @{project} in @{group}",
    },
    {
      id: "trend-4",
      updatedAt: now,
      user: { name: "David Zhou", avatar: avatars2[4] },
      project: { name: "May Routine Iteration", link: "https://github.com/" },
      template: "updated @{project} to published status",
    },
    {
      id: "trend-5",
      updatedAt: now,
      user: { name: "Emma Zhu", avatar: avatars2[3] },
      project: { name: "Engineering Efficiency", link: "https://github.com/" },
      comment: { name: "Comment", link: "https://github.com/" },
      template: "posted @{comment} in @{project}",
    },
    {
      id: "trend-6",
      updatedAt: now,
      user: { name: "Frank Le", avatar: avatars2[5] },
      group: { name: "Programmer Life", link: "https://github.com/" },
      project: { name: "Brand Iteration", link: "https://github.com/" },
      template: "created project @{project} in @{group}",
    },
  ];
}

export function getWorkplaceChartData(): { radarData: RadarData[] } {
  const radarOriginData = [
    { name: "Individual", ref: 10, koubei: 8, output: 4, contribute: 5, hot: 7 },
    { name: "Team", ref: 3, koubei: 9, output: 6, contribute: 3, hot: 1 },
    { name: "Department", ref: 4, koubei: 1, output: 6, contribute: 5, hot: 7 },
  ];
  const radarTitleMap: Record<string, string> = {
    ref: "References",
    koubei: "Reputation",
    output: "Output",
    contribute: "Contribution",
    hot: "Popularity",
  };
  const radarData: RadarData[] = [];
  radarOriginData.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== "name") {
        radarData.push({
          name: item.name,
          label: radarTitleMap[key],
          value: item[key as keyof typeof item] as number,
        });
      }
    });
  });
  return { radarData };
}
