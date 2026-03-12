'use client';

import { useState, useEffect, useRef } from "react";
import mermaid from "mermaid/dist/mermaid.esm.min.mjs";

interface Table {
  name: string;
  columns: { name: string; type: string; constraints: string[] }[];
}

interface Relationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: "one-to-one" | "one-to-many" | "many-to-many";
}

const DbSchemaVisualizer: React.FC = () => {
  const [sqlInput, setSqlInput] = useState<string>("");
  const [mermaidCode, setMermaidCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const diagramRef = useRef<HTMLDivElement>(null);

  const sampleSQL = `CREATE TABLE users (
  id INT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
  id INT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
    });
  }, []);

  useEffect(() => {
    if (mermaidCode && diagramRef.current) {
      diagramRef.current.innerHTML = "";
      try {
        mermaid.render("erd-diagram", mermaidCode).then(({ svg }) => {
          if (diagramRef.current) {
            diagramRef.current.innerHTML = svg;
          }
        });
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    }
  }, [mermaidCode]);

  const parseSQL = (sql: string) => {
    const tables: Table[] = [];
    const relationships: Relationship[] = [];
    const tableMap = new Map<string, string[]>();

    const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\(([\s\S]*?)\);/gi;
    let match;

    while ((match = createTableRegex.exec(sql)) !== null) {
      const tableName = match[1];
      const columnsDef = match[2];
      const columns: Table["columns"] = [];
      const columnNames: string[] = [];

      const lines = columnsDef.split(",").map((line) => line.trim()).filter((line) => line.length > 0);

      for (const line of lines) {
        if (/^(PRIMARY KEY|FOREIGN KEY|CONSTRAINT|UNIQUE|INDEX|CHECK)/i.test(line)) {
          const fkMatch = /FOREIGN\s+KEY\s*\((\w+)\)\s*REFERENCES\s+(\w+)\s*\((\w+)\)/i.exec(line);
          if (fkMatch) {
            relationships.push({
              fromTable: tableName,
              fromColumn: fkMatch[1],
              toTable: fkMatch[2],
              toColumn: fkMatch[3],
              type: "one-to-many",
            });
          }
          continue;
        }

        const colMatch = /^(\w+)\s+([\w\(\),\s]+?)(?:\s+(PRIMARY\s+KEY|UNIQUE|NOT\s+NULL|DEFAULT\s+\w+|AUTO_INCREMENT))?(?:\s*,?\s*(PRIMARY\s+KEY|UNIQUE|NOT\s+NULL|DEFAULT\s+\w+|AUTO_INCREMENT))?$/i.exec(line);
        if (colMatch) {
          const colName = colMatch[1];
          const colType = colMatch[2].trim();
          const constraints: string[] = [];
          if (colMatch[3]) constraints.push(colMatch[3].toUpperCase());
          if (colMatch[4]) constraints.push(colMatch[4].toUpperCase());
          if (constraints.includes("PRIMARY KEY")) columnNames.push(colName);
          columns.push({ name: colName, type: colType, constraints });
        }
      }

      tableMap.set(tableName, columnNames);
      tables.push({ name: tableName, columns });
    }

    return { tables, relationships };
  };

  const generateMermaidCode = (tables: Table[], relationships: Relationship[]) => {
    let code = "erDiagram\n";

    for (const table of tables) {
      code += `    ${table.name} {\n`;
      for (const col of table.columns) {
        const constraints = col.constraints.join(" ");
        code += `        ${col.type} ${col.name} ${constraints}\n`;
      }
      code += "    }\n\n";
    }

    for (const rel of relationships) {
      code += `    ${rel.fromTable} ||--o{ ${rel.toTable} : "${rel.fromColumn} → ${rel.toColumn}"\n`;
    }

    return code;
  };

  const handleVisualize = () => {
    try {
      setError("");
      const { tables, relationships } = parseSQL(sqlInput);
      if (tables.length === 0) {
        setError("No tables found. Please check your SQL syntax.");
        return;
      }
      setTables(tables);
      setRelationships(relationships);
      const code = generateMermaidCode(tables, relationships);
      setMermaidCode(code);
    } catch (err) {
      setError("Failed to parse SQL. Please check your syntax.");
    }
  };

  const handleLoadSample = () => {
    setSqlInput(sampleSQL);
  };

  const handleExport = (format: "svg" | "dbml") => {
    if (format === "dbml") {
      let dbml = "";
      for (const table of tables) {
        dbml += `Table ${table.name} {\n`;
        for (const col of table.columns) {
          const pk = col.constraints.includes("PRIMARY KEY") ? " PK" : "";
          const nn = col.constraints.includes("NOT NULL") ? " NOT NULL" : "";
          const unique = col.constraints.includes("UNIQUE") ? " UNIQUE" : "";
          dbml += `  ${col.name} ${col.type}${pk}${nn}${unique}\n`;
        }
        dbml += "}\n\n";
      }
      const blob = new Blob([dbml], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "schema.dbml";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      if (diagramRef.current) {
        const svg = diagramRef.current.innerHTML;
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `schema.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🗄️ Database Schema Visualizer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Paste SQL DDL → Get instant ERD diagram → Export to SVG/DBML
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* SQL Input */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">SQL Input</h2>
              <button
                onClick={handleLoadSample}
                className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-200 transition-colors"
              >
                Load Sample
              </button>
            </div>
            <div className="p-8">
              <textarea
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                placeholder="Paste your SQL DDL here..."
                className="w-full h-96 font-mono text-sm p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {error}
                </div>
              )}
              <button
                onClick={handleVisualize}
                className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Generate ERD
              </button>
            </div>
          </div>

          {/* ERD Diagram */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">ERD Diagram</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport("svg")}
                  disabled={!mermaidCode}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Export SVG
                </button>
                <button
                  onClick={() => handleExport("dbml")}
                  disabled={!tables.length}
                  className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-semibold hover:bg-amber-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Export DBML
                </button>
              </div>
            </div>
            <div
              ref={diagramRef}
              className="h-96 p-8 overflow-auto bg-gray-50"
            >
              {!mermaidCode && (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Enter SQL DDL and click "Generate ERD" to see the diagram</p>
                </div>
              )}
            </div>
            {tables.length > 0 && (
              <div className="p-4 bg-green-50 border-t border-green-100">
                <p className="text-green-700 font-semibold">
                  ✅ Found {tables.length} table{tables.length > 1 ? 's' : ''} and {relationships.length} relationship{relationships.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Built with ❤️ by RealTech AI Tool Factory</p>
          <p className="mt-1">Part of RealTech Hub (real-tech.online)</p>
        </div>
      </div>
    </div>
  );
};

export default DbSchemaVisualizer;
