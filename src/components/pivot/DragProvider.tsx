import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import type { PropsWithChildren } from 'react';

type DragProviderProps = PropsWithChildren<{
  onDragEnd?: (event: DragEndEvent) => void;
}>;

function DragProvider({ children, onDragEnd }: DragProviderProps) {
  return (
    <div className="pivot-drag-provider">
      {onDragEnd ? (
        <DndContext onDragEnd={onDragEnd}>{children}</DndContext>
      ) : (
        children
      )}
    </div>
  );
}

export default DragProvider;
