/**
 * Ported from ant-design-pro-master/src/pages/list/basic-list/_mock.ts
 * (`GET /api/get_list`, `POST /api/post_fake_list`). No backend for this
 * demo endpoint — same in-memory `sourceData` module variable the Express
 * mock used, mutated directly instead of over HTTP.
 *
 * NOTE (inherited from the original mock, not a new bug): every "query"
 * call regenerates a brand-new random list via `fakeList()`, discarding
 * whatever was in `sourceData`. Since the page re-queries after every
 * add/update/remove (mirroring the original's `invalidateQueries`), an
 * edit is visible only until that immediate refetch, which then hands
 * back a totally fresh random list. This is exactly how the demo behaved
 * before the port too — it's a demo quirk, not something this port
 * introduced.
 */
import { fakeList, type FakeListItem as BasicListItemDataType } from "../mockUtils";

let sourceData: BasicListItemDataType[] = [];

export async function queryFakeList(params: {
  count?: number;
}): Promise<{ data: { list: BasicListItemDataType[] } }> {
  const count = Number(params.count) || 20;
  const result = fakeList(count);
  sourceData = result;
  return { data: { list: result } };
}

export async function removeFakeList(params: {
  id: string;
}): Promise<{ data: { list: BasicListItemDataType[] } }> {
  sourceData = sourceData.filter((item) => item.id !== params.id);
  return { data: { list: sourceData } };
}

export async function updateFakeList(
  params: Partial<BasicListItemDataType>,
): Promise<{ data: { list: BasicListItemDataType[] } }> {
  sourceData = sourceData.map((item) =>
    item.id === params.id ? { ...item, ...params } : item,
  );
  return { data: { list: sourceData } };
}

export async function addFakeList(
  params: Partial<BasicListItemDataType>,
): Promise<{ data: { list: BasicListItemDataType[] } }> {
  sourceData = [
    {
      ...params,
      id: `fake-list-${sourceData.length}`,
      createdAt: Date.now(),
    } as BasicListItemDataType,
    ...sourceData,
  ];
  return { data: { list: sourceData } };
}
