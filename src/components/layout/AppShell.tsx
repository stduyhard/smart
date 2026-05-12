import type { PropsWithChildren, ReactNode } from 'react';

type AppShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}>;

function AppShell({
  eyebrow = 'Smartbi Pivot',
  title,
  description,
  actions,
  children,
}: AppShellProps) {
  return (
    <main className="app-shell">
      <section className="login-card">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
        <div>{children}</div>
        {actions ? <div>{actions}</div> : null}
      </section>
    </main>
  );
}

export default AppShell;
