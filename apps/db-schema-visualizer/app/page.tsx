"use client";

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

export default function Home() {
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

  const handleExport = (format: "png" | "svg" | "dbml") => {
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
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <header style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" }}>
            🗄️ Database Schema Visualizer
          </h1>
          <p style={{ color: "#666", fontSize: "1rem" }}>
            Paste SQL DDL → Get instant ERD diagram → Export to PNG/SVG/DBML
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", minHeight: "600px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>SQL Input</h2>
              <button
                onClick={handleLoadSample}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#e0e7ff",
                  color: "#4f46e5",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Load Sample
              </button>
            </div>
            <textarea
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              placeholder="Paste your SQL DDL here...&#10;&#10;Example:&#10;CREATE TABLE users (&#10;  id INT PRIMARY KEY,&#10;  username VARCHAR(50)&#10;);"
              style={{
                width: "100%",
                height: "400px",
                fontFamily: "monospace",
                fontSize: "14px",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                resize: "vertical",
                marginBottom: "15px",
              }}
            />
            {error && (
              <div style={{ padding: "12px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", color: "#dc2626", marginBottom: "15px" }}>
                {error}
              </div>
            )}
            <button
              onClick={handleVisualize}
              style={{
                width: "100%",
                padding: "12px 24px",
                backgroundColor: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Generate ERD
            </button>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>ERD Diagram</h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleExport("svg")}
                  disabled={!mermaidCode}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: mermaidCode ? "#10b981" : "#d1d5db",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: mermaidCode ? "pointer" : "not-allowed",
                    fontSize: "0.875rem",
                  }}
                >
                  Export SVG
                </button>
                <button
                  onClick={() => handleExport("dbml")}
                  disabled={!tables.length}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: tables.length ? "#f59e0b" : "#d1d5db",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: tables.length ? "pointer" : "not-allowed",
                    fontSize: "0.875rem",
                  }}
                >
                  Export DBML
                </button>
              </div>
            </div>
            <div
              ref={diagramRef}
              style={{
                flex: 1,
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                padding: "20px",
                overflow: "auto",
                backgroundColor: "#fafafa",
              }}
            >
              {!mermaidCode && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#9ca3af" }}>
                  <p>Enter SQL DDL and click "Generate ERD" to see the diagram</p>
                </div>
              )}
            </div>
            {tables.length > 0 && (
              <div style={{ marginTop: "15px", padding: "12px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px" }}>
                <p style={{ color: "#166534", fontSize: "0.875rem" }}>
                  ✅ Found {tables.length} table{tables.length > 1 ? "s" : ""} and {relationships.length} relationship{relationships.length > 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </div>

        <footer style={{ marginTop: "30px", textAlign: "center", color: "#666", fontSize: "0.875rem" }}>
          <p>Built with ❤️ by RealTech Tools | Powered by Mermaid.js</p>
        </footer>
      </div>
    </div>
  );
}
