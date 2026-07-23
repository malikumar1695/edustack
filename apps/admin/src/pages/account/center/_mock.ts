// Ported from ant-design-pro-master's mock/utils.ts (fakeList/titles/avatars/
// covers/desc/user/members — shared canned data used by several mock
// endpoints) plus src/pages/account/center/_mock.ts's `getProjectNotice`.
// Duplicated here (rather than reused from a shared `mocks/` file) since
// this batch is scoped to apps/admin/src/pages/{profile,account}/** only —
// other pages that later want the same "fake list" shape can lift this back
// out to a shared location themselves.

export type Member = {
  avatar: string;
  name: string;
  id: string;
};

export type ListItemDataType = {
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
  members: Member[];
};

export type NoticeType = {
  id: string;
  title: string;
  logo: string;
  description: string;
  updatedAt: Date;
  member: string;
  href: string;
  memberLink: string;
};

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
const members: Member[] = memberAvatars.map((avatar, i) => ({
  avatar,
  name: memberNames[i],
  id: `member${i + 1}`,
}));

/** Ported from mock/utils.ts's fakeList(count). */
export function fakeList(count: number): ListItemDataType[] {
  const list: ListItemDataType[] = [];
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
      status: (["active", "exception", "normal"] as const)[i % 3],
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

/**
 * Ported from src/pages/account/center/_mock.ts's getProjectNotice() — the
 * "Team" list shown on the account center sidebar. Kept separate from
 * useAuth()'s currentUser since AuthContext's CurrentUser type has no
 * `notice` field (it isn't part of the login/session shape, just this
 * page's canned "team" content).
 */
export function getProjectNotice(): NoticeType[] {
  return titles.slice(0, 6).map((title, i) => ({
    id: `xxx${i + 1}`,
    title,
    logo: avatars[i],
    description: desc[i % desc.length],
    updatedAt: i % 2 === 0 ? new Date() : new Date("2017-07-24"),
    member: [
      "Code Monkey Squad",
      "The Whole Team Looks Like Movie Stars",
      "Chuunibyou Girls Squad",
      "Programmer Life",
      "Fancy Design Squad",
      "Tricked You Into CS",
    ][i],
    href: "",
    memberLink: "",
  }));
}
