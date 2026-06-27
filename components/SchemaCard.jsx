"use client";
import { useState } from "react";

export default function SchemaCard({ schema, onSelect, onDelete, isDeletable }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // don't open the schema
    setConfirmDelete(true);
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    onDelete(schema.id);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <div className="schema-card" style={{ "--accent": schema.color }}>
      <div className="card-glow" />

      {/* Main clickable area */}
      <button
        type="button"
        className="card-inner"
        onClick={() => onSelect(schema)}
      >
        <div className="card-icon">{schema.icon}</div>
        <div className="card-body">
          <h3 className="card-name">{schema.name}</h3>
          <p className="card-desc">{schema.description}</p>
        </div>
        <div className="card-arrow">→</div>
      </button>

      {/* Preview strip */}
      <div className="card-preview">
        <pre>{schema.content.split("\n").slice(0, 5).join("\n")}...</pre>
      </div>

      {/* Delete zone — only for custom/deletable schemas */}
      {isDeletable && (
        <div className="card-footer">
          {confirmDelete ? (
            <div className="confirm-row">
              <span className="confirm-text">Delete this schema?</span>
              <button type="button" className="confirm-yes" onClick={handleConfirm}>
                yes, delete
              </button>
              <button type="button" className="confirm-no" onClick={handleCancel}>
                cancel
              </button>
            </div>
          ) : (
            <button type="button" className="delete-btn" onClick={handleDeleteClick}>
              ✕ delete
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .schema-card {
          position: relative;
          width: 100%;
          background: #0d0d0d;
          border: 1px solid #1f1f1f;
          border-radius: 4px;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
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
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          width: 100%;
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
        .card-footer {
          border-top: 1px solid #141414;
          padding: 7px 14px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          min-height: 34px;
        }
        .delete-btn {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #ffffff;
          letter-spacing: 0.08em;
          background: none;
          border: 1px solid #1e1e1e;
          border-radius: 2px;
          padding: 3px 9px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .delete-btn:hover {
          color: #ef4444;
          border-color: #ef444433;
          background: #1a0808;
        }
        .confirm-row {
          display: flex;
          align-items: center;
          gap: 8px;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .confirm-text {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #e8e8e8;
          letter-spacing: 0.05em;
        }
        .confirm-yes {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #ef4444;
          background: #1a0808;
          border: 1px solid #ef444433;
          border-radius: 2px;
          padding: 3px 9px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .confirm-yes:hover {
          background: #2a0a0a;
          border-color: #ef4444;
        }
        .confirm-no {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #f59e0b;
          background: none;
          border: 1px solid #222;
          border-radius: 2px;
          padding: 3px 9px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .confirm-no:hover {
          color: #f59e0b;
          border-color: #f59e0b;
        }
      `}</style>
    </div>
  );
}