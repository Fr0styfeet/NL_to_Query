"use client";
import { useState } from "react";

export default function SchemaUploader({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [icon, setIcon] = useState("🗄️");
  const [description, setDescription] = useState("");
  const [tab, setTab] = useState("paste"); // "paste" | "file"

  const ICONS = ["🗄️", "🔐", "📋", "🧬", "🌐", "🏗️", "📱", "⚙️"];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setContent(ev.target.result);
      if (!name) setName(file.name.replace(/\.[^/.]+$/, ""));
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      icon,
      description: description || "Custom schema",
      color: "#f59e0b",
      content: content.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uploader">
      <div className="uploader-header">
        <span className="uploader-title">New Schema</span>
        <button type="button" onClick={onCancel} className="close-btn">✕</button>
      </div>

      {/* Icon + Name Row */}
      <div className="row">
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

      <div className="field">
        <label className="field-label">Schema Name</label>
        <input
          type="text"
          className="field-input"
          placeholder="e.g. Inventory System"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="field-label">Short Description</label>
        <input
          type="text"
          className="field-input"
          placeholder="e.g. Products, warehouses & stock"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Tab: Paste vs File */}
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
          <textarea
            className="field-textarea"
            placeholder={`CREATE TABLE users (\n  id INT PRIMARY KEY,\n  ...\n);`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
        </div>
      ) : (
        <div className="field">
          <label className="file-drop">
            <input type="file" accept=".sql,.txt,.json,.ddl" onChange={handleFile} className="hidden-input" />
            <span className="file-icon">📂</span>
            <span className="file-hint">Drop or click to upload .sql / .txt / .json</span>
            {content && <span className="file-ok">✓ File loaded ({content.length} chars)</span>}
          </label>
        </div>
      )}

      <div className="uploader-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        <button type="submit" className="btn-submit">Inject Schema →</button>
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
        .row {
          display: flex;
          gap: 10px;
          align-items: center;
        }
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
          transition: border-color 0.15s;
        }
        .field-textarea:focus { border-color: #f59e0b55; }
        .tabs {
          display: flex;
          gap: 0;
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
        .btn-submit:hover { background: #241c00; border-color: #f59e0b; }
      `}</style>
    </form>
  );
}
