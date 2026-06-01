"use client";

export default function LanguagePicker({ languages, selected, onChange }) {
  const sqlLangs = languages.filter((l) => l.category === "SQL");
  const noSqlLangs = languages.filter((l) => l.category === "NoSQL");

  return (
    <div className="lang-picker">
      <div className="lang-group">
        <span className="group-label">SQL</span>
        <div className="lang-list">
          {sqlLangs.map((lang) => (
            <LangButton key={lang.id} lang={lang} selected={selected} onChange={onChange} />
          ))}
        </div>
      </div>
      <div className="divider" />
      <div className="lang-group">
        <span className="group-label">NoSQL</span>
        <div className="lang-list">
          {noSqlLangs.map((lang) => (
            <LangButton key={lang.id} lang={lang} selected={selected} onChange={onChange} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .lang-picker {
          display: flex;
          align-items: center;
          gap: 0;
          background: #0a0a0a;
          border: 1px solid #1e1e1e;
          border-radius: 4px;
          padding: 4px 8px;
          overflow-x: auto;
        }
        .lang-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .group-label {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #3a3a3a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0 4px;
          white-space: nowrap;
        }
        .lang-list {
          display: flex;
          gap: 2px;
        }
        .divider {
          width: 1px;
          height: 20px;
          background: #1e1e1e;
          margin: 0 10px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

function LangButton({ lang, selected, onChange }) {
  const isSelected = selected?.id === lang.id;
  return (
    <button
      type="button"
      onClick={() => onChange(lang)}
      className={`lang-btn ${isSelected ? "active" : ""}`}
    >
      <span className="lang-icon">{lang.icon}</span>
      <span className="lang-label">{lang.label}</span>

      <style jsx>{`
        .lang-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 3px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .lang-btn:hover {
          background: #161616;
          border-color: #2a2a2a;
        }
        .lang-btn.active {
          background: #1a1500;
          border-color: #f59e0b;
        }
        .lang-icon {
          font-size: 12px;
          line-height: 1;
        }
        .lang-label {
          font-family: "DM Mono", monospace;
          font-size: 11px;
          color: ${isSelected ? "#f59e0b" : "#555"};
          font-weight: ${isSelected ? "600" : "400"};
          transition: color 0.15s;
        }
        .lang-btn:hover .lang-label {
          color: ${isSelected ? "#f59e0b" : "#d4d4d4"};
        }
      `}</style>
    </button>
  );
}
