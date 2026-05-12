import { Link, Navigate, Outlet, type RouteObject } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import DataSourcePage from './pages/DataSourcePage';
import LoginPage from './pages/LoginPage';
import PivotPage from './pages/PivotPage';
import { getCurrentSession } from './services/auth';

function RequireAuth() {
  if (!getCurrentSession()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
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
        element: <PivotPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
