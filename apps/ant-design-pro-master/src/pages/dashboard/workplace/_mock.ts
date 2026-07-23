import dayjs from 'dayjs';
import type { Request, Response } from 'express';
import type { DataItem, OfflineDataType, SearchDataType } from './data';

// mock data
const visitData: DataItem[] = [];
const beginDay = Date.now();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: dayjs(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const visitData2: DataItem[] = [];
const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: dayjs(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY2[i],
  });
}

const salesData: DataItem[] = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `Month ${i + 1}`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}
const searchData: SearchDataType[] = [];
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `search-keyword-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  });
}
const salesTypeData = [
  {
    x: 'Home Appliances',
    y: 4544,
  },
  {
    x: 'Food & Beverage',
    y: 3321,
  },
  {
    x: 'Personal Care',
    y: 3113,
  },
  {
    x: 'Apparel & Bags',
    y: 2341,
  },
  {
    x: 'Baby Products',
    y: 1231,
  },
  {
    x: 'Other',
    y: 1231,
  },
];

const salesTypeDataOnline = [
  {
    x: 'Home Appliances',
    y: 244,
  },
  {
    x: 'Food & Beverage',
    y: 321,
  },
  {
    x: 'Personal Care',
    y: 311,
  },
  {
    x: 'Apparel & Bags',
    y: 41,
  },
  {
    x: 'Baby Products',
    y: 121,
  },
  {
    x: 'Other',
    y: 111,
  },
];

const salesTypeDataOffline = [
  {
    x: 'Home Appliances',
    y: 99,
  },
  {
    x: 'Food & Beverage',
    y: 188,
  },
  {
    x: 'Personal Care',
    y: 344,
  },
  {
    x: 'Apparel & Bags',
    y: 255,
  },
  {
    x: 'Other',
    y: 65,
  },
];

const offlineData: OfflineDataType[] = [];
for (let i = 0; i < 10; i += 1) {
  offlineData.push({
    name: `Stores ${i}`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  });
}
const offlineChartData: DataItem[] = [];
for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: Date.now() + 1000 * 60 * 30 * i,
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
  });
}

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];
const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const avatars2 = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];

const getNotice = (_: Request, res: Response) => {
  res.json({
    data: [
      {
        id: 'xxx1',
        title: titles[0],
        logo: avatars[0],
        description:
          "It's something inside them that they can't reach, and can't touch.",
        updatedAt: new Date(),
        member: 'Code Monkey Squad',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx2',
        title: titles[1],
        logo: avatars[1],
        description:
          'Hope is a good thing, maybe the best of things, and no good thing ever dies.',
        updatedAt: new Date('2017-07-24'),
        member: 'The Whole Team Looks Like Movie Stars',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx3',
        title: titles[2],
        logo: avatars[2],
        description:
          'Of all the gin joints in all the towns in all the world, she walks into mine.',
        updatedAt: new Date(),
        member: 'Chuunibyou Girls Squad',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx4',
        title: titles[3],
        logo: avatars[3],
        description:
          'Back then I only thought about what I wanted, never about what I had.',
        updatedAt: new Date('2017-07-23'),
        member: 'Programmer Life',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx5',
        title: titles[4],
        logo: avatars[4],
        description: 'Winter is Coming',
        updatedAt: new Date('2017-07-23'),
        member: 'Fancy Design Squad',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx6',
        title: titles[5],
        logo: avatars[5],
        description:
          "Life is like a box of chocolates, you never know what you're gonna get.",
        updatedAt: new Date('2017-07-23'),
        member: 'Tricked You Into CS',
        href: '',
        memberLink: '',
      },
    ],
  });
};

const getActivities = (_: Request, res: Response) => {
  res.json({
    data: [
      {
        id: 'trend-1',
        updatedAt: new Date(),
        user: {
          name: 'Alice Chen',
          avatar: avatars2[0],
        },
        group: {
          name: 'Fancy Design Squad',
          link: 'https://github.com/',
        },
        project: {
          name: 'June Iteration',
          link: 'https://github.com/',
        },
        template: 'created project @{project} in @{group}',
      },
      {
        id: 'trend-2',
        updatedAt: new Date(),
        user: {
          name: 'Bob Xiao',
          avatar: avatars2[1],
        },
        group: {
          name: 'Fancy Design Squad',
          link: 'https://github.com/',
        },
        project: {
          name: 'June Iteration',
          link: 'https://github.com/',
        },
        template: 'created project @{project} in @{group}',
      },
      {
        id: 'trend-3',
        updatedAt: new Date(),
        user: {
          name: 'Cathy Lin',
          avatar: avatars2[2],
        },
        group: {
          name: 'Chuunibyou Girls Squad',
          link: 'https://github.com/',
        },
        project: {
          name: 'June Iteration',
          link: 'https://github.com/',
        },
        template: 'created project @{project} in @{group}',
      },
      {
        id: 'trend-4',
        updatedAt: new Date(),
        user: {
          name: 'David Zhou',
          avatar: avatars2[4],
        },
        project: {
          name: 'May Routine Iteration',
          link: 'https://github.com/',
        },
        template: 'updated @{project} to published status',
      },
      {
        id: 'trend-5',
        updatedAt: new Date(),
        user: {
          name: 'Emma Zhu',
          avatar: avatars2[3],
        },
        project: {
          name: 'Engineering Efficiency',
          link: 'https://github.com/',
        },
        comment: {
          name: 'Comment',
          link: 'https://github.com/',
        },
        template: 'posted @{comment} in @{project}',
      },
      {
        id: 'trend-6',
        updatedAt: new Date(),
        user: {
          name: 'Frank Le',
          avatar: avatars2[5],
        },
        group: {
          name: 'Programmer Life',
          link: 'https://github.com/',
        },
        project: {
          name: 'Brand Iteration',
          link: 'https://github.com/',
        },
        template: 'created project @{project} in @{group}',
      },
    ],
  });
};

const radarOriginData = [
  {
    name: 'Individual',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: 'Team',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: 'Department',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];

const radarData: any[] = [];
const radarTitleMap = {
  ref: 'References',
  koubei: 'Reputation',
  output: 'Output',
  contribute: 'Contribution',
  hot: 'Popularity',
};
radarOriginData.forEach((item) => {
  Object.keys(item).forEach((key) => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key as 'ref'],
        value: item[key as 'ref'],
      });
    }
  });
});

const getChartData = (_: Request, res: Response) => {
  res.json({
    data: {
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
    },
  });
};

export default {
  'GET  /api/project/notice': getNotice,
  'GET  /api/activities': getActivities,
  'GET  /api/fake_workplace_chart_data': getChartData,
};
