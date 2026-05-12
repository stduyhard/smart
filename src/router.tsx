import {
  Link,
  Navigate,
  Outlet,
  type RouteObject,
  useParams,
} from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import DataSourcePage from './pages/DataSourcePage';
import LoginPage from './pages/LoginPage';
import { getCurrentSession } from './services/auth';
import { getDataSourceById, isPivotSourceAvailable } from './services/dataSources';

function RequireAuth() {
  if (!getCurrentSession()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function PivotEntryPage() {
  const { sourceId } = useParams();

  if (!sourceId || !isPivotSourceAvailable(sourceId)) {
    return (
      <AppShell
        title="数据源不存在"
        description="请返回数据源列表并选择有效的业务模型。"
        actions={<NavigateButton to="/sources" label="返回数据源" />}
      />
    );
  }

  const source = getDataSourceById(sourceId);

  return (
    <AppShell
      title={`透视分析: ${source?.id}`}
      description="数据源已选定，后续任务会补充指标和透视配置。"
    />
  );
}

function NotFoundPage() {
  return (
    <AppShell
      title="页面不存在"
      description="请返回登录页继续操作。"
      actions={<NavigateButton to="/" label="返回登录" />}
    />
  );
}

type RouteLinkProps = {
  to: string;
  label: string;
};

function NavigateButton({ to, label }: RouteLinkProps) {
  return (
    <Link to={to}>
      {label}
    </Link>
  );
}

export const routerConfig: RouteObject[] = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/sources',
        element: <DataSourcePage />,
      },
      {
        path: '/pivot/:sourceId',
        element: <PivotEntryPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
