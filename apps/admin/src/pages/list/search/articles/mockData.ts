/**
 * Ported from ant-design-pro-master/src/pages/list/search/articles/service.ts
 * (`GET /api/fake_list`, mock/fakeList.ts). No backend for this demo
 * endpoint — calls the shared `fakeList()` generator directly. Matching
 * the original mock exactly: it ignores every query param except `count`
 * (category/owner filters typed into the form above the list never
 * actually filtered the mock data either).
 */
import { fakeList } from "../../mockUtils";
import type { ListItemDataType, Params } from "./data";

export async function queryFakeList(
  params: Params,
): Promise<{ data: { list: ListItemDataType[] } }> {
  return { data: { list: fakeList(params.count) } };
}
