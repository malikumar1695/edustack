/**
 * Ported from ant-design-pro-master/src/pages/list/card-list/_mock.ts
 * (`GET /api/card_fake_list`). No backend for this demo endpoint — calls
 * the shared `fakeList()` generator directly instead of over HTTP.
 */
import { fakeList, type FakeListItem as CardListItemDataType } from "../mockUtils";

export async function queryFakeList(params: {
  count: number;
}): Promise<{ data: { list: CardListItemDataType[] } }> {
  const count = Number(params.count) || 20;
  return { data: { list: fakeList(count) } };
}
