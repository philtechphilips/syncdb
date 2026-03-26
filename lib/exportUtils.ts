import jsPDF from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const formatToJSON = <T extends Record<string, unknown>>(data: T[]) => {
  return JSON.stringify(data, null, 2);
};

export const formatToCSV = <T extends Record<string, unknown>>(data: T[]) => {
  if (data.length === 0) return "";
  const keys = Object.keys(data[0]) as (keyof T)[];
  
  const header = keys.join(",");
  const body = data.map((row) =>
    keys
      .map((k) => {
        let val = row[k];
        if (val === null || val === undefined) return "";
        let str = String(val);
        // Escape quotes and wrap in quotes if contains comma or quote
        if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
          str = `"${str.replace(/"/g, "\"\"")}"`;
        }
        return str;
      })
      .join(",")
  );
  
  return [header, ...body].join("\n");
};

export const formatToSQL = <T extends Record<string, unknown>>(
  data: T[],
  tableName: string = "table",
) => {
  if (data.length === 0) return "";
  const keys = Object.keys(data[0]) as (keyof T)[];
  const escapedTableName = `"${tableName.replace(/"/g, "\"\"")}"`;
  const escapedKeys = keys.map(k => `"${String(k).replace(/"/g, "\"\"")}"`).join(", ");

  return data
    .map((row) => {
      const vals = keys
        .map((k) => {
          const val = row[k];
          if (val === null || val === undefined) return "NULL";
          if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
          if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
          return val;
        })
        .join(", ");
      return `INSERT INTO ${escapedTableName} (${escapedKeys}) VALUES (${vals});`;
    })
    .join("\n");
};

export const formatToMarkdown = <T extends Record<string, unknown>>(
  data: T[],
) => {
  if (data.length === 0) return "";
  const keys = Object.keys(data[0]) as (keyof T)[];
  const header = `| ${keys.join(" | ")} |`;
  const separator = `| ${keys.map(() => "---").join(" | ")} |`;
  const body = data
    .map(
      (row) =>
        `| ${keys
          .map((k) => {
            const val = row[k];
            return val === null || val === undefined
              ? "NULL"
              : String(val).replace(/\|/g, "\\|");
          })
          .join(" | ")} |`,
    )
    .join("\n");
  return `${header}\n${separator}\n${body}`;
};

export const formatToPDF = <T extends Record<string, unknown>>(
  data: T[],
  tableName: string = "table"
) => {
  if (data.length === 0) return;
  const doc = new jsPDF();
  const keys = Object.keys(data[0]);
  const body = data.map(row => keys.map(k => String(row[k] ?? "NULL")));

  doc.text(`Table Export: ${tableName}`, 14, 15);
  doc.autoTable({
    startY: 20,
    head: [keys],
    body: body,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 237, 100], textColor: [0, 0, 0] },
  });

  return doc;
};

export const downloadFile = (
  content: string | jsPDF,
  filename: string,
  mimeType: string = "text/plain",
) => {
  if (content instanceof jsPDF) {
    content.save(filename);
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const formatData = <T extends Record<string, unknown>>(
  format: string,
  data: T[],
  tableName: string = "table",
) => {
  const upperFormat = format.toUpperCase();
  switch (upperFormat) {
    case "JSON":
      return formatToJSON(data);
    case "CSV":
      return formatToCSV(data);
    case "MARKDOWN":
      return formatToMarkdown(data);
    case "SQL":
      return formatToSQL(data, tableName);
    case "PDF":
      return formatToPDF(data, tableName);
    default:
      return "";
  }
};
