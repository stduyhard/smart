export type DataSource = {
  id: string;
  name: string;
  description: string;
  selectable: boolean;
};

const dataSources: DataSource[] = [
  {
    id: 'orders',
    name: '订单模型',
    description: '适合从订单、销售额和区域维度进入透视分析。',
    selectable: true,
  },
  {
    id: 'customers',
    name: '客户模型',
    description: '展示用数据源，后续任务会补充分析入口。',
    selectable: false,
  },
];

export async function listDataSources(): Promise<DataSource[]> {
  return dataSources;
}

export function getDataSourceById(sourceId: string): DataSource | null {
  return dataSources.find((source) => source.id === sourceId) ?? null;
}

export function isPivotSourceAvailable(sourceId: string): boolean {
  const source = getDataSourceById(sourceId);
  return Boolean(source?.selectable);
}
