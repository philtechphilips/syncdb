import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedQuery {
  id: number;
  name: string;
  code: string;
}

interface QueryState {
  queries: SavedQuery[];
  activeQueryId: number;
  runRequested: number; // Increment this to trigger a run in the component
  setActiveQueryId: (id: number) => void;
  setQueries: (queries: SavedQuery[]) => void;
  updateActiveQueryCode: (code: string) => void;
  requestRun: () => void;
  addQuery: () => void;
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

      requestRun: () =>
        set((state) => ({ runRequested: state.runRequested + 1 })),

      addQuery: () =>
        set((state) => {
          const nextId = Math.max(...state.queries.map((q) => q.id)) + 1;
          const newQuery = {
            id: nextId,
            name: `query_${nextId}.sql`,
            code: "",
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
            const defaultQuery = { id: 1, name: "query_1.sql", code: "" };
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
