/**
 * Ported from ant-design-pro-master/mock/utils.ts — the shared fake-list
 * generator and its backing data, used by list/basic-list, list/card-list,
 * and list/search/{articles,projects,applications}. No backend for any of
 * these demo endpoints, so each page's mockData.ts calls `fakeList()`
 * directly instead of going over HTTP.
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
  "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
  "https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png",
  "https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png",
  "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png",
  "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png",
  "https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png",
  "https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png",
  "https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png",
];

const covers = [
  "https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png",
  "https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png",
  "https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png",
  "https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png",
];

const desc = [
  "It's something inside them that they can't reach, and can't touch.",
  "Hope is a good thing, maybe the best of things, and no good thing ever dies.",
  "Life is like a box of chocolates, you never know what you're gonna get.",
  "Of all the gin joints in all the towns in all the world, she walks into mine.",
  "Back then I only thought about what I wanted, never about what I had.",
];

const user = [
  "Xiaoxiao Fu",
  "Lily Qu",
  "Dongdong Lin",
  "David Zhou",
  "Jiahao Wu",
  "Emma Zhu",
  "Yujiang",
  "Frank Le",
  "Xiaoyi Tan",
  "Zhongni",
];

const memberAvatars = [
  "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
  "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
  "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
];

const memberNames = ["Lily Qu", "Wang Zhaojun", "Nana Dong"];

export type FakeListMember = {
  avatar: string;
  name: string;
  id: string;
};

export const members: FakeListMember[] = memberAvatars.map((avatar, i) => ({
  avatar,
  name: memberNames[i],
  id: `member${i + 1}`,
}));

export type FakeListItem = {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: "normal" | "exception" | "active" | "success";
  percent: number;
  logo: string;
  href: string;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: FakeListMember[];
};

/** Generate `count` fake list items — same shape/logic as the original mock. */
export function fakeList(count: number): FakeListItem[] {
  const list: FakeListItem[] = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${Math.random().toString(36).slice(2, 6)}${i}`,
      owner: user[i % user.length],
      title: titles[i % titles.length],
      avatar: avatars[i % avatars.length],
      cover:
        Math.floor(i / 4) % 2 === 0
          ? covers[i % covers.length]
          : covers[3 - (i % covers.length)],
      status: ["active", "exception", "normal"][i % 3] as FakeListItem["status"],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % 8],
      href: "https://ant.design",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 * i).getTime(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2 * i).getTime(),
      subDescription: desc[i % 5],
      description:
        "In the development of mid-to-back-office products, different design specifications and implementation approaches tend to emerge, and there are often many similar pages and components. These similar components can be extracted into a single set of standard specifications.",
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      star: Math.ceil(Math.random() * 100) + 100,
      like: Math.ceil(Math.random() * 100) + 100,
      message: Math.ceil(Math.random() * 10) + 10,
      content:
        "Sample paragraph: the Ant Group design platform, ant.design, lets you integrate seamlessly with the Ant Group ecosystem with minimal effort, providing an experience solution spanning design and development. Sample paragraph: the Ant Group design platform, ant.design, lets you integrate seamlessly with the Ant Group ecosystem with minimal effort, providing an experience solution spanning design and development.",
      members,
    });
  }
  return list;
}
