/**
 * Ported from ant-design-pro-master/src/pages/list/search/applications/service.ts
 * (`GET /api/fake_list`, mock/fakeList.ts). No backend for this demo
 * endpoint — calls the shared `fakeList()` generator directly.
 */
import { fakeList } from "../../mockUtils";
import type { ListItemDataType, Params } from "./data";

export async function queryFakeList(
  params: Params,
): Promise<{ data: { list: ListItemDataType[] } }> {
  return { data: { list: fakeList(params.count) } };
}
