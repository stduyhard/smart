import { Link, useParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import DragProvider from '../components/pivot/DragProvider';
import EmptyState from '../components/pivot/EmptyState';
import FieldPanel from '../components/pivot/FieldPanel';
import LayoutZone from '../components/pivot/LayoutZone';
import SettingsPanel from '../components/pivot/SettingsPanel';
import Toolbar from '../components/pivot/Toolbar';
import { pivotSourceRegistry, type PivotSourceId } from '../data/orderModel';
import { getDataSourceById, isPivotSourceAvailable } from '../services/dataSources';
import { usePivotStore } from '../store/pivotStore';

const zoneDefinitions = [
  { key: 'rows', title: '行', type: 'dimension' },
  { key: 'columns', title: '列', type: 'dimension' },
  { key: 'measures', title: '度量', type: 'measure' },
  { key: 'filters', title: '过滤条件', type: 'dimension' },
] as const;

function PivotPage() {
  const { sourceId } = useParams();

  if (!sourceId || !isPivotSourceAvailable(sourceId) || !(sourceId in pivotSourceRegistry)) {
    return (
      <AppShell
        title="数据源不存在"
        description="请返回数据源列表并选择有效的业务模型。"
        actions={<Link to="/sources">返回数据源</Link>}
      />
    );
  }

  const resolvedSourceId = sourceId as PivotSourceId;
  const source = getDataSourceById(resolvedSourceId);
  const sourceState = usePivotStore((state) => state.getSourceState(resolvedSourceId));
  const resetLayout = usePivotStore((state) => state.resetLayout);

  return (
    <DragProvider>
      <main className="pivot-page">
        <section className="pivot-page__hero">
          <p className="eyebrow">Smartbi Pivot</p>
          <h1>透视分析: {resolvedSourceId}</h1>
          <p>{source?.description}</p>
        </section>
        <Toolbar
          sourceName={source?.name ?? resolvedSourceId}
          onReset={() => resetLayout(resolvedSourceId)}
        />
        <section className="pivot-page__workspace">
          <FieldPanel sourceId={resolvedSourceId} />
          <section className="pivot-panel pivot-layout-board" aria-labelledby="pivot-layout-board-title">
            <div className="pivot-panel__header">
              <h2 id="pivot-layout-board-title">布局区</h2>
              <p>拖拽行为会在后续任务中补齐，本任务先搭好分析壳层。</p>
            </div>
            <div className="pivot-layout-board__grid">
              {zoneDefinitions.map((zone) => (
                <LayoutZone
                  key={zone.key}
                  title={zone.title}
                  items={sourceState.layout[zone.key]}
                  type={zone.type}
                />
              ))}
            </div>
            <EmptyState />
          </section>
          <SettingsPanel />
        </section>
      </main>
    </DragProvider>
  );
}

export default PivotPage;
