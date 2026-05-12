import { useSyncExternalStore } from 'react';
import { orderFieldMap, type OrderFieldKey } from '../data/orderModel';
import type { PivotLayout, PivotZone } from '../types/pivot';

export interface PivotSourceState<FieldKey extends string = OrderFieldKey> {
  layout: PivotLayout<FieldKey>;
  expandedKeys: string[];
}

export interface PivotState {
  sourceStates: Record<string, PivotSourceState>;
  addFieldToZone: (sourceId: string, field: OrderFieldKey, zone: PivotZone) => void;
  getSourceState: (sourceId: string) => PivotSourceState;
  resetLayout: (sourceId: string) => void;
  setExpandedKeys: (sourceId: string, expandedKeys: string[]) => void;
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

const emptyLayout: PivotLayout<OrderFieldKey> = {
  rows: [],
  columns: [],
  measures: [],
  filters: [],
};

function cloneLayout(layout: PivotLayout<OrderFieldKey>): PivotLayout<OrderFieldKey> {
  return {
    rows: [...layout.rows],
    columns: [...layout.columns],
    measures: [...layout.measures],
    filters: [...layout.filters],
  };
}

function createEmptySourceState(): PivotSourceState {
  return {
    layout: cloneLayout(emptyLayout),
    expandedKeys: [],
  };
}

const defaultSourceState: PivotSourceState = createEmptySourceState();

function ensureSourceState(
  sourceStates: Record<string, PivotSourceState>,
  sourceId: string,
): PivotSourceState {
  return sourceStates[sourceId] ?? createEmptySourceState();
}

function removeFieldFromLayout(
  layout: PivotLayout<OrderFieldKey>,
  field: OrderFieldKey,
): PivotLayout<OrderFieldKey> {
  return {
    rows: layout.rows.filter((item) => item !== field),
    columns: layout.columns.filter((item) => item !== field),
    measures: layout.measures.filter((item) => item !== field),
    filters: layout.filters.filter((item) => item !== field),
  };
}

function createInitialState(): PivotState {
  return {
    sourceStates: {},
    addFieldToZone: (sourceId, field, zone) => {
      usePivotStore.setState((state) => {
        const fieldConfig = orderFieldMap[field];
        const allowedZones = fieldConfig.allowedZones as readonly PivotZone[];
        const currentSourceState = ensureSourceState(state.sourceStates, sourceId);
        const nextSourceStates = {
          ...state.sourceStates,
          [sourceId]: currentSourceState,
        };

        if (!allowedZones.includes(zone)) {
          return {
            sourceStates: nextSourceStates,
          };
        }

        const nextLayout = removeFieldFromLayout(currentSourceState.layout, field);
        const nextZoneItems = nextLayout[zone].includes(field)
          ? nextLayout[zone]
          : [...nextLayout[zone], field];

        return {
          sourceStates: {
            ...state.sourceStates,
            [sourceId]: {
              ...currentSourceState,
              layout: {
                ...nextLayout,
                [zone]: nextZoneItems,
              },
            },
          },
        };
      });
    },
    getSourceState: (sourceId) => {
      return usePivotStore.getState().sourceStates[sourceId] ?? defaultSourceState;
    },
    resetLayout: (sourceId) => {
      usePivotStore.setState({
        sourceStates: {
          ...usePivotStore.getState().sourceStates,
          [sourceId]: createEmptySourceState(),
        },
      });
    },
    setExpandedKeys: (sourceId, expandedKeys) => {
      usePivotStore.setState((state) => {
        const currentSourceState = ensureSourceState(state.sourceStates, sourceId);

        return {
          sourceStates: {
            ...state.sourceStates,
            [sourceId]: {
              ...currentSourceState,
              expandedKeys: [...expandedKeys],
            },
          },
        };
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
