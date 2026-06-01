"use client";
import { useState } from "react";
import SchemaCard from "../components/SchemaCard";
import SchemaUploader from "../components/SchemaUploader";
import ChatWorkspace from "../components/ChatWorkspace";
import { SAMPLE_SCHEMAS } from "../data/schemas";

export default function Home() {
  const [schemas, setSchemas] = useState(SAMPLE_SCHEMAS);
  const [activeSchema, setActiveSchema] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddSchema = (schema) => {
    setSchemas((prev) => [...prev, schema]);
    setShowUploader(false);
    setActiveSchema(schema);
  };

  const filtered = schemas.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeSchema) {
    return (
      <ChatWorkspace
        schema={activeSchema}
        onBack={() => setActiveSchema(null)}
      />
    );
  }

  return (
    <div className="landing">
      {/* Background grid */}
      <div className="bg-grid" />
      <div className="bg-vignette" />

      <div className="content">
        {/* Header */}
        <header className="site-header">
          <div className="logo-area">
            <div className="logo-mark">
              <span className="logo-bracket">[</span>
              <span className="logo-text">Q</span>
              <span className="logo-bracket">]</span>
            </div>
            <div>
              <h1 className="site-title">QueryPilot</h1>
              <p className="site-sub">Natural language → SQL / NoSQL compiler</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-n">{schemas.length}</span>
              <span className="stat-l">schemas</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-n">8</span>
              <span className="stat-l">dialects</span>
            </div>
          </div>
        </header>

        {/* Section heading */}
        <div className="section-bar">
          <div className="section-left">
            <span className="section-label">Select a schema to begin</span>
            {schemas.length > 4 && (
              <input
                type="text"
                className="search-input"
                placeholder="filter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
          </div>
          <button
            type="button"
            className="upload-trigger"
            onClick={() => setShowUploader((v) => !v)}
          >
            {showUploader ? "✕ cancel" : "+ custom schema"}
          </button>
        </div>

        {/* Uploader */}
        {showUploader && (
          <div className="uploader-area">
            <SchemaUploader
              onAdd={handleAddSchema}
              onCancel={() => setShowUploader(false)}
            />
          </div>
        )}

        {/* Schema grid */}
        <div className="schema-grid">
          {filtered.map((s) => (
            <SchemaCard key={s.id} schema={s} onSelect={setActiveSchema} />
          ))}
          {filtered.length === 0 && (
            <p className="empty-state">No schemas match "{searchQuery}"</p>
          )}
        </div>

        {/* Bottom hint */}
        <footer className="site-footer">
          <span className="footer-text">
            Powered by Claude · Select a schema, choose your dialect, compile.
          </span>
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          background: #050505;
          color: #fffff0;
          min-height: 100vh;
        }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #2a2a2a; }
      `}</style>

      <style jsx>{`
        .landing {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        .bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(#0f0f0f 1px, transparent 1px),
            linear-gradient(90deg, #0f0f0f 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }
        .bg-vignette {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, #050505 100%);
          pointer-events: none;
          z-index: 0;
        }
        .content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }
        .site-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 56px;
        }
        .logo-area {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .logo-mark {
          width: 52px;
          height: 52px;
          border: 1px solid #f59e0b44;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }
        .logo-bracket {
          font-family: "DM Mono", monospace;
          font-size: 20px;
          color: #f59e0b;
          line-height: 1;
        }
        .logo-text {
          font-family: "Syne", sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #f59e0b;
          line-height: 1;
          margin: 0 2px;
        }
        .site-title {
          font-family: "Syne", sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #e8e8e8;
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 4px;
        }
        .site-sub {
          font-family: "DM Mono", monospace;
          font-size: 11px;
          color: #ffffff;
          letter-spacing: 0.04em;
        }
        .header-stats {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 12px 20px;
          background: #0a0a0a;
          border: 1px solid #161616;
          border-radius: 3px;
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .stat-n {
          font-family: "Syne", sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #f59e0b;
          line-height: 1;
        }
        .stat-l {
          font-family: "DM Mono", monospace;
          font-size: 8px;
          color: #a3a3a3;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .stat-divider {
          width: 1px;
          height: 30px;
          background: #161616;
        }
        .section-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 12px;
        }
        .section-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .section-label {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #ffffff0;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .search-input {
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 3px;
          padding: 4px 10px;
          font-family: "DM Mono", monospace;
          font-size: 11px;
          color: #d4d4d4;
          outline: none;
          width: 140px;
          transition: border-color 0.15s;
        }
        .search-input:focus { border-color: #f59e0b33; }
        .upload-trigger {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #f59e0b;
          background: #1a1500;
          border: 1px solid #f59e0b33;
          border-radius: 3px;
          padding: 6px 14px;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .upload-trigger:hover { background: #241c00; border-color: #f59e0b66; }
        .uploader-area {
          margin-bottom: 20px;
          animation: slideIn 0.2s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .schema-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 10px;
        }
        .empty-state {
          font-family: "DM Mono", monospace;
          font-size: 12px;
          color: #d4d4d4;
          padding: 32px;
          text-align: center;
          grid-column: 1 / -1;
        }
        .site-footer {
          margin-top: 60px;
          text-align: center;
        }
        .footer-text {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #1e1e1e;
          letter-spacing: 0.06em;
        }
      `}</style>
    </div>
  );
}
