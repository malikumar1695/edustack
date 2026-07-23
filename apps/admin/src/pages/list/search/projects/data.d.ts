export type { FakeListMember as Member, FakeListItem as ListItemDataType } from "../../mockUtils";

export interface Params {
  count: number;
  category?: (string | number)[];
  author?: string;
}
