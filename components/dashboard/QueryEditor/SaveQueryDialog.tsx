"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Tag, Folder, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedQueryStore } from "@/store/useSavedQueryStore";
import { toast } from "sonner";
import { useClusterStore } from "@/store/useClusterStore";
import { useQueryStore } from "@/store/useQueryStore";

interface SaveQueryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  queryCode: string;
  persistentId?: string | null;
}

const SaveQueryDialog: React.FC<SaveQueryDialogProps> = ({ 
  isOpen, 
  onClose, 
  queryCode,
  persistentId
}) => {
  const { 
    saveQuery, 
    updateSavedQuery,
    fetchCollections, 
    collections, 
    savedQueries,
    createCollection,
    isLoading 
  } = useSavedQueryStore();
  const { selectedCluster } = useClusterStore();
  const { updateActiveQueryPersistentId } = useQueryStore();

  const [name, setName] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
      
      if (persistentId) {
        const existing = savedQueries.find(q => q.id === persistentId);
        if (existing) {
          setName(existing.name);
          setCollectionId(existing.collectionId || "");
          setTags(existing.tags || []);
        }
      } else {
        setName(`Query ${new Date().toLocaleDateString()}`);
        setCollectionId("");
        setTags([]);
      }
    }
  }, [isOpen, fetchCollections, persistentId, savedQueries]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Please enter a name");
    
    try {
      if (persistentId) {
        await updateSavedQuery(persistentId, {
          name,
          query: queryCode,
          collectionId: collectionId || undefined,
          tags
        });
        toast.success("Query updated successfully");
      } else {
        const newQuery = await saveQuery({
          name,
          query: queryCode,
          clusterId: selectedCluster?.id,
          collectionId: collectionId || undefined,
          tags
        });
        updateActiveQueryPersistentId(newQuery.id);
        toast.success("Query saved successfully");
      }
      onClose();
      // Reset only if not persistent (or always)
      setName("");
      setCollectionId("");
      setTags([]);
    } catch {
      toast.error(persistentId ? "Failed to update query" : "Failed to save query");
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderInput.trim()) {
      setIsAddingFolder(false);
      return;
    }

    try {
      const newCol = await createCollection({ name: newFolderInput.trim() });
      toast.success(`Folder "${newFolderInput}" created`);
      setCollectionId(newCol.id);
      setIsAddingFolder(false);
      setNewFolderInput("");
      await fetchCollections();
    } catch {
      toast.error("Failed to create folder");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="relative w-full max-w-md bg-zinc-950/90 border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6">
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Save size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{persistentId ? "Update Query" : "Save Query"}</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Persistent Storage</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Query Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sales Report"
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm text-zinc-300 focus:outline-none focus:border-primary/30 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Collection (Optional)</label>
            <div className="relative group">
              <Folder size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <div className="flex gap-2">
                <select 
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                  className="flex-1 appearance-none bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-primary/30 transition-all font-medium cursor-pointer"
                >
                  <option value="">No Collection</option>
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setIsAddingFolder(!isAddingFolder)}
                  className="px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-zinc-400 hover:text-primary transition-all"
                  title="New Collection"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            {isAddingFolder && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 mt-2 bg-white/5 border border-primary/20 p-2 rounded-xl"
              >
                <input 
                  autoFocus
                  type="text"
                  value={newFolderInput}
                  onChange={(e) => setNewFolderInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolder();
                    if (e.key === "Escape") setIsAddingFolder(false);
                  }}
                  placeholder="New collection name..."
                  className="flex-1 bg-transparent border-none text-xs text-white outline-none placeholder:text-zinc-600 px-2"
                />
                <button 
                  onClick={handleCreateFolder}
                  className="p-1 px-2.5 bg-primary text-black rounded-lg text-[10px] font-black uppercase tracking-widest"
                >
                  Create
                </button>
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Tags (Enter to add)</label>
            <div className="relative">
              <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="analytics, debug, report..."
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-primary/30 transition-all font-medium"
              />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map(tag => (
                  <span 
                    key={tag} 
                    className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isLoading || !name.trim()}
            className="px-8 py-2.5 bg-primary text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_-5px_rgba(255,188,27,0.3)] hover:shadow-[0_8px_30px_-5px_rgba(255,188,27,0.4)]"
          >
            {isLoading ? "Saving..." : persistentId ? "Update Query" : "Save Query"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SaveQueryDialog;
