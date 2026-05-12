import type { PivotField } from '../types/pivot';

export interface OrderRow {
  region: string;
  province: string;
  city: string;
  orderPeriod: string;
  salesAmount: number;
  salesCount: number;
}

export const orderFields: PivotField[] = [
  { key: 'region', label: '发货区域', type: 'dimension' },
  { key: 'province', label: '省份', type: 'dimension' },
  { key: 'city', label: '发货城市', type: 'dimension' },
  { key: 'orderPeriod', label: '订单年份', type: 'dimension' },
  { key: 'salesAmount', label: '销售额', type: 'measure' },
  { key: 'salesCount', label: '销售量', type: 'measure' },
];

export const orderRows: OrderRow[] = [
  {
    region: '华东',
    province: '江苏',
    city: '南京',
    orderPeriod: '2020年',
    salesAmount: 120000.5,
    salesCount: 12,
  },
  {
    region: '华东',
    province: '上海',
    city: '上海',
    orderPeriod: '2020年',
    salesAmount: 48203.6,
    salesCount: 5,
  },
  {
    region: '华东',
    province: '浙江',
    city: '杭州',
    orderPeriod: '2021年',
    salesAmount: 98000,
    salesCount: 8,
  },
  {
    region: '华南',
    province: '广东',
    city: '深圳',
    orderPeriod: '2020年',
    salesAmount: 132500,
    salesCount: 11,
  },
  {
    region: '华南',
    province: '广东',
    city: '广州',
    orderPeriod: '2021年',
    salesAmount: 143300.4,
    salesCount: 13,
  },
];

export const orderModel = {
  id: 'orders',
  name: '订单模型',
  description: '适合从订单、销售额和区域维度进入透视分析。',
  fields: orderFields,
  rows: orderRows,
};
