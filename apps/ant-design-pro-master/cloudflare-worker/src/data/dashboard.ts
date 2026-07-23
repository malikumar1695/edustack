function generateAnalysisChartData() {
  const beginDay = Date.now();

  const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
  const visitData = fakeY.map((y, i) => ({
    x: new Date(beginDay + 1000 * 60 * 60 * 24 * i).toISOString().split('T')[0],
    y,
  }));

  const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
  const visitData2 = fakeY2.map((y, i) => ({
    x: new Date(beginDay + 1000 * 60 * 60 * 24 * i).toISOString().split('T')[0],
    y,
  }));

  const salesData = Array.from({ length: 12 }, (_, i) => ({
    x: `Month ${i + 1}`,
    y: Math.floor(Math.random() * 1000) + 200,
  }));

  const searchData = Array.from({ length: 50 }, (_, i) => ({
    index: i + 1,
    keyword: `search-keyword-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  }));

  const salesTypeData = [
    { x: 'Home Appliances', y: 4544 },
    { x: 'Food & Beverage', y: 3321 },
    { x: 'Personal Care', y: 3113 },
    { x: 'Apparel & Bags', y: 2341 },
    { x: 'Baby Products', y: 1231 },
    { x: 'Other', y: 1231 },
  ];

  const salesTypeDataOnline = [
    { x: 'Home Appliances', y: 244 },
    { x: 'Food & Beverage', y: 321 },
    { x: 'Personal Care', y: 311 },
    { x: 'Apparel & Bags', y: 41 },
    { x: 'Baby Products', y: 121 },
    { x: 'Other', y: 111 },
  ];

  const salesTypeDataOffline = [
    { x: 'Home Appliances', y: 99 },
    { x: 'Food & Beverage', y: 188 },
    { x: 'Personal Care', y: 344 },
    { x: 'Apparel & Bags', y: 255 },
    { x: 'Other', y: 65 },
  ];

  const offlineData = Array.from({ length: 10 }, (_, i) => ({
    name: `Stores ${i}`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  }));

  const offlineChartData = Array.from({ length: 20 }, (_, i) => {
    const date = new Date(Date.now() + 1000 * 60 * 30 * i);
    return {
      date: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
      type: 'Foot Traffic',
      value: Math.floor(Math.random() * 100) + 10,
    };
  }).concat(
    Array.from({ length: 20 }, (_, i) => {
      const date = new Date(Date.now() + 1000 * 60 * 30 * i);
      return {
        date: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
        type: 'Payments',
        value: Math.floor(Math.random() * 100) + 10,
      };
    }),
  );

  const radarOriginData = [
    { name: 'Individual', ref: 10, koubei: 8, output: 4, contribute: 5, hot: 7 },
    { name: 'Team', ref: 3, koubei: 9, output: 6, contribute: 3, hot: 1 },
    { name: 'Department', ref: 4, koubei: 1, output: 6, contribute: 5, hot: 7 },
  ];

  const radarTitleMap: Record<string, string> = {
    ref: 'References',
    koubei: 'Reputation',
    output: 'Output',
    contribute: 'Contribution',
    hot: 'Popularity',
  };

  const radarData = radarOriginData.flatMap((item) =>
    Object.entries(item)
      .filter(([key]) => key !== 'name')
      .map(([key, value]) => ({
        name: item.name,
        label: radarTitleMap[key],
        value,
      })),
  );

  return {
    visitData,
    visitData2,
    salesData,
    searchData,
    offlineData,
    offlineChartData,
    salesTypeData,
    salesTypeDataOnline,
    salesTypeDataOffline,
    radarData,
  };
}

export const getAnalysisChartData = generateAnalysisChartData;

export function getProjectNotice() {
  const now = new Date().toISOString();
  return [
    {
      id: 'xxx1',
      title: 'Alipay',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      description: "It's something inside them that they can't reach, and can't touch.",
      updatedAt: now,
      member: 'Code Monkey Squad',
      href: '',
      memberLink: '',
    },
    {
      id: 'xxx2',
      title: 'Angular',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      description: 'Hope is a good thing, maybe the best of things, and no good thing ever dies.',
      updatedAt: '2017-07-24',
      member: 'The Whole Team Looks Like Movie Stars',
      href: '',
      memberLink: '',
    },
    {
      id: 'xxx3',
      title: 'Ant Design',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      description: 'Of all the gin joints in all the towns in all the world, she walks into mine.',
      updatedAt: now,
      member: 'Chuunibyou Girls Squad',
      href: '',
      memberLink: '',
    },
    {
      id: 'xxx4',
      title: 'Ant Design Pro',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      description: 'Back then I only thought about what I wanted, never about what I had.',
      updatedAt: '2017-07-23',
      member: 'Programmer Life',
      href: '',
      memberLink: '',
    },
    {
      id: 'xxx5',
      title: 'Bootstrap',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      description: 'Winter is Coming',
      updatedAt: '2017-07-23',
      member: 'Fancy Design Squad',
      href: '',
      memberLink: '',
    },
    {
      id: 'xxx6',
      title: 'React',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
      description: "Life is like a box of chocolates, you never know what you're gonna get.",
      updatedAt: '2017-07-23',
      member: 'Tricked You Into CS',
      href: '',
      memberLink: '',
    },
  ];
}

const avatars2 = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
];

export function getActivities() {
  const now = new Date().toISOString();
  return [
    {
      id: 'trend-1',
      updatedAt: now,
      user: { name: 'Alice Chen', avatar: avatars2[0] },
      group: { name: 'Fancy Design Squad', link: 'https://github.com/' },
      project: { name: 'June Iteration', link: 'https://github.com/' },
      template: 'created project @{project} in @{group}',
    },
    {
      id: 'trend-2',
      updatedAt: now,
      user: { name: 'Bob Xiao', avatar: avatars2[1] },
      group: { name: 'Fancy Design Squad', link: 'https://github.com/' },
      project: { name: 'June Iteration', link: 'https://github.com/' },
      template: 'created project @{project} in @{group}',
    },
    {
      id: 'trend-3',
      updatedAt: now,
      user: { name: 'Cathy Lin', avatar: avatars2[2] },
      group: { name: 'Chuunibyou Girls Squad', link: 'https://github.com/' },
      project: { name: 'June Iteration', link: 'https://github.com/' },
      template: 'created project @{project} in @{group}',
    },
    {
      id: 'trend-4',
      updatedAt: now,
      user: { name: 'David Zhou', avatar: avatars2[4] },
      project: { name: 'May Routine Iteration', link: 'https://github.com/' },
      template: 'updated @{project} to published status',
    },
    {
      id: 'trend-5',
      updatedAt: now,
      user: { name: 'Emma Zhu', avatar: avatars2[3] },
      project: { name: 'Engineering Efficiency', link: 'https://github.com/' },
      comment: { name: 'Comment', link: 'https://github.com/' },
      template: 'posted @{comment} in @{project}',
    },
    {
      id: 'trend-6',
      updatedAt: now,
      user: { name: 'Frank Le', avatar: avatars2[5] },
      group: { name: 'Programmer Life', link: 'https://github.com/' },
      project: { name: 'Brand Iteration', link: 'https://github.com/' },
      template: 'created project @{project} in @{group}',
    },
  ];
}
