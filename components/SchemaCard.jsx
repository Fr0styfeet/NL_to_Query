"use client";
import { useState } from "react";

export default function SchemaCard({ schema, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelect(schema)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="schema-card"
      style={{ "--accent": schema.color }}
    >
      <div className="card-glow" />
      <div className="card-inner">
        <div className="card-icon">{schema.icon}</div>
        <div className="card-body">
          <h3 className="card-name">{schema.name}</h3>
          <p className="card-desc">{schema.description}</p>
        </div>
        <div className="card-arrow">→</div>
      </div>
      <div className="card-preview">
        <pre>{schema.content.split("\n").slice(0, 5).join("\n")}...</pre>
      </div>

      <style jsx>{`
        .schema-card {
          position: relative;
          width: 100%;
          background: #0d0d0d;
          border: 1px solid #1f1f1f;
          border-radius: 4px;
          padding: 0;
          text-align: left;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .schema-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .card-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, var(--accent) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .schema-card:hover .card-glow {
          opacity: 0.06;
        }
        .card-inner {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px 14px;
        }
        .card-icon {
          font-size: 24px;
          line-height: 1;
          flex-shrink: 0;
        }
        .card-body {
          flex: 1;
          min-width: 0;
        }
        .card-name {
          font-family: "DM Mono", monospace;
          font-size: 13px;
          font-weight: 500;
          color: #e8e8e8;
          margin: 0 0 3px;
          letter-spacing: 0.02em;
        }
        .card-desc {
          font-size: 11px;
          color: #ffffff;
          margin: 0;
          font-family: "DM Mono", monospace;
        }
        .card-arrow {
          font-size: 16px;
          color: var(--accent);
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .schema-card:hover .card-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .card-preview {
          padding: 0 20px 14px;
          border-top: 1px solid #181818;
          margin-top: 0;
        }
        .card-preview pre {
          font-family: "DM Mono", monospace;
          font-size: 9.5px;
          color: #d4d4d4;
          margin: 10px 0 0;
          line-height: 1.6;
          overflow: hidden;
          white-space: pre-wrap;
          transition: color 0.2s;
        }
        .schema-card:hover .card-preview pre {
          color: #ffffff;
        }
      `}</style>
    </button>
  );
}
