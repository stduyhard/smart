import { useEffect, useState } from 'react';
import AppShell from './components/layout/AppShell';
import DataSourcePage from './pages/DataSourcePage';
import LoginPage from './pages/LoginPage';
import { getCurrentSession } from './services/auth';

type RouteMatch =
  | { type: 'login' }
  | { type: 'sources' }
  | { type: 'pivot'; sourceId: string }
  | { type: 'notFound' };

function matchRoute(pathname: string): RouteMatch {
  if (pathname === '/') {
    return { type: 'login' };
  }

  if (pathname === '/sources') {
    return { type: 'sources' };
  }

  const pivotMatch = pathname.match(/^\/pivot\/([^/]+)$/);

  if (pivotMatch) {
    return { type: 'pivot', sourceId: pivotMatch[1] };
  }

  return { type: 'notFound' };
}

export function navigate(pathname: string, options?: { replace?: boolean }) {
  const method = options?.replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', pathname);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function RouterView() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    function handleRouteChange() {
      setPathname(window.location.pathname);
    }

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const route = matchRoute(pathname);
  const isAuthenticated = Boolean(getCurrentSession());
  const requiresAuth = route.type === 'sources' || route.type === 'pivot';

  useEffect(() => {
    if (requiresAuth && !isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, requiresAuth]);

  if (requiresAuth && !isAuthenticated) {
    return null;
  }

  if (route.type === 'login') {
    return <LoginPage onSuccess={() => navigate('/sources', { replace: true })} />;
  }

  if (route.type === 'sources') {
    return <DataSourcePage onSelectSource={(sourceId) => navigate(`/pivot/${sourceId}`)} />;
  }

  if (route.type === 'pivot') {
    return (
      <AppShell
        title={`透视分析: ${route.sourceId}`}
        description="数据源已选定，后续任务会补充指标和透视配置。"
      />
    );
  }

  return (
    <AppShell
      title="页面不存在"
      description="请返回登录页继续操作。"
      actions={
        <button type="button" onClick={() => navigate('/', { replace: true })}>
          返回登录
        </button>
      }
    />
  );
}

export default RouterView;
