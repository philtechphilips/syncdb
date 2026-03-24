"use client";

import React, { useState, useEffect, useCallback } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { format } from "sql-formatter";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { useClusterStore } from "@/store/useClusterStore";
import api from "@/lib/api";
import { useModalStore } from "@/store/useModalStore";
import { useQueryStore } from "@/store/useQueryStore";

// Sub-components
import QueryTabs from "./QueryEditor/QueryTabs";
import AiAssistantBar from "./QueryEditor/AiAssistantBar";
import EditorActions from "./QueryEditor/EditorActions";
import QueryResultsArea from "./QueryEditor/QueryResultsArea";

const QueryEditor = () => {
  const { selectedCluster, executeQuery, fetchSchema, fetchQueryLogs } =
    useClusterStore();
  const { open: openModal } = useModalStore();
  const monaco = useMonaco();

  const {
    queries,
    activeQueryId,
    setActiveQueryId,
    setQueries,
    updateActiveQueryCode,
    runRequested,
  } = useQueryStore();
  const [queryResults, setQueryResults] = useState<
    Record<string, unknown>[] | Record<string, unknown> | null
  >(null);
  const [isRunning, setIsRunning] = useState(false);
  const [schemaMetadata, setSchemaMetadata] = useState<
    { tableName?: string; table_name?: string; name: string }[]
  >([]);
  const [bottomTab, setBottomTab] = useState<"results" | "history">("results");
  const [queryHistory, setQueryHistory] = useState<
    {
      id: string;
      query: string;
      success: boolean;
      executionTimeMs: number;
      createdAt: string;
    }[]
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // UI/AI State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMode, setAiMode] = useState<"generate" | "explain" | "optimize">(
    "generate",
  );
  const [explainLevel, setExplainLevel] = useState<"simple" | "advanced">(
    "simple",
  );
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const handledRunId = React.useRef(runRequested);
  const editorRef = React.useRef<any>(null);

  const activeQuery = queries.find((q) => q.id === activeQueryId) || queries[0];

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  // Autocomplete Setup
  useEffect(() => {
    if (selectedCluster)
      fetchSchema(selectedCluster.id).then((res) =>
        setSchemaMetadata(
          res as { tableName?: string; table_name?: string; name: string }[],
        ),
      );
  }, [selectedCluster, fetchSchema]);

  useEffect(() => {
    if (!monaco || schemaMetadata.length === 0) return;
    const tableNames = Array.from(
      new Set(schemaMetadata.map((s) => s.tableName || s.table_name)),
    );
    const columns = schemaMetadata.map((s) => ({
      table: s.tableName || s.table_name,
      name: s.name,
    }));
    const provider = monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        const suggestions: {
          label: string;
          kind: number;
          insertText: string;
          range: {
            startLineNumber: number;
            endLineNumber: number;
            startColumn: number;
            endColumn: number;
          };
          detail?: string;
        }[] = [
          ...[
            "SELECT",
            "FROM",
            "WHERE",
            "JOIN",
            "LEFT JOIN",
            "GROUP BY",
            "ORDER BY",
            "LIMIT",
            "INSERT",
            "UPDATE",
            "DELETE",
            "AND",
            "OR",
            "AS",
            "COUNT",
            "SUM",
            "AVG",
            "MIN",
            "MAX",
          ].map((k) => ({
            label: k,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: k,
            range,
          })),
          ...tableNames.map((t) => ({
            label: t!,
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: t!,
            detail: "Table",
            range,
          })),
          ...columns.map((c) => ({
            label: c.name,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: c.name,
            detail: `Column of ${c.table}`,
            range,
          })),
        ];
        return { suggestions };
      },
    });
    return () => provider.dispose();
  }, [monaco, schemaMetadata]);

  // Load History
  const loadHistory = useCallback(async () => {
    if (!selectedCluster) return;
    setIsLoadingHistory(true);
    try {
      const logs = await fetchQueryLogs(selectedCluster.id);
      setQueryHistory(
        logs as {
          id: string;
          query: string;
          success: boolean;
          executionTimeMs: number;
          createdAt: string;
        }[],
      );
    } catch {
      toast.error("Failed to load query history");
    } finally {
      setIsLoadingHistory(false);
    }
  }, [selectedCluster, fetchQueryLogs]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const handleUpdateCode = (newCode: string) => {
    updateActiveQueryCode(newCode);
  };

  const proceedWithExecution = useCallback(
    async (sql: string) => {
      setIsRunning(true);
      setQueryResults(null);
      try {
        const results = await executeQuery(selectedCluster!.id, sql);
        const isSelect = Array.isArray(results);
        let count = 0;
        if (isSelect) {
          count = (results as unknown[]).length;
        } else if (results && typeof results === "object") {
          const r = results as Record<string, unknown>;
          count = (r.rowCount as number) ?? (r.affectedRows as number) ?? 0;
        }

        setQueryResults(
          results as Record<string, unknown>[] | Record<string, unknown>,
        );
        setBottomTab("results");

        toast.success(isSelect ? "Query successful" : "Command successful", {
          description: isSelect
            ? `${count} rows returned.`
            : `${count} rows affected.`,
        });

        if (bottomTab === "history") loadHistory();
      } catch (err: unknown) {
        toast.error("Execution failed", {
          description: getErrorMessage(err),
        });
      } finally {
        setIsRunning(false);
      }
    },
    [selectedCluster, executeQuery, bottomTab, loadHistory],
  );

  const handleRunQuery = useCallback(
    async (overrideSql?: string | unknown) => {
      if (!selectedCluster) return toast.error("Please select a cluster first");

      const sql = (
        typeof overrideSql === "string" ? overrideSql : activeQuery.code
      ).trim();
      if (!sql) return;

      const lowerSql = sql.toLowerCase();
      if (lowerSql.includes("drop database"))
        return toast.error("Strictly prohibited command.");

      const destructive = [
        "drop table",
        "truncate",
        "delete",
        "update",
        "alter table",
      ].filter((k) => lowerSql.includes(k));

      if (destructive.length > 0) {
        openModal({
          title: "Destructive Action",
          message: `Warning: You are about to execute a destructive command (${destructive.join(", ").toUpperCase()}). Proceed with caution.`,
          type: "warning",
          confirmLabel: "Execute Anyway",
          onConfirm: () => proceedWithExecution(sql),
        });
        return;
      }

      await proceedWithExecution(sql);
    },
    [selectedCluster, activeQuery.code, openModal, proceedWithExecution],
  );

  useEffect(() => {
    if (bottomTab === "history" && selectedCluster) loadHistory();
  }, [bottomTab, selectedCluster, loadHistory]);

  useEffect(() => {
    if (runRequested > handledRunId.current) {
      handleRunQuery();
      handledRunId.current = runRequested;
    }
  }, [runRequested, handleRunQuery]);

  const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Add "Run Selected" to context menu
    editor.addAction({
      id: "run-selected-query",
      label: "Run Selected Query",
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1,
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: (ed: any) => {
        const selection = ed.getSelection();
        const selectedText = ed.getModel()?.getValueInRange(selection);
        if (selectedText?.trim()) {
          handleRunQuery(selectedText);
        } else {
          toast.error("No SQL selected", {
            description: "Highlight a query first to run it individually.",
          });
        }
      },
    });
  };

  const handleAskAi = async () => {
    if (aiMode === "generate" && !aiPrompt.trim()) return;
    if (!selectedCluster) return;

    setIsGenerating(true);
    setAiOutput(null);

    try {
      if (aiMode === "generate") {
        const response = await api.post(
          `/v1/ai/${selectedCluster.id}/generate`,
          { prompt: aiPrompt },
        );

        const currentCode = activeQuery.code;
        const generatedSql = response.data.sql;
        const finalSql = currentCode.trim()
          ? `${currentCode.trimEnd()}\n\n${generatedSql}`
          : generatedSql;

        handleUpdateCode(finalSql);
        setIsAiOpen(false);
        setAiPrompt("");
        toast.success("SQL generated");
      } else if (aiMode === "explain") {
        const response = await api.post(`/v1/ai/explain`, {
          sql: activeQuery.code,
          mode: explainLevel,
        });
        setAiOutput(response.data.explanation);
        setBottomTab("results");
        setQueryResults(null);
      } else if (aiMode === "optimize") {
        const response = await api.post(
          `/v1/ai/${selectedCluster.id}/optimize`,
          { sql: activeQuery.code },
        );
        setAiOutput(response.data.suggestions);
        setBottomTab("results");
        setQueryResults(null);
      }
    } catch {
      toast.error("AI service failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFormat = () => {
    try {
      handleUpdateCode(
        format(activeQuery.code, {
          language: "postgresql",
          keywordCase: "upper",
        }),
      );
      toast.success("Formatted");
    } catch {
      toast.error("Format failed");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeQuery.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background font-sans min-w-0 w-full overflow-hidden">
      <QueryTabs
        queries={queries}
        activeQueryId={activeQueryId}
        onSetActive={setActiveQueryId}
        onDelete={(id) => {
          if (queries.length === 1) return handleUpdateCode("");
          const next = queries.filter((q) => q.id !== id);
          setQueries(next);
          if (activeQueryId === id) setActiveQueryId(next[0].id);
        }}
        onNew={() => {
          const id = Math.max(...queries.map((q) => q.id), 0) + 1;
          const q = {
            id,
            name: `query_${id}.sql`,
            code: `-- New query ${id}\nSELECT * FROM users LIMIT 10;`,
          };
          setQueries([...queries, q]);
          setActiveQueryId(id);
        }}
        onToggleAi={() => setIsAiOpen(!isAiOpen)}
        isAiOpen={isAiOpen}
      />

      <AiAssistantBar
        isOpen={isAiOpen}
        mode={aiMode}
        onSetMode={setAiMode}
        prompt={aiPrompt}
        onSetPrompt={setAiPrompt}
        onRun={handleAskAi}
        isGenerating={isGenerating}
        explainLevel={explainLevel}
        onSetExplainLevel={setExplainLevel}
        onClose={() => setIsAiOpen(false)}
      />

      <div
        className={`flex flex-col w-full overflow-hidden relative font-mono text-sm group transition-all duration-500 min-h-0 ${queryResults ? "flex-[1.5]" : "flex-1"}`}
      >
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={activeQuery.code}
          onChange={(val) => handleUpdateCode(val || "")}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            readOnly: isRunning,
            automaticLayout: true,
            padding: { top: 20 },
            fontFamily: "JetBrains Mono, Menlo, Monaco, Courier New, monospace",
          }}
        />

        <div className="absolute top-6 right-8 flex items-center gap-3 px-4 py-1.5 rounded-lg border border-white/5 bg-black/40 text-[9px] font-black text-zinc-500 uppercase tracking-widest backdrop-blur-md opacity-40 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <div
            className={`h-1.5 w-1.5 rounded-full ${selectedCluster ? "bg-primary" : "bg-red-500"}`}
          ></div>
          {selectedCluster
            ? `${selectedCluster.type === "postgres" ? "PostgreSQL" : "MySQL"} - ${selectedCluster.database}`
            : "No Cluster Selected"}
        </div>
      </div>

      <EditorActions
        isRunning={isRunning}
        onRun={handleRunQuery}
        onFormat={handleFormat}
        onCopy={handleCopy}
        onClear={() => handleUpdateCode("")}
        copied={copied}
        clusterSelected={!!selectedCluster}
      />

      <QueryResultsArea
        queryResults={queryResults}
        bottomTab={bottomTab}
        onSetTab={setBottomTab}
        onClose={() => {
          setQueryResults(null);
          setBottomTab("results");
        }}
        aiOutput={aiOutput}
        onCloseAiOutput={() => setAiOutput(null)}
        aiMode={aiMode}
        isLoadingHistory={isLoadingHistory}
        queryHistory={queryHistory}
        isRunning={isRunning}
        onRestoreQuery={(sql) => {
          handleUpdateCode(sql);
          toast.success("Query loaded");
        }}
      />
    </div>
  );
};

export default QueryEditor;
