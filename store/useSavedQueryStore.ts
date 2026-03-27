import { create } from "zustand";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errorUtils";

export interface SavedQuery {
  id: string;
  name: string;
  query: string;
  clusterId?: string;
  collectionId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  parentId?: string;
  children?: Collection[];
  queries?: SavedQuery[];
}

interface SavedQueryState {
  savedQueries: SavedQuery[];
  collections: Collection[];
  collectionTree: Collection[];
  isLoading: boolean;
  error: string | null;

  fetchSavedQueries: () => Promise<SavedQuery[]>;
  fetchCollections: () => Promise<Collection[]>;
  fetchCollectionTree: () => Promise<Collection[]>;

  saveQuery: (data: Partial<SavedQuery>) => Promise<SavedQuery>;
  updateSavedQuery: (
    id: string,
    data: Partial<SavedQuery>,
  ) => Promise<SavedQuery>;
  deleteSavedQuery: (id: string) => Promise<void>;

  createCollection: (data: Partial<Collection>) => Promise<Collection>;
  updateCollection: (
    id: string,
    data: Partial<Collection>,
  ) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
}

export const useSavedQueryStore = create<SavedQueryState>((set, get) => ({
  savedQueries: [],
  collections: [],
  collectionTree: [],
  isLoading: false,
  error: null,

  fetchSavedQueries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/v1/query-management/queries");
      set({ savedQueries: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  fetchCollections: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/v1/query-management/collections");
      set({ collections: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  fetchCollectionTree: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/v1/query-management/collections/tree");
      set({ collectionTree: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  saveQuery: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/v1/query-management/queries", data);
      const newQuery = response.data;
      set((state) => ({
        savedQueries: [newQuery, ...state.savedQueries],
        isLoading: false,
      }));
      await get().fetchCollectionTree();
      return newQuery;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  updateSavedQuery: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(
        `/v1/query-management/queries/${id}`,
        data,
      );
      const updatedQuery = response.data;
      set((state) => ({
        savedQueries: state.savedQueries.map((q) =>
          q.id === id ? updatedQuery : q,
        ),
        isLoading: false,
      }));
      await get().fetchCollectionTree();
      return updatedQuery;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  deleteSavedQuery: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/v1/query-management/queries/${id}`);
      set((state) => ({
        savedQueries: state.savedQueries.filter((q) => q.id !== id),
        isLoading: false,
      }));
      await get().fetchCollectionTree();
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  createCollection: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/v1/query-management/collections", data);
      const newCollection = response.data;
      set((state) => ({
        collections: [...state.collections, newCollection],
        isLoading: false,
      }));
      await get().fetchCollectionTree();
      return newCollection;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  updateCollection: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(
        `/v1/query-management/collections/${id}`,
        data,
      );
      const updatedCollection = response.data;
      set((state) => ({
        collections: state.collections.map((c) =>
          c.id === id ? updatedCollection : c,
        ),
        isLoading: false,
      }));
      await get().fetchCollectionTree();
      return updatedCollection;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  deleteCollection: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/v1/query-management/collections/${id}`);
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== id),
        isLoading: false,
      }));
      await get().fetchCollectionTree();
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },
}));
