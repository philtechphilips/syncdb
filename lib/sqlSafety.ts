/**
 * Finds the leading keywords of each statement in a SQL script, ignoring
 * text inside strings, quoted identifiers and comments. The API enforces
 * the same rules server-side; this only drives warnings in the editor.
 */
function statementKeywords(sql: string): string[][] {
  const statements: string[][] = [];
  let words: string[] = [];
  let i = 0;
  const n = sql.length;
  const end = () => {
    if (words.length) statements.push(words);
    words = [];
  };

  while (i < n) {
    const c = sql[i];
    const next = sql[i + 1];
    if ((c === "-" && next === "-") || c === "#") {
      while (i < n && sql[i] !== "\n") i++;
    } else if (c === "/" && next === "*") {
      const close = sql.indexOf("*/", i + 2);
      i = close === -1 ? n : close + 2;
    } else if (c === "'" || c === '"' || c === "`" || c === "[") {
      const close = c === "[" ? "]" : c;
      i++;
      while (i < n) {
        if (sql[i] === "\\" && c !== "[") {
          i += 2;
          continue;
        }
        if (sql[i] === close) {
          if (sql[i + 1] === close) {
            i += 2;
            continue;
          }
          break;
        }
        i++;
      }
      i++;
    } else if (c === "$" && /^\$[A-Za-z_]*\$/.test(sql.slice(i))) {
      const tag = /^\$[A-Za-z_]*\$/.exec(sql.slice(i))![0];
      const close = sql.indexOf(tag, i + tag.length);
      i = close === -1 ? n : close + tag.length;
    } else if (c === ";") {
      end();
      i++;
    } else if (/[A-Za-z_]/.test(c)) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_]/.test(sql[j])) j++;
      if (words.length < 50) words.push(sql.slice(i, j).toUpperCase());
      i = j;
    } else {
      i++;
    }
  }
  end();
  return statements;
}

export interface SqlRisk {
  /** DROP / TRUNCATE / ALTER ... DROP — blocked by the Destructive Action Lock. */
  destructive: string[];
  /** Any statement that changes data or schema. */
  writes: string[];
  dropsDatabase: boolean;
}

const WRITE_KEYWORDS = new Set([
  "INSERT",
  "UPDATE",
  "DELETE",
  "MERGE",
  "REPLACE",
  "UPSERT",
  "CREATE",
  "ALTER",
  "DROP",
  "TRUNCATE",
  "RENAME",
  "GRANT",
  "REVOKE",
]);

export function analyzeSql(sql: string): SqlRisk {
  const risk: SqlRisk = { destructive: [], writes: [], dropsDatabase: false };
  for (const words of statementKeywords(sql)) {
    const [first, second] = words;
    if (first === "DROP" || first === "TRUNCATE") {
      risk.destructive.push([first, second].filter(Boolean).join(" "));
      if (first === "DROP" && (second === "DATABASE" || second === "SCHEMA")) {
        risk.dropsDatabase = true;
      }
    } else if (first === "ALTER" && words.includes("DROP")) {
      risk.destructive.push("ALTER ... DROP");
    }
    // WITH ... DELETE/UPDATE/INSERT counts as a write too
    const verb =
      first === "WITH" ? words.find((w) => WRITE_KEYWORDS.has(w)) : first;
    if (verb && WRITE_KEYWORDS.has(verb)) risk.writes.push(verb);
  }
  return risk;
}
