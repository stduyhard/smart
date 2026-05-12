import type { PropsWithChildren } from 'react';

function DragProvider({ children }: PropsWithChildren) {
  return <div className="pivot-drag-provider">{children}</div>;
}

export default DragProvider;
