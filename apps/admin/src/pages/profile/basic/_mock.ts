// Ported from ant-design-pro-master's src/pages/profile/basic/_mock.ts
// (an Express mock handler for `GET /api/profile/basic`) and
// src/pages/profile/basic/data.d.ts. There's no backend for this fake
// endpoint, so the same canned data is exported directly instead of being
// wrapped behind a request/response round trip.

export type BasicGood = {
  id: string;
  name?: string;
  barcode?: string;
  price?: string;
  num?: string | number;
  amount?: string | number;
};

export type BasicProgress = {
  key: string;
  time: string;
  rate: string;
  status: string;
  operator: string;
  cost: string;
};

export const basicGoods: BasicGood[] = [
  {
    id: "1234561",
    name: "Mineral Water 550ml",
    barcode: "12421432143214321",
    price: "2.00",
    num: "1",
    amount: "2.00",
  },
  {
    id: "1234562",
    name: "Herbal Tea 300ml",
    barcode: "12421432143214322",
    price: "3.00",
    num: "2",
    amount: "6.00",
  },
  {
    id: "1234563",
    name: "Tasty Potato Chips",
    barcode: "12421432143214323",
    price: "7.00",
    num: "4",
    amount: "28.00",
  },
  {
    id: "1234564",
    name: "Extra Tasty Egg Rolls",
    barcode: "12421432143214324",
    price: "8.50",
    num: "3",
    amount: "25.50",
  },
];

export const basicProgress: BasicProgress[] = [
  {
    key: "1",
    time: "2017-10-01 14:10",
    rate: "Contacted Customer",
    status: "processing",
    operator: "Courier ID1234",
    cost: "5mins",
  },
  {
    key: "2",
    time: "2017-10-01 14:05",
    rate: "Courier Departed",
    status: "success",
    operator: "Courier ID1234",
    cost: "1h",
  },
  {
    key: "3",
    time: "2017-10-01 13:05",
    rate: "Courier Accepted Order",
    status: "success",
    operator: "Courier ID1234",
    cost: "5mins",
  },
  {
    key: "4",
    time: "2017-10-01 13:00",
    rate: "Request Approved",
    status: "success",
    operator: "System",
    cost: "1h",
  },
  {
    key: "5",
    time: "2017-10-01 12:00",
    rate: "Return Request Initiated",
    status: "success",
    operator: "User",
    cost: "5mins",
  },
];
