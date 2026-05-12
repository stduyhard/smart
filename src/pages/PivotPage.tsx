import { Link, useParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import DragProvider from '../components/pivot/DragProvider';
import EmptyState from '../components/pivot/EmptyState';
import FieldPanel from '../components/pivot/FieldPanel';
import LayoutZone from '../components/pivot/LayoutZone';
import SettingsPanel from '../components/pivot/SettingsPanel';
import Toolbar from '../components/pivot/Toolbar';
import { getPivotSourceById, type PivotSourceId } from '../data/orderModel';
import { isPivotSourceAvailable } from '../services/dataSources';
import { usePivotStore } from '../store/pivotStore';

const zoneDefinitions = [
  { key: 'rows', title: '行', type: 'dimension' },
  { key: 'columns', title: '列', type: 'dimension' },
  { key: 'measures', title: '度量', type: 'measure' },
  { key: 'filters', title: '过滤条件', type: 'dimension' },
] as const;

function PivotPage() {
  const { sourceId } = useParams();
  const source = sourceId ? getPivotSourceById(sourceId) : null;

  if (!sourceId || !source || !isPivotSourceAvailable(sourceId)) {
    return (
      <AppShell
        title="数据源不存在"
        description="请返回数据源列表并选择有效的业务模型。"
        actions={<Link to="/sources">返回数据源</Link>}
      />
    );
  }

  const resolvedSourceId = sourceId as PivotSourceId;
  const sourceState = usePivotStore((state) => state.getSourceState(resolvedSourceId));
  const resetLayout = usePivotStore((state) => state.resetLayout);
  const hasLayoutContent = Object.values(sourceState.layout).some((zoneItems) => zoneItems.length > 0);

  const resolvedZoneFields = zoneDefinitions.map((zone) => ({
    ...zone,
    fields: sourceState.layout[zone.key]
      .map((fieldKey) => source.fields.find((field) => field.key === fieldKey) ?? null)
      .filter((field) => field !== null),
  }));

  return (
    <DragProvider>
      <main className="pivot-page">
        <section className="pivot-page__hero">
          <p className="eyebrow">Smartbi Pivot</p>
          <h1>透视分析: {resolvedSourceId}</h1>
          <p>{source?.description}</p>
        </section>
        <Toolbar
          sourceName={source.name}
          onReset={() => resetLayout(resolvedSourceId)}
        />
        <section className="pivot-page__workspace">
          <FieldPanel source={source} />
          <section className="pivot-panel pivot-layout-board" aria-labelledby="pivot-layout-board-title">
            <div className="pivot-panel__header">
              <h2 id="pivot-layout-board-title">布局区</h2>
              <p>拖拽行为会在后续任务中补齐，本任务先搭好分析壳层。</p>
            </div>
            <div className="pivot-layout-board__grid">
              {resolvedZoneFields.map((zone) => (
                <LayoutZone
                  key={zone.key}
                  zone={zone.key}
                  title={zone.title}
                  fields={zone.fields}
                />
              ))}
            </div>
            <EmptyState visible={!hasLayoutContent} />
          </section>
          <SettingsPanel />
        </section>
      </main>
    </DragProvider>
  );
}

export default PivotPage;
