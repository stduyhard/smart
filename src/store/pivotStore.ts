import { useSyncExternalStore } from 'react';
import type { PivotLayout, PivotZone } from '../types/pivot';

export interface PivotState {
  layout: PivotLayout;
  expandedKeys: string[];
  addFieldToZone: (field: string, zone: PivotZone) => void;
  resetLayout: () => void;
}

type Listener = () => void;
type Selector<T> = (state: PivotState) => T;
type PivotStoreHook = {
  (): PivotState;
  <T>(selector: Selector<T>): T;
  getState: () => PivotState;
  setState: (
    nextState:
      | PivotState
      | Partial<PivotState>
      | ((state: PivotState) => PivotState | Partial<PivotState>),
  ) => void;
  subscribe: (listener: Listener) => () => void;
};

const emptyLayout: PivotLayout = {
  rows: [],
  columns: [],
  measures: [],
  filters: [],
};

function cloneLayout(layout: PivotLayout): PivotLayout {
  return {
    rows: [...layout.rows],
    columns: [...layout.columns],
    measures: [...layout.measures],
    filters: [...layout.filters],
  };
}

function createInitialState(): PivotState {
  return {
    layout: cloneLayout(emptyLayout),
    expandedKeys: [],
    addFieldToZone: (field, zone) => {
      usePivotStore.setState((state) => {
        const nextZone = state.layout[zone].includes(field)
          ? state.layout[zone]
          : [...state.layout[zone], field];

        return {
          layout: {
            ...state.layout,
            [zone]: nextZone,
          },
        };
      });
    },
    resetLayout: () => {
      usePivotStore.setState({
        layout: cloneLayout(emptyLayout),
        expandedKeys: [],
      });
    },
  };
}

function createPivotStore(): PivotStoreHook {
  const listeners = new Set<Listener>();
  let state = createInitialState();

  const getState = () => state;

  const setState: PivotStoreHook['setState'] = (nextState) => {
    const partialState =
      typeof nextState === 'function' ? nextState(state) : nextState;

    state = {
      ...state,
      ...partialState,
    };

    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  function useStore<T>(selector?: Selector<T>) {
    return useSyncExternalStore(
      subscribe,
      () => {
        const snapshot = getState();
        return selector ? selector(snapshot) : (snapshot as T);
      },
      () => {
        const snapshot = getState();
        return selector ? selector(snapshot) : (snapshot as T);
      },
    );
  }

  useStore.getState = getState;
  useStore.setState = setState;
  useStore.subscribe = subscribe;

  return useStore as PivotStoreHook;
}

export const usePivotStore = createPivotStore();
