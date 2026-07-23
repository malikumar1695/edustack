/**
 * Ported from ant-design-pro-master/src/pages/list/search/projects/service.ts
 * (`GET /api/fake_list`, mock/fakeList.ts). No backend for this demo
 * endpoint — calls the shared `fakeList()` generator directly. Matching
 * the original mock exactly: `category`/`author` are accepted but ignored
 * (the original mock never filtered by them either).
 */
import { fakeList } from "../../mockUtils";
import type { ListItemDataType, Params } from "./data";

export async function queryFakeList(
  params: Params,
): Promise<{ data: { list: ListItemDataType[] } }> {
  return { data: { list: fakeList(params.count) } };
}
