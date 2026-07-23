// Ported from ant-design-pro-master's src/pages/profile/advanced/_mock.ts
// (an Express mock handler for `GET /api/profile/advanced`) and
// src/pages/profile/advanced/data.d.ts. There's no backend for this fake
// endpoint, so the same canned data is exported directly.

export type AdvancedOperation = {
  key: string;
  type: string;
  name: string;
  status: string;
  updatedAt: string;
  memo: string;
};

export const advancedOperation1: AdvancedOperation[] = [
  {
    key: "op1",
    type: "Order Activated",
    name: "Lily Qu",
    status: "agree",
    updatedAt: "2017-10-03  19:23:12",
    memo: "-",
  },
  {
    key: "op2",
    type: "Finance Review",
    name: "Xiaoxiao Fu",
    status: "reject",
    updatedAt: "2017-10-03  19:23:12",
    memo: "Reason for rejection",
  },
  {
    key: "op3",
    type: "Department Initial Review",
    name: "Mao Zhou",
    status: "agree",
    updatedAt: "2017-10-03  19:23:12",
    memo: "-",
  },
  {
    key: "op4",
    type: "Submit Order",
    name: "Dongdong Lin",
    status: "agree",
    updatedAt: "2017-10-03  19:23:12",
    memo: "Great",
  },
  {
    key: "op5",
    type: "Create Order",
    name: "Hanyaya",
    status: "agree",
    updatedAt: "2017-10-03  19:23:12",
    memo: "-",
  },
];

export const advancedOperation2: AdvancedOperation[] = [
  {
    key: "op1",
    type: "Order Activated",
    name: "Lily Qu",
    status: "agree",
    updatedAt: "2017-10-03  19:23:12",
    memo: "-",
  },
];

export const advancedOperation3: AdvancedOperation[] = [
  {
    key: "op1",
    type: "Create Order",
    name: "Hanyaya",
    status: "agree",
    updatedAt: "2017-10-03  19:23:12",
    memo: "-",
  },
];
