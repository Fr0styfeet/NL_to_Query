"use client";
import { useState } from "react";

// ─── DDL Validator ────────────────────────────────────────────────────────────
// Returns { valid: bool, errors: string[], warnings: string[], tableCount: number }
function validateDDL(content) {
  const errors = [];
  const warnings = [];

  if (!content || !content.trim()) {
    return { valid: false, errors: ["Schema content is empty."], warnings: [], tableCount: 0 };
  }

  const lines = content.split("\n");
  const trimmed = content.trim().toUpperCase();

  // Must have at least one recognizable structure
  const hasCreate = /CREATE\s+TABLE/i.test(content);
  const hasCollectionLike = /collection|table|model|schema/i.test(content);
  const hasColumnLike = /\bINT\b|\bVARCHAR\b|\bTEXT\b|\bBOOLEAN\b|\bTIMESTAMP\b|\bDATE\b|\bDECIMAL\b|\bDOUBLE\b|\bFLOAT\b|\bJSON\b|\bUUID\b/i.test(content);

  if (!hasCreate && !hasCollectionLike) {
    errors.push("No CREATE TABLE or collection definitions found. Please include table/collection definitions.");
  }

  if (!hasColumnLike && hasCreate) {
    warnings.push("No column type keywords detected (e.g. INT, VARCHAR, TEXT). Schema may be incomplete.");
  }

  // Check for unclosed parentheses
  let depth = 0;
  for (const ch of content) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth < 0) {
      errors.push("Mismatched parentheses — found a closing ')' without a matching opening '('.");
      break;
    }
  }
  if (depth > 0) {
    errors.push(`Mismatched parentheses — ${depth} opening '(' left unclosed.`);
  }

  // Count tables
  const tableMatches = content.match(/CREATE\s+TABLE\s+\S+/gi) || [];
  const tableCount = tableMatches.length;

  // Warn if no primary key at all
  const hasPK = /PRIMARY\s+KEY|PRIMARY KEY/i.test(content);
  if (hasCreate && !hasPK) {
    warnings.push("No PRIMARY KEY found in any table. This is valid but may limit query generation.");
  }

  // Warn on very short schemas
  if (content.trim().length < 30) {
    warnings.push("Schema looks very short — make sure it includes table definitions.");
  }

  // Detect likely non-DDL plain text
  const sqlKeywordDensity =
    (content.match(/\b(CREATE|TABLE|SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|PRIMARY|FOREIGN|REFERENCES|NOT NULL|DEFAULT|INDEX|UNIQUE|CONSTRAINT)\b/gi) || []).length;
  if (content.trim().length > 100 && sqlKeywordDensity < 2) {
    warnings.push("Low SQL keyword density — are you sure this is a DDL schema and not plain text?");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    tableCount,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
const ICONS = ["🗄️", "🔐", "📋", "🧬", "🌐", "🏗️", "📱", "⚙️", "🧪", "🏦", "🛒", "📊"];

export default function SchemaUploader({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [icon, setIcon] = useState("🗄️");
  const [description, setDescription] = useState("");
  const [tab, setTab] = useState("paste");

  // Validation state
  const [validationResult, setValidationResult] = useState(null); // null = not yet validated
  const [hasValidated, setHasValidated] = useState(false);

  const handleContentChange = (val) => {
    setContent(val);
    // Reset validation when content changes so user knows to re-validate
    setHasValidated(false);
    setValidationResult(null);
  };

  const handleValidate = () => {
    const result = validateDDL(content);
    setValidationResult(result);
    setHasValidated(true);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleContentChange(ev.target.result);
      if (!name) setName(file.name.replace(/\.[^/.]+$/, ""));
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    // Always validate on submit
    const result = validateDDL(content);
    setValidationResult(result);
    setHasValidated(true);

    if (!result.valid) return; // block submission if errors

    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      icon,
      description: description.trim() || "Custom schema",
      color: "#f59e0b",
      content: content.trim(),
    });
  };

  const canSubmit = name.trim() && content.trim();

  return (
    <form onSubmit={handleSubmit} className="uploader">
      <div className="uploader-header">
        <span className="uploader-title">New Schema</span>
        <button type="button" onClick={onCancel} className="close-btn">✕</button>
      </div>

      {/* Icon picker */}
      <div className="field">
        <label className="field-label">Icon</label>
        <div className="icon-picker">
          {ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              className={`icon-opt ${icon === ic ? "active" : ""}`}
              onClick={() => setIcon(ic)}
            >
              {ic}
            </button>
          ))}
        </div>
      </div>

      <div className="row-2">
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Schema Name *</label>
          <input
            type="text"
            className="field-input"
            placeholder="e.g. Inventory System"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Short Description</label>
          <input
            type="text"
            className="field-input"
            placeholder="e.g. Products & stock"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Tab toggle */}
      <div className="tabs">
        <button
          type="button"
          className={`tab ${tab === "paste" ? "active" : ""}`}
          onClick={() => setTab("paste")}
        >
          Paste DDL
        </button>
        <button
          type="button"
          className={`tab ${tab === "file" ? "active" : ""}`}
          onClick={() => setTab("file")}
        >
          Upload File
        </button>
      </div>

      {tab === "paste" ? (
        <div className="field">
          <div className="textarea-header">
            <label className="field-label">DDL / Schema *</label>
            {content.trim() && (
              <button type="button" className="validate-btn" onClick={handleValidate}>
                ⚡ validate
              </button>
            )}
          </div>
          <textarea
            className={`field-textarea ${
              hasValidated
                ? validationResult?.valid
                  ? "valid"
                  : "invalid"
                : ""
            }`}
            placeholder={`CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  email VARCHAR(255)\n);`}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={9}
            required
          />
        </div>
      ) : (
        <div className="field">
          <label className="field-label">Upload File</label>
          <label className="file-drop">
            <input
              type="file"
              accept=".sql,.txt,.json,.ddl"
              onChange={handleFile}
              className="hidden-input"
            />
            <span className="file-icon">📂</span>
            <span className="file-hint">Drop or click — .sql / .txt / .json / .ddl</span>
            {content && (
              <span className="file-ok">✓ File loaded ({content.length} chars)</span>
            )}
          </label>
          {/* Show validate button after file load */}
          {content.trim() && (
            <button
              type="button"
              className="validate-btn standalone"
              onClick={handleValidate}
            >
              ⚡ validate schema
            </button>
          )}
        </div>
      )}

      {/* Validation feedback */}
      {hasValidated && validationResult && (
        <div className={`validation-panel ${validationResult.valid ? "ok" : "fail"}`}>
          <div className="val-header">
            {validationResult.valid ? (
              <span className="val-status ok">✓ Valid schema</span>
            ) : (
              <span className="val-status fail">✕ Validation failed</span>
            )}
            {validationResult.tableCount > 0 && (
              <span className="val-tables">{validationResult.tableCount} table{validationResult.tableCount !== 1 ? "s" : ""} detected</span>
            )}
          </div>

          {validationResult.errors.length > 0 && (
            <ul className="val-list errors">
              {validationResult.errors.map((e, i) => (
                <li key={i}><span className="val-dot error">●</span>{e}</li>
              ))}
            </ul>
          )}

          {validationResult.warnings.length > 0 && (
            <ul className="val-list warnings">
              {validationResult.warnings.map((w, i) => (
                <li key={i}><span className="val-dot warn">◆</span>{w}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="uploader-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        <button
          type="submit"
          className="btn-submit"
          disabled={!canSubmit}
          title={
            hasValidated && !validationResult?.valid
              ? "Fix validation errors before injecting"
              : ""
          }
        >
          Inject Schema →
        </button>
      </div>

      <style jsx>{`
        .uploader {
          background: #0a0a0a;
          border: 1px solid #1e1e1e;
          border-radius: 4px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .uploader-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .uploader-title {
          font-family: "DM Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f59e0b;
        }
        .close-btn {
          background: none;
          border: none;
          color: #b3b3b3;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 6px;
          transition: color 0.15s;
        }
        .close-btn:hover { color: #fff; }
        .icon-picker {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .icon-opt {
          width: 30px;
          height: 30px;
          background: #111;
          border: 1px solid #a3a3a3;
          border-radius: 3px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s;
        }
        .icon-opt.active {
          border-color: #f59e0b;
          background: #1a1500;
        }
        .row-2 {
          display: flex;
          gap: 12px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .field-label {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #b3b3b3;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .field-input {
          background: #060606;
          border: 1px solid #1a1a1a;
          border-radius: 3px;
          padding: 8px 12px;
          font-family: "DM Mono", monospace;
          font-size: 12px;
          color: #ffffff;
          outline: none;
          transition: border-color 0.15s;
        }
        .field-input:focus { border-color: #f59e0b55; }

        .textarea-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .validate-btn {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #f59e0b;
          background: #1a1500;
          border: 1px solid #f59e0b33;
          border-radius: 2px;
          padding: 3px 9px;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.15s;
        }
        .validate-btn:hover { background: #241c00; border-color: #f59e0b66; }
        .validate-btn.standalone { align-self: flex-start; margin-top: 4px; }

        .field-textarea {
          background: #060606;
          border: 1px solid #1a1a1a;
          border-radius: 3px;
          padding: 10px 12px;
          font-family: "DM Mono", monospace;
          font-size: 11px;
          color: #999;
          outline: none;
          resize: vertical;
          line-height: 1.7;
          transition: border-color 0.2s;
        }
        .field-textarea:focus { border-color: #f59e0b55; }
        .field-textarea.valid { border-color: #22c55e55; }
        .field-textarea.invalid { border-color: #ef444455; }

        .tabs {
          display: flex;
          border: 1px solid #1a1a1a;
          border-radius: 3px;
          overflow: hidden;
        }
        .tab {
          flex: 1;
          padding: 7px;
          background: #0d0d0d;
          border: none;
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #b3b3b3;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.15s;
        }
        .tab.active {
          background: #1a1500;
          color: #f59e0b;
        }

        .file-drop {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px;
          background: #060606;
          border: 1px dashed #a3a3a3;
          border-radius: 3px;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .file-drop:hover { border-color: #f59e0b55; }
        .hidden-input { display: none; }
        .file-icon { font-size: 22px; }
        .file-hint {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #b3b3b3;
          text-align: center;
        }
        .file-ok {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #22c55e;
        }

        /* Validation panel */
        .validation-panel {
          border-radius: 3px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: slideIn 0.15s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .validation-panel.ok {
          background: #061208;
          border: 1px solid #22c55e22;
        }
        .validation-panel.fail {
          background: #120606;
          border: 1px solid #ef444422;
        }
        .val-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .val-status {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
        }
        .val-status.ok { color: #22c55e; }
        .val-status.fail { color: #ef4444; }
        .val-tables {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #3a3a3a;
        }
        .val-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0;
          margin: 0;
        }
        .val-list li {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #888;
          display: flex;
          align-items: flex-start;
          gap: 7px;
          line-height: 1.5;
        }
        .val-dot {
          flex-shrink: 0;
          font-size: 6px;
          margin-top: 4px;
        }
        .val-dot.error { color: #ef4444; }
        .val-dot.warn  { color: #f59e0b; }

        .uploader-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .btn-cancel {
          background: none;
          border: 1px solid #a3a3a3;
          border-radius: 3px;
          padding: 7px 16px;
          font-family: "DM Mono", monospace;
          font-size: 11px;
          color: #555;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-cancel:hover { color: #999; border-color: #d4d4d4; }
        .btn-submit {
          background: #1a1500;
          border: 1px solid #f59e0b55;
          border-radius: 3px;
          padding: 7px 18px;
          font-family: "DM Mono", monospace;
          font-size: 11px;
          color: #f59e0b;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-submit:hover:not(:disabled) { background: #241c00; border-color: #f59e0b; }
        .btn-submit:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>
    </form>
  );
}