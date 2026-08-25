/**
 * Ported from ant-design-pro-master/mock/listTableList.ts (`GET/POST /api/rule`).
 * No backend for this demo endpoint, so this keeps the same in-memory
 * `tableListDataSource` array the Express mock used, and applies the same
 * pagination/sort/filter/name-search logic locally instead of over HTTP.
 */
import dayjs from "dayjs";

export type RuleListItem = {
  key?: number;
  disabled?: boolean;
  href?: string;
  avatar?: string;
  name?: string;
  owner?: string;
  desc?: string;
  callNo?: number;
  status?: number;
  updatedAt?: string;
  createdAt?: string;
  progress?: number;
};

export type PageParams = {
  current?: number;
  pageSize?: number;
};

const avatars = [
  "https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png",
  "https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png",
];

function genList(current: number, pageSize: number): RuleListItem[] {
  const list: RuleListItem[] = [];
  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    list.push({
      key: index,
      disabled: i % 6 === 0,
      href: "https://ant.design",
      avatar: avatars[i % 2],
      name: `TradeCode ${index}`,
      owner: "Lily Qu",
      desc: "This is a description",
      callNo: Math.floor(Math.random() * 1000),
      status: Math.floor(Math.random() * 10) % 4,
      updatedAt: dayjs().format("YYYY-MM-DD"),
      createdAt: dayjs().format("YYYY-MM-DD"),
      progress: Math.ceil(Math.random() * 100),
    });
  }
  list.reverse();
  return list;
}

let tableListDataSource: RuleListItem[] = genList(1, 100);

/**
 * Mirrors the mock's `getRule` handler: paginate the in-memory array, then
 * apply sorter/filter/name search — this is what ProTable's `request` prop
 * calls directly (no network round-trip).
 */
export async function queryRuleList(
  params: PageParams & Record<string, any>,
  sort: Record<string, "ascend" | "descend" | null>,
  filter: Record<string, (string | number)[] | null>,
) {
  const { current = 1, pageSize = 10, name } = params;

  let dataSource = [...tableListDataSource];

  const sorterKeys = Object.keys(sort || {}).filter((key) => sort[key]);
  if (sorterKeys.length) {
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      sorterKeys.forEach((key) => {
        const nextSort = (next as any)?.[key] as number;
        const preSort = (prev as any)?.[key] as number;
        if (sort[key] === "descend") {
          sortNumber += preSort - nextSort > 0 ? -1 : 1;
        } else {
          sortNumber += preSort - nextSort > 0 ? 1 : -1;
        }
      });
      return sortNumber;
    });
  }

  const filterKeys = Object.keys(filter || {}).filter(
    (key) => filter[key] && filter[key]!.length,
  );
  if (filterKeys.length) {
    dataSource = dataSource.filter((item) =>
      filterKeys.some((key) => filter[key]!.includes(`${(item as any)[key]}`)),
    );
  }

  if (name) {
    dataSource = dataSource.filter((item) => item?.name?.includes(name));
  }

  const total = dataSource.length;
  const pageData = dataSource.slice(
    (current - 1) * pageSize,
    current * pageSize,
  );

  return {
    data: pageData,
    total,
    success: true,
  };
}

/** Mirrors the mock's `method: 'post'` branch — adds a new rule to the front of the list. */
export async function addRule(data: Partial<RuleListItem>) {
  const i = Math.ceil(Math.random() * 10000);
  const newRule: RuleListItem = {
    key: tableListDataSource.length,
    href: "https://ant.design",
    avatar: avatars[i % 2],
    name: data.name,
    owner: "Lily Qu",
    desc: data.desc,
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 2,
    updatedAt: dayjs().format("YYYY-MM-DD"),
    createdAt: dayjs().format("YYYY-MM-DD"),
    progress: Math.ceil(Math.random() * 100),
  };
  tableListDataSource = [newRule, ...tableListDataSource];
  return newRule;
}

/**
 * Mirrors the mock's `method: 'update'` branch, which only ever applied
 * `name`/`desc` from the submitted body (the rest of UpdateForm's fields —
 * target/template/type/time/frequency — were collected by the UI but never
 * actually persisted by the original mock either). Matched by `key`.
 */
export async function updateRule(data: Partial<RuleListItem>) {
  let updated: RuleListItem = {};
  tableListDataSource = tableListDataSource.map((item) => {
    if (item.key === data.key) {
      updated = { ...item, name: data.name, desc: data.desc };
      return updated;
    }
    return item;
  });
  return updated;
}

/** Mirrors the mock's `method: 'delete'` branch. */
export async function removeRule(keys: (number | undefined)[]) {
  tableListDataSource = tableListDataSource.filter(
    (item) => !keys.includes(item.key),
  );
  return { success: true };
}
