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
import { useSavedQueryStore } from "@/store/useSavedQueryStore";
import { useAuthStore } from "@/store/useAuthStore";

// Sub-components
import QueryTabs from "./QueryEditor/QueryTabs";
import AiAssistantBar from "./QueryEditor/AiAssistantBar";
import EditorActions from "./QueryEditor/EditorActions";
import QueryResultsArea from "./QueryEditor/QueryResultsArea";
import SavedQueriesSidebar from "./QueryEditor/SavedQueriesSidebar";
import SaveQueryDialog from "./QueryEditor/SaveQueryDialog";

const QueryEditor = () => {
  const { selectedCluster, executeQuery, fetchSchema, fetchQueryLogs } =
    useClusterStore();
  const { user } = useAuthStore();
  const { open: openModal } = useModalStore();
  const monaco = useMonaco();

  const settings = user?.settings || {};

  const {
    queries,
    activeQueryId,
    setActiveQueryId,
    setQueries,
    updateActiveQueryCode,
    updateActiveQueryPersistentId,
    addQuery,
    removeQuery,
    runRequested,
  } = useQueryStore();
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [queryTotals, setQueryTotals] = useState<number[]>([]);
  const [isPagingEnabled, setIsPagingEnabled] = useState(true);
  const [resultsHeight, setResultsHeight] = useState(350);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const handledRunId = React.useRef(runRequested);
  const editorRef = React.useRef<any>(null);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.pageY;
    const startHeight = resultsHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = startY - moveEvent.pageY;
      const newHeight = Math.max(
        150,
        Math.min(window.innerHeight * 0.8, startHeight + delta),
      );
      setResultsHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const activeQuery = queries.find((q) => q.id === activeQueryId) || queries[0];

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  // Autocomplete & Theme Setup
  useEffect(() => {
    if (selectedCluster)
      fetchSchema(selectedCluster.id).then((res) =>
        setSchemaMetadata(
          res as { tableName?: string; table_name?: string; name: string }[],
        ),
      );
  }, [selectedCluster, fetchSchema]);

  const defineThemes = (monaco: any) => {
    monaco.editor.defineTheme("synq-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "277955" },
        { token: "string", foreground: "a5d6ff" },
        { token: "comment", foreground: "8b949e" },
        { token: "number", foreground: "d2a8ff" },
      ],
      colors: {
        "editor.background": "#040d12",
        "editor.foreground": "#f8fafc",
        "editorCursor.foreground": "#277955",
        "editor.lineHighlightBackground": "#0d1e25",
        "editorLineNumber.foreground": "#1e3a44",
      },
    });

    monaco.editor.defineTheme("monokai", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "f92672" },
        { token: "string", foreground: "e6db74" },
        { token: "comment", foreground: "75715e" },
        { token: "number", foreground: "ae81ff" },
      ],
      colors: {
        "editor.background": "#272822",
        "editor.foreground": "#f8f8f2",
        "editorCursor.foreground": "#f8f8f0",
        "editor.lineHighlightBackground": "#3e3d32",
        "editorLineNumber.foreground": "#90908a",
      },
    });

    monaco.editor.defineTheme("github-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "ff7b72" },
        { token: "string", foreground: "a5d6ff" },
        { token: "comment", foreground: "8b949e" },
        { token: "number", foreground: "d2a8ff" },
      ],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#c9d1d9",
        "editorCursor.foreground": "#58a6ff",
        "editor.lineHighlightBackground": "#161b22",
        "editorLineNumber.foreground": "#484f58",
      },
    });
  };

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
    async (sql: string, page: number = 1) => {
      // Safety: Destructive Action Lock
      const isDestructive = ["DROP ", "TRUNCATE "].some((k) =>
        sql.toUpperCase().includes(k),
      );
      if (isDestructive && settings.destructiveActionLock) {
        toast.error("Execution Blocked", {
          description:
            "Destructive commands (DROP/TRUNCATE) are locked in Project Settings.",
        });
        return;
      }

      setIsRunning(true);
      setQueryResults(null);
      setQueryTotals([]);
      try {
        const response = await executeQuery(
          selectedCluster!.id,
          sql,
          isPagingEnabled ? page : undefined,
          isPagingEnabled ? settings.safetyLimit || 50 : undefined,
        );
        const resultsSets = response.results;
        const resultsTotals = response.totals;

        let totalReturned = 0;
        let totalAffected = 0;
        let hasSelect = false;

        resultsSets.forEach((rs, idx) => {
          if (Array.isArray(rs)) {
            totalReturned += resultsTotals[idx] || rs.length;
            hasSelect = true;
          } else if (rs && typeof rs === "object") {
            totalAffected +=
              (rs.rowCount as number) ?? (rs.affectedRows as number) ?? 0;
          }
        });

        setQueryResults(resultsSets);
        setQueryTotals(resultsTotals);
        setBottomTab("results");

        toast.success(
          resultsSets.length > 1
            ? "Multiple queries successful"
            : hasSelect
              ? "Query successful"
              : "Command successful",
          {
            description:
              resultsSets.length > 1
                ? `${resultsSets.length} statements executed.`
                : hasSelect
                  ? `${totalReturned} rows available.`
                  : `${totalAffected} rows affected.`,
          },
        );

        if (bottomTab === "history") loadHistory();
      } catch (err: unknown) {
        toast.error("Execution failed", {
          description: getErrorMessage(err),
        });
      } finally {
        setIsRunning(false);
      }
    },
    [selectedCluster, executeQuery, bottomTab, loadHistory, isPagingEnabled],
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

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunQuery();
    });

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
          `/v1/ai/${selectedCluster.id}/generate-stream`,
          { prompt: aiPrompt },
          { responseType: "text" },
        );

        if (response.status >= 400) throw new Error("Generation failed");

        // Parse SSE chunks: each line is "data: {"chunk":"..."}" or "data: [DONE]"
        const fullGeneratedSql = (response.data as string)
          .split("\n")
          .filter(
            (line: string) =>
              line.startsWith("data: ") && line !== "data: [DONE]",
          )
          .map((line: string) => {
            try {
              return JSON.parse(line.slice(6)).chunk ?? "";
            } catch {
              return "";
            }
          })
          .join("")
          .trim();
        const initialCode = activeQuery.code.trim();
        const finalSql = initialCode
          ? `${initialCode}\n\n${fullGeneratedSql}`
          : fullGeneratedSql;
        handleUpdateCode(finalSql);
        setIsAiOpen(false);
        setAiPrompt("");
        toast.success("SQL generated");
      } else if (aiMode === "explain") {
        const response = await api.post(
          `/v1/ai/${selectedCluster.id}/explain`,
          {
            sql: activeQuery.code,
            mode: explainLevel,
          },
        );
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
    <div className="flex h-full bg-background font-sans min-w-0 w-full overflow-hidden">
      <SavedQueriesSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLoadQuery={(savedQuery) => {
          handleUpdateCode(savedQuery.query);
          updateActiveQueryPersistentId(savedQuery.id);
          setIsSidebarOpen(false);
        }}
      />

      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <QueryTabs
          queries={queries}
          activeQueryId={activeQueryId}
          onSetActive={setActiveQueryId}
          onDelete={(id) => removeQuery(id)}
          onNew={() => addQuery()}
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
          className={`flex flex-col w-full overflow-hidden relative font-mono text-sm group transition-all duration-500 min-h-0 ${queryResults ? "flex-[1.8]" : "flex-1"}`}
        >
          <Editor
            height="100%"
            defaultLanguage="sql"
            theme={settings.monacoTheme || "synq-dark"}
            value={activeQuery.code}
            onChange={(val) => handleUpdateCode(val || "")}
            beforeMount={defineThemes}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              fontSize: settings.editorFontSize || 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              readOnly: isRunning || isGenerating,
              automaticLayout: true,
              padding: { top: 20 },
              fontFamily:
                "JetBrains Mono, Menlo, Monaco, Courier New, monospace",
              bracketPairColorization: {
                enabled: settings.bracketPairColorization ?? true,
              },
            }}
          />

          <div className="absolute top-6 right-8 flex items-center gap-3 px-4 py-1.5 rounded-lg border border-white/5 bg-black/40 text-[9px] font-black text-zinc-500 uppercase tracking-widest backdrop-blur-md opacity-40 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            <div
              className={`h-1.5 w-1.5 rounded-full ${selectedCluster ? "bg-primary" : "bg-red-500"}`}
            ></div>
            {selectedCluster
              ? `${selectedCluster.type === "postgres" ? "PostgreSQL" : "MySQL"} - ${selectedCluster.name}`
              : "No Cluster Selected"}
          </div>
        </div>

        <EditorActions
          isRunning={isRunning}
          onRun={handleRunQuery}
          onFormat={handleFormat}
          onCopy={handleCopy}
          onClear={() => handleUpdateCode("")}
          onSave={() => setIsSaveDialogOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          copied={copied}
          clusterSelected={!!selectedCluster}
        />

        {queryResults && (
          <div
            onMouseDown={startResizing}
            className="h-1.5 w-full cursor-row-resize bg-border/20 hover:bg-primary/50 transition-colors z-30"
          />
        )}

        <div
          style={{
            height: queryResults ? resultsHeight : 0,
            transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className="shrink-0 overflow-hidden flex flex-col"
        >
          <QueryResultsArea
            queryResults={queryResults}
            queryTotals={queryTotals}
            bottomTab={bottomTab}
            onSetTab={setBottomTab}
            onClose={() => setQueryResults(null)}
            aiOutput={aiOutput}
            onCloseAiOutput={() => setAiOutput(null)}
            aiMode={aiMode}
            isLoadingHistory={isLoadingHistory}
            queryHistory={queryHistory}
            isRunning={isRunning}
            onRestoreQuery={(q) => handleUpdateCode(q)}
            onPageChange={(page: number) =>
              proceedWithExecution(activeQuery.code, page)
            }
            isPagingEnabled={isPagingEnabled}
          />
        </div>

        <SaveQueryDialog
          isOpen={isSaveDialogOpen}
          onClose={() => setIsSaveDialogOpen(false)}
          queryCode={activeQuery.code}
          persistentId={activeQuery.persistentId}
        />
      </div>
    </div>
  );
};

export default QueryEditor;
