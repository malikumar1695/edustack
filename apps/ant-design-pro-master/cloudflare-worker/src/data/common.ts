export const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];

export const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
];

export const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];

export const desc = [
  "It's something inside them that they can't reach, and can't touch.",
  'Hope is a good thing, maybe the best of things, and no good thing ever dies.',
  "Life is like a box of chocolates, you never know what you're gonna get.",
  'Of all the gin joints in all the towns in all the world, she walks into mine.',
  'Back then I only thought about what I wanted, never about what I had.',
];

export const user = [
  'Xiaoxiao Fu',
  'Lily Qu',
  'Dongdong Lin',
  'David Zhou',
  'Jiahao Wu',
  'Emma Zhu',
  'Yujiang',
  'Frank Le',
  'Xiaoyi Tan',
  'Zhongni',
];

export const members = [
  {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
    name: 'Lily Qu',
    id: 'member1',
  },
  {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
    name: 'Wang Zhaojun',
    id: 'member2',
  },
  {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
    name: 'Nana Dong',
    id: 'member3',
  },
];

export const defaultUser = {
  name: 'Serati Ma',
  avatar:
    'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  userid: '00000001',
  email: 'antdesign@alipay.com',
  signature: 'The sea admits hundreds of rivers; broadmindedness makes one great.',
  title: 'Interaction Expert',
  group: 'Ant Group - Example BU - Example Platform Dept - Example Tech Dept - UED',
  tags: [
    { key: '0', label: 'Full of ideas' },
    { key: '1', label: 'Design-focused' },
    { key: '2', label: 'Spicy~' },
    { key: '3', label: 'Long legs' },
    { key: '4', label: 'Sichuan girl' },
    { key: '5', label: 'Open-minded' },
  ],
  notifyCount: 12,
  unreadCount: 11,
  country: 'China',
  geographic: {
    province: { label: 'Zhejiang', key: '330000' },
    city: { label: 'Hangzhou', key: '330100' },
  },
  address: '77 Gongzhuan Road, Xihu District',
  phone: '0752-268888888',
};

const statuses = ['active', 'exception', 'normal'];

export function fakeList(count: number) {
  const safeCount =
    Number.isFinite(count) && count >= 0 ? Math.floor(count) : 0;
  const list = [];
  for (let i = 0; i < safeCount; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      owner: user[i % user.length],
      title: titles[i % titles.length],
      avatar: avatars[i % avatars.length],
      cover:
        Math.floor(i / covers.length) % 2 === 0
          ? covers[i % covers.length]
          : covers[covers.length - 1 - (i % covers.length)],
      status: statuses[i % statuses.length],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % avatars.length],
      href: 'https://ant.design',
      updatedAt: Date.now() - Math.floor(Math.random() * 1000000000),
      createdAt: Date.now() - Math.floor(Math.random() * 1000000000),
      subDescription: desc[i % desc.length],
      description:
        'In the development of mid-to-back-office products, different design specifications and implementation approaches often emerge, yet there tend to be many similar commonalities and building blocks. This project is dedicated to distilling the strengths of various products and building a solid foundation for mid-to-back-office products.',
      activeUser: Math.floor(Math.random() * 10000) + 1000,
      newUser: Math.floor(Math.random() * 1000) + 100,
      star: Math.floor(Math.random() * 100) + 10,
      like: Math.floor(Math.random() * 100) + 10,
      message: Math.floor(Math.random() * 100) + 10,
      content:
        'Sample paragraph: the Ant Group design platform, ant.design, lets you integrate seamlessly with the Ant Group ecosystem with minimal effort, providing an experience solution spanning design and development. Sample paragraph: the Ant Group design platform, ant.design, lets you integrate seamlessly with the Ant Group ecosystem with minimal effort, providing an experience solution spanning design and development.',
      members,
    });
  }
  return list;
}
