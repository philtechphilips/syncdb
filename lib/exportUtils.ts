export const formatToJSON = (data: any[]) => {
  return JSON.stringify(data, null, 2);
};

export const formatToCSV = (data: any[]) => {
  if (data.length === 0) return "";
  const keys = Object.keys(data[0]);
  return [
    keys.join(','),
    ...data.map(row => keys.map(k => {
      const val = row[k];
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
    }).join(','))
  ].join('\n');
};

export const formatToSQL = (data: any[], tableName: string = 'table') => {
  if (data.length === 0) return "";
  const keys = Object.keys(data[0]);
  return data.map(row => {
    const vals = keys.map(k => {
      const val = row[k];
      if (val === null) return 'NULL';
      if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
      return val;
    }).join(', ');
    return `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${vals});`;
  }).join('\n');
};

export const formatToMarkdown = (data: any[]) => {
  if (data.length === 0) return "";
  const keys = Object.keys(data[0]);
  const header = `| ${keys.join(' | ')} |`;
  const separator = `| ${keys.map(() => '---').join(' | ')} |`;
  const body = data.map(row => 
    `| ${keys.map(k => {
      const val = row[k];
      return val === null || val === undefined ? 'NULL' : String(val).replace(/\|/g, '\\|');
    }).join(' | ')} |`
  ).join('\n');
  return `${header}\n${separator}\n${body}`;
};

export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const formatData = (format: string, data: any[], tableName: string = 'table') => {
    const upperFormat = format.toUpperCase();
    switch (upperFormat) {
        case 'JSON': return formatToJSON(data);
        case 'CSV': return formatToCSV(data);
        case 'MARKDOWN': return formatToMarkdown(data);
        case 'SQL': return formatToSQL(data, tableName);
        default: return "";
    }
};

