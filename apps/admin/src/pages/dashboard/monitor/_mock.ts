import type { TagType } from "./data";

/**
 * Ported from ant-design-pro-master's dashboard/monitor/_mock.ts, which
 * used `mockjs.mock({'list|100': [{ name: '@city', 'value|1-100': 150, ... }]})`
 * behind `request('/api/tags')`. mockjs isn't installed in apps/admin, so
 * this hand-rolls the same shape: 100 random city/value pairs, generated
 * locally with no network call.
 */
const CITY_NAMES = [
  "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Hangzhou", "Chengdu",
  "Wuhan", "Xi'an", "Nanjing", "Chongqing", "Tianjin", "Suzhou", "Qingdao",
  "Changsha", "Zhengzhou", "Dalian", "Xiamen", "Ningbo", "Fuzhou", "Jinan",
  "Hefei", "Kunming", "Harbin", "Shenyang", "Wuxi", "Nanning", "Guiyang",
  "Nanchang", "Taiyuan", "Shijiazhuang",
];

function randomCity(): string {
  return CITY_NAMES[Math.floor(Math.random() * CITY_NAMES.length)];
}

export function getTags(): { list: TagType[] } {
  const list: TagType[] = Array.from({ length: 100 }, () => ({
    name: randomCity(),
    value: Math.floor(Math.random() * 100) + 1,
    type: String(Math.floor(Math.random() * 3)),
  }));
  return { list };
}
