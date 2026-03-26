"use client";

import React, { useEffect, useState } from "react";
import { 
  Folder, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  MoreVertical,
  Trash2,
  Edit2,
  Search,
  Tag,
  FolderPlus,
  Check,
  X as CloseIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedQueryStore, Collection, SavedQuery } from "@/store/useSavedQueryStore";
import { useQueryStore } from "@/store/useQueryStore";
import { toast } from "sonner";
import { useClusterStore } from "@/store/useClusterStore";
import { useModalStore } from "@/store/useModalStore";

interface SavedQueriesSidebarProps {
  onLoadQuery: (query: SavedQuery) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SavedQueriesSidebar: React.FC<SavedQueriesSidebarProps> = ({ 
  onLoadQuery, 
  isOpen, 
  onClose 
}) => {
  const { 
    collectionTree, 
    fetchCollectionTree, 
    savedQueries,
    fetchSavedQueries,
    deleteSavedQuery, 
    deleteCollection,
    createCollection,
    isLoading 
  } = useSavedQueryStore();
  
  const { addQuery, setActiveQueryId, queries, setQueries } = useQueryStore();
  const { clusters } = useClusterStore();
  const { open: openModal } = useModalStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isAddingRootFolder, setIsAddingRootFolder] = useState(false);
  const [addingToFolderId, setAddingToFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    fetchCollectionTree();
    fetchSavedQueries();
  }, [fetchCollectionTree, fetchSavedQueries]);

  const toggleFolder = (id: string) => {
    const next = new Set(expandedFolders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedFolders(next);
  };

  const handleCreateRootFolder = async () => {
    setIsAddingRootFolder(true);
    setAddingToFolderId(null);
    setNewFolderName("");
  };

  const submitFolder = async (parentId: string | null = null) => {
    if (!newFolderName.trim()) {
      setIsAddingRootFolder(false);
      setAddingToFolderId(null);
      return;
    }

    try {
      await createCollection({ 
        name: newFolderName.trim(), 
        parentId: parentId || undefined 
      });
      toast.success("Folder created");
      setIsAddingRootFolder(false);
      setAddingToFolderId(null);
      setNewFolderName("");
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  const handleDeleteQuery = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    openModal({
      title: "Delete Saved Query",
      message: "Are you sure you want to delete this saved query? This action cannot be undone.",
      type: "danger",
      confirmLabel: "Delete Query",
      onConfirm: async () => {
        await deleteSavedQuery(id);
        toast.success("Query deleted");
      }
    });
  };

  const handleDeleteCollection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    openModal({
      title: "Delete Folder",
      message: "Are you sure you want to delete this folder and all its contents? This action cannot be undone.",
      confirmLabel: "Delete Folder",
      type: "danger",
      onConfirm: async () => {
        await deleteCollection(id);
        toast.success("Folder deleted");
      }
    });
  };

  const renderCollection = (collection: Collection, depth = 0) => {
    const isExpanded = expandedFolders.has(collection.id);
    const hasChildren = (collection.children && collection.children.length > 0) || 
                      (collection.queries && collection.queries.length > 0);

    return (
      <div key={collection.id} className="select-none">
        <div 
          onClick={() => toggleFolder(collection.id)}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 cursor-pointer rounded-md transition-colors group"
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          {isExpanded ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
          <Folder size={14} className="text-primary/70" />
          <span className="text-xs font-medium text-zinc-300 flex-1 truncate">{collection.name}</span>
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            <button 
              onClick={async (e) => {
                e.stopPropagation();
                setAddingToFolderId(collection.id);
                setIsAddingRootFolder(false);
                setNewFolderName("");
                if (!isExpanded) toggleFolder(collection.id);
              }}
              className="p-1 hover:bg-white/10 rounded text-zinc-500 hover:text-white"
            >
              <Plus size={12} />
            </button>
            <button 
              onClick={(e) => handleDeleteCollection(e, collection.id)}
              className="p-1 hover:bg-white/10 rounded text-zinc-600 hover:text-red-400"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {addingToFolderId === collection.id && (
                <div 
                  className="flex items-center gap-2 px-3 py-1.5"
                  style={{ paddingLeft: `${(depth + 1) * 12 + 12}px` }}
                >
                  <Folder size={14} className="text-primary/70 animate-pulse" />
                  <input 
                    autoFocus
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitFolder(collection.id);
                      if (e.key === "Escape") setAddingToFolderId(null);
                    }}
                    onBlur={() => submitFolder(collection.id)}
                    placeholder="Folder name..."
                    className="bg-transparent border-none text-xs text-white outline-none w-full placeholder:text-zinc-600"
                  />
                </div>
              )}
              {collection.children?.map(child => renderCollection(child, depth + 1))}
              {collection.queries?.map(query => renderQuery(query, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderQuery = (query: SavedQuery, depth = 0) => {
    return (
      <div 
        key={query.id}
        onClick={() => {
          onLoadQuery(query);
          // Also set the query name if possible
          toast.info(`Loaded: ${query.name}`);
        }}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 cursor-pointer rounded-md transition-colors group"
        style={{ paddingLeft: `${depth * 12 + 28}px` }}
      >
        <FileText size={14} className="text-zinc-500" />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs text-zinc-400 truncate">{query.name}</span>
          {query.tags && query.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {query.tags.map(tag => (
                <span key={tag} className="px-1 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-[2px] text-[8px] uppercase tracking-tighter">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={(e) => handleDeleteQuery(e, query.id)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-zinc-600 hover:text-red-400"
        >
          <Trash2 size={12} />
        </button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col h-full z-20"
    >
      <div className="p-4 border-bottom border-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          Collections
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCreateRootFolder}
            className="p-1 px-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 hover:text-white transition-all"
          >
            <FolderPlus size={10} />
            Folder
          </button>
        </div>
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-md py-1.5 pl-9 pr-4 text-xs text-zinc-300 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading && collectionTree.length === 0 ? (
          <div className="p-4 text-center">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Loading...</span>
          </div>
        ) : (
          <>
            {collectionTree.length === 0 && (
              <div className="p-4 text-center py-10 opacity-30">
                <Folder size={32} className="mx-auto mb-2 text-zinc-500" />
                <p className="text-[10px] uppercase font-bold tracking-widest">No saved queries</p>
              </div>
            )}
            {isAddingRootFolder && (
              <div 
                className="flex items-center gap-2 px-3 py-1.5"
                style={{ paddingLeft: `12px` }}
              >
                <Folder size={14} className="text-primary/70 animate-pulse" />
                <input 
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitFolder(null);
                    if (e.key === "Escape") setIsAddingRootFolder(false);
                  }}
                  onBlur={() => submitFolder(null)}
                  placeholder="Root folder name..."
                  className="bg-transparent border-none text-xs text-white outline-none w-full placeholder:text-zinc-600"
                />
              </div>
            )}
            {collectionTree.map(collection => renderCollection(collection))}
            {savedQueries.filter(q => {
              if (q.collectionId) return false;
              if (!searchTerm) return true;
              const matchesName = q.name.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesTags = q.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
              return matchesName || matchesTags;
            }).length > 0 && (
              <div className="mt-4 border-t border-white/5 pt-4">
                <h4 className="px-3 text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Uncategorized</h4>
                {savedQueries
                  .filter(q => {
                    if (q.collectionId) return false;
                    if (!searchTerm) return true;
                    const matchesName = q.name.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesTags = q.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
                    return matchesName || matchesTags;
                  })
                  .map(query => renderQuery(query))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-4 border-t border-white/5 flex items-center justify-between">
         <button 
          onClick={onClose}
          className="text-[9px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest"
        >
          Close Sidebar
        </button>
      </div>
    </motion.div>
  );
};

export default SavedQueriesSidebar;
