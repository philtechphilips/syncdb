import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { getErrorMessage } from '@/lib/errorUtils';

export interface Cluster {
  id: string;
  name: string;
  type: 'mysql' | 'postgres';
  host: string;
  port: number;
  username: string;
  database: string;
}

interface ClusterState {
  clusters: Cluster[];
  selectedCluster: Cluster | null;
  isLoading: boolean;
  isTablesLoading: boolean;
  isDataLoading: boolean;
  error: string | null;
  tables: any[];
  tableData: any[];
  activeTab: "query" | "er" | "table" | "logs";
  selectedTable: string;
  fetchClusters: () => Promise<Cluster[]>;
  fetchTables: (clusterId: string) => Promise<any[]>;
  fetchTableData: (clusterId: string, tableName: string, page?: number, limit?: number) => Promise<any[]>;
  updateRow: (clusterId: string, tableName: string, data: any, where: any) => Promise<void>;
  selectCluster: (cluster: Cluster | null) => void;
  createCluster: (data: any) => Promise<Cluster>;
  testConnection: (data: any) => Promise<any>;
  deleteCluster: (id: string) => Promise<void>;
  setActiveTab: (tab: "query" | "er" | "table" | "logs") => void;
  setSelectedTable: (tableName: string) => void;
  clearError: () => void;
}

export const useClusterStore = create<ClusterState>()(
  persist(
    (set, get) => ({
      clusters: [],
      selectedCluster: null,
      tables: [],
      tableData: [],
      isLoading: false,
      isTablesLoading: false,
      isDataLoading: false,
      error: null,
      activeTab: "query",
      selectedTable: "",

      fetchClusters: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/v1/clusters');
          const clusters = response.data;
          
          const { selectedCluster } = get();
          let nextSelected = selectedCluster;
          
          // Clear if selected is not in the list
          if (selectedCluster && !clusters.find((c: Cluster) => c.id === selectedCluster.id)) {
            nextSelected = null;
          }

          // Auto-select if none and exactly one exists
          if (!nextSelected && clusters.length === 1) {
            nextSelected = clusters[0];
          }

          set({ clusters, selectedCluster: nextSelected, isLoading: false });
          return clusters;
        } catch (error: any) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      fetchTables: async (clusterId: string) => {
        set({ isTablesLoading: true, error: null });
        try {
          const response = await api.get(`/v1/clusters/${clusterId}/tables`);
          set({ tables: response.data, isTablesLoading: false });
          return response.data;
        } catch (error: any) {
          set({ isTablesLoading: false, error: getErrorMessage(error), tables: [] });
          throw error;
        }
      },

      fetchTableData: async (clusterId: string, tableName: string, page: number = 1, limit: number = 100) => {
        set({ isDataLoading: true, error: null });
        try {
          const response = await api.get(`/v1/clusters/${clusterId}/tables/${tableName}?page=${page}&limit=${limit}`);
          set({ tableData: response.data, isDataLoading: false });
          return response.data;
        } catch (error: any) {
          set({ isDataLoading: false, error: getErrorMessage(error), tableData: [] });
          throw error;
        }
      },

      updateRow: async (clusterId, tableName, data, where) => {
        set({ isDataLoading: true, error: null });
        try {
          await api.patch(`/v1/clusters/${clusterId}/tables/${tableName}/rows`, { data, where });
          // Update local state if successful
          const { tableData } = get();
          const updatedTableData = tableData.map(row => {
            // Simple match logic, assuming where is {id: val} or multiple keys
            const match = Object.keys(where).every(key => row[key] === where[key]);
            return match ? { ...row, ...data } : row;
          });
          set({ tableData: updatedTableData, isDataLoading: false });
        } catch (error: any) {
          set({ isDataLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      selectCluster: (cluster) => {
        set({ selectedCluster: cluster, tables: [], tableData: [] });
        if (cluster) {
          get().fetchTables(cluster.id);
        }
      },

      createCluster: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/v1/clusters', data);
          const newCluster = response.data;
          set((state) => ({ 
            clusters: [...state.clusters, newCluster],
            isLoading: false,
            selectedCluster: state.selectedCluster || newCluster // Select automatically if it's the first one
          }));
          return newCluster;
        } catch (error: any) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      testConnection: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/v1/clusters/test', data);
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      deleteCluster: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/v1/clusters/${id}`);
          set((state) => ({
            clusters: state.clusters.filter((c) => c.id !== id),
            selectedCluster: state.selectedCluster?.id === id ? null : state.selectedCluster,
            isLoading: false
          }));
        } catch (error: any) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedTable: (tableName) => set({ selectedTable: tableName }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'cluster-storage',
      partialize: (state) => ({ 
        selectedCluster: state.selectedCluster,
        activeTab: state.activeTab,
        selectedTable: state.selectedTable
      }),
    }
  )
);
