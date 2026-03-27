import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedQuery {
  id: number;
  name: string;
  code: string;
  persistentId?: string | null;
}

interface QueryState {
  queries: SavedQuery[];
  activeQueryId: number;
  runRequested: number;
  setActiveQueryId: (id: number) => void;
  setQueries: (queries: SavedQuery[]) => void;
  updateActiveQueryCode: (code: string) => void;
  updateActiveQueryPersistentId: (persistentId: string | null) => void;
  requestRun: () => void;
  addQuery: (initialData?: Partial<SavedQuery>) => void;
  removeQuery: (id: number) => void;
}

export const useQueryStore = create<QueryState>()(
  persist(
    (set) => ({
      queries: [
        {
          id: 1,
          name: "query_1.sql",
          code: "-- Select all active users\nSELECT * FROM users LIMIT 10;",
        },
      ],
      activeQueryId: 1,
      runRequested: 0,

      setActiveQueryId: (id) => set({ activeQueryId: id }),

      setQueries: (queries) => set({ queries }),

      updateActiveQueryCode: (code) =>
        set((state) => ({
          queries: state.queries.map((q) =>
            q.id === state.activeQueryId ? { ...q, code } : q,
          ),
        })),

      updateActiveQueryPersistentId: (persistentId) =>
        set((state) => ({
          queries: state.queries.map((q) =>
            q.id === state.activeQueryId ? { ...q, persistentId } : q,
          ),
        })),

      requestRun: () =>
        set((state) => ({ runRequested: state.runRequested + 1 })),

      addQuery: (initialData) =>
        set((state) => {
          const nextId =
            state.queries.length > 0
              ? Math.max(...state.queries.map((q) => q.id)) + 1
              : 1;
          const newQuery = {
            id: nextId,
            name: initialData?.name || `query_${nextId}.sql`,
            code: initialData?.code || "",
            persistentId: initialData?.persistentId || null,
          };
          return {
            queries: [...state.queries, newQuery],
            activeQueryId: nextId,
          };
        }),

      removeQuery: (id) =>
        set((state) => {
          const filtered = state.queries.filter((q) => q.id !== id);
          if (filtered.length === 0) {
            const defaultQuery = {
              id: 1,
              name: "query_1.sql",
              code: "",
              persistentId: null,
            };
            return { queries: [defaultQuery], activeQueryId: 1 };
          }
          return {
            queries: filtered,
            activeQueryId:
              state.activeQueryId === id ? filtered[0].id : state.activeQueryId,
          };
        }),
    }),
    {
      name: "query-storage",
      partialize: (state) => ({
        queries: state.queries,
        activeQueryId: state.activeQueryId,
      }),
    },
  ),
);
