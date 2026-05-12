import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import {
  listDataSources,
  type DataSource,
} from '../services/dataSources';

function DataSourcePage() {
  const navigate = useNavigate();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);

  useEffect(() => {
    let active = true;

    async function loadDataSources() {
      const result = await listDataSources();

      if (active) {
        setDataSources(result);
      }
    }

    void loadDataSources();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AppShell
      title="选择数据源"
      description="先选择业务模型，再继续进入透视分析。"
    >
      <div aria-label="数据源列表">
        {dataSources.map((source) => (
          <article key={source.id}>
            <h2>{source.name}</h2>
            <p>{source.description}</p>
            {source.selectable ? (
              <button
                type="button"
                aria-label={`进入${source.name}分析`}
                onClick={() => navigate(`/pivot/${source.id}`)}
              >
                进入分析
              </button>
            ) : (
              <button type="button" disabled>
                即将开放
              </button>
            )}
          </article>
        ))}
      </div>
    </AppShell>
  );
}

export default DataSourcePage;
