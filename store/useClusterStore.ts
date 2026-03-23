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
  totalRows: number;
  currentPage: number;
  rowsPerPage: number;
  activeTab: "query" | "er" | "table" | "logs" | "sync";
  selectedTable: string;
  fetchClusters: () => Promise<Cluster[]>;
  fetchTables: (clusterId: string) => Promise<any[]>;
  fetchTableColumns: (clusterId: string, tableName: string) => Promise<any[]>;
  fetchTableData: (clusterId: string, tableName: string, page?: number, limit?: number, filters?: any[]) => Promise<any[]>;
  updateRow: (clusterId: string, tableName: string, data: any, where: any) => Promise<void>;
  insertRow: (clusterId: string, tableName: string, data: any) => Promise<void>;
  deleteRows: (clusterId: string, tableName: string, where: any) => Promise<void>;
  deleteRowsBulk: (clusterId: string, tableName: string, rows: any[]) => Promise<void>;
  selectCluster: (cluster: Cluster | null) => void;
  createCluster: (data: any) => Promise<Cluster>;
  testConnection: (data: any) => Promise<any>;
  deleteCluster: (id: string) => Promise<void>;
  setActiveTab: (tab: "query" | "er" | "table" | "logs" | "sync") => void;
  setSelectedTable: (tableName: string) => void;
  clearError: () => void;
  fetchSchema: (clusterId: string) => Promise<any[]>;
  executeQuery: (clusterId: string, query: string) => Promise<any>;
  fetchQueryLogs: (clusterId: string) => Promise<any[]>;
  dropTable: (clusterId: string, tableName: string) => Promise<void>;
  backup: (clusterId: string, format: 'sql' | 'csv' | 'json') => Promise<any>;
  restore: (clusterId: string, format: 'sql' | 'csv' | 'json', data: any) => Promise<void>;
}

export const useClusterStore = create<ClusterState>()(
  persist(
    (set, get) => ({
      clusters: [],
      selectedCluster: null,
      tables: [],
      tableData: [],
      totalRows: 0,
      currentPage: 1,
      rowsPerPage: 100,
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
          const clusters = (response.data || []).sort((a: Cluster, b: Cluster) => a.name.localeCompare(b.name));
          
          const { selectedCluster } = get();
          let nextSelected = selectedCluster;
          
          if (selectedCluster && !clusters.find((c: Cluster) => c.id === selectedCluster.id)) {
            nextSelected = null;
          }

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
          const sortedTables = (response.data || []).sort((a: any, b: any) => a.name.localeCompare(b.name));
          set({ tables: sortedTables, isTablesLoading: false });
          return sortedTables;
        } catch (error: any) {
          set({ isTablesLoading: false, error: getErrorMessage(error), tables: [] });
          throw error;
        }
      },

      fetchTableColumns: async (clusterId: string, tableName: string) => {
        try {
          const response = await api.get(`/v1/clusters/${clusterId}/tables/${tableName}/columns`);
          return response.data;
        } catch (error: any) {
          set({ error: getErrorMessage(error) });
          throw error;
        }
      },

      fetchTableData: async (clusterId: string, tableName: string, page: number = 1, limit: number = 100, filters: any[] = []) => {
        set({ isDataLoading: true, error: null });
        try {
          const filterParam = filters.length > 0 ? `&filters=${encodeURIComponent(JSON.stringify(filters))}` : '';
          const response = await api.get(`/v1/clusters/${clusterId}/tables/${tableName}?page=${page}&limit=${limit}${filterParam}`);
          const { data, total, page: resPage, limit: resLimit } = response.data;
          
          set({ 
            tableData: data, 
            totalRows: total, 
            currentPage: resPage, 
            rowsPerPage: resLimit, 
            isDataLoading: false 
          });
          return data;
        } catch (error: any) {
          set({ isDataLoading: false, error: getErrorMessage(error), tableData: [], totalRows: 0 });
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

      insertRow: async (clusterId, tableName, data) => {
        set({ isDataLoading: true, error: null });
        try {
          const res = await api.post(`/v1/clusters/${clusterId}/tables/${tableName}`, data);
          const newRow = res.data;
          set((state) => ({ 
            tableData: [newRow, ...state.tableData],
            totalRows: state.totalRows + 1,
            isDataLoading: false 
          }));
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message, isDataLoading: false });
          throw error;
        }
      },

      deleteRows: async (clusterId, tableName, where) => {
        set({ isDataLoading: true, error: null });
        try {
          await api.delete(`/v1/clusters/${clusterId}/tables/${tableName}/rows`, { data: { where } });
          const { tableData } = get();
          const filteredData = tableData.filter(row => {
            const match = Object.keys(where).every(key => row[key] === where[key]);
            return !match;
          });
          set((state) => ({ 
            tableData: filteredData, 
            totalRows: Math.max(0, state.totalRows - 1),
            isDataLoading: false 
          }));
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message, isDataLoading: false });
          throw error;
        }
      },

      deleteRowsBulk: async (clusterId: string, tableName: string, selectedRows: any[]) => {
        if (selectedRows.length === 0) return;
        set({ isDataLoading: true, error: null });
        try {
          // Send all deletes in parallel
          // In a real production app, we would have a dedicated bulk DELETE endpoint
          await Promise.all(selectedRows.map((row: any) => 
            api.delete(`/v1/clusters/${clusterId}/tables/${tableName}/rows`, { 
              data: { where: { id: row.id } } 
            })
          ));

          const idsToDelete = selectedRows.map((r: any) => r.id);
          const { tableData } = get();
          const filteredData = tableData.filter(row => !idsToDelete.includes(row.id));
          
          set((state) => ({ 
            tableData: filteredData, 
            totalRows: Math.max(0, state.totalRows - idsToDelete.length),
            isDataLoading: false 
          }));
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message, isDataLoading: false });
          throw error;
        }
      },

      selectCluster: (cluster) => {
        set({ selectedCluster: cluster, tables: [], tableData: [], totalRows: 0, currentPage: 1 });
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

      fetchSchema: async (clusterId: string) => {
        try {
          const response = await api.get(`/v1/clusters/${clusterId}/schema`);
          return response.data || [];
        } catch (error: any) {
          set({ error: getErrorMessage(error) });
          throw error;
        }
      },

      executeQuery: async (clusterId: string, query: string) => {
        try {
          const response = await api.post(`/v1/clusters/${clusterId}/query`, { query });
          return response.data;
        } catch (error: any) {
          const message = getErrorMessage(error);
          set({ error: message });
          throw error;
        }
      },

      fetchQueryLogs: async (clusterId: string) => {
        try {
          const response = await api.get(`/v1/clusters/${clusterId}/query/logs`);
          return response.data;
        } catch (error: any) {
          const message = getErrorMessage(error);
          set({ error: message });
          throw error;
        }
      },
      
      dropTable: async (clusterId: string, tableName: string) => {
        set({ isTablesLoading: true, error: null });
        try {
          await api.delete(`/v1/clusters/${clusterId}/tables/${tableName}`);
          set((state) => ({
            tables: state.tables.filter((t) => t.name !== tableName),
            selectedTable: state.selectedTable === tableName ? "" : state.selectedTable,
            isTablesLoading: false
          }));
        } catch (error: any) {
          const message = getErrorMessage(error);
          set({ error: message, isTablesLoading: false });
          throw error;
        }
      },

      backup: async (clusterId: string, format: 'sql' | 'csv' | 'json') => {
        set({ isDataLoading: true, error: null });
        try {
          const response = await api.get(`/v1/clusters/${clusterId}/backup`, { params: { format } });
          set({ isDataLoading: false });
          return response.data;
        } catch (error: any) {
          const message = getErrorMessage(error);
          set({ error: message, isDataLoading: false });
          throw error;
        }
      },

      restore: async (clusterId: string, format: 'sql' | 'csv' | 'json', data: any) => {
        set({ isDataLoading: true, error: null });
        try {
          await api.post(`/v1/clusters/${clusterId}/restore`, { format, data });
          await get().fetchTables(clusterId);
          set({ isDataLoading: false });
        } catch (error: any) {
          const message = getErrorMessage(error);
          set({ error: message, isDataLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'cluster-storage',
      partialize: (state: ClusterState) => ({ 
        selectedCluster: state.selectedCluster,
        activeTab: state.activeTab,
        selectedTable: state.selectedTable
      }),
    }
  )
);
