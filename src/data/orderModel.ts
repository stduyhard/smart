import type { PivotField } from '../types/pivot';

export interface OrderRow {
  发货区域: string;
  省份: string;
  发货城市: string;
  订单年份: string;
  销售额: number;
  销售量: number;
}

export const orderFields: PivotField[] = [
  { key: '发货区域', label: '发货区域', type: 'dimension' },
  { key: '省份', label: '省份', type: 'dimension' },
  { key: '发货城市', label: '发货城市', type: 'dimension' },
  { key: '订单年份', label: '订单年份', type: 'dimension' },
  { key: '销售额', label: '销售额', type: 'measure' },
  { key: '销售量', label: '销售量', type: 'measure' },
];

export const orderRows: OrderRow[] = [
  {
    发货区域: '华东',
    省份: '江苏',
    发货城市: '南京',
    订单年份: '2020年',
    销售额: 120000.5,
    销售量: 12,
  },
  {
    发货区域: '华东',
    省份: '上海',
    发货城市: '上海',
    订单年份: '2020年',
    销售额: 48203.6,
    销售量: 5,
  },
  {
    发货区域: '华东',
    省份: '浙江',
    发货城市: '杭州',
    订单年份: '2021年',
    销售额: 98000,
    销售量: 8,
  },
  {
    发货区域: '华南',
    省份: '广东',
    发货城市: '深圳',
    订单年份: '2020年',
    销售额: 132500,
    销售量: 11,
  },
  {
    发货区域: '华南',
    省份: '广东',
    发货城市: '广州',
    订单年份: '2021年',
    销售额: 143300.4,
    销售量: 13,
  },
];

export const orderModel = {
  id: 'orders',
  name: '订单模型',
  description: '适合从订单、销售额和区域维度进入透视分析。',
  fields: orderFields,
  rows: orderRows,
};
