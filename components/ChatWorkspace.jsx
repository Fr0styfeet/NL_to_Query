"use client";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import LanguagePicker from "./LanguagePicker";
import { QUERY_LANGUAGES } from "../data/schemas";

const WELCOME = (schemaName) => ({
  role: "assistant",
  text: `-- Schema: ${schemaName}\n-- Ready for natural language queries.\n-- Type below to generate ${schemaName}-specific SQL / NoSQL.`,
});

export default function ChatWorkspace({ schema, onBack }) {
  const [language, setLanguage] = useState(QUERY_LANGUAGES[0]);
  const [messages, setMessages] = useState([WELCOME(schema.name)]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/generate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schema: schema.content,
          dialect: language.label,
          prompt: userText,
        }),
      });
      const data = await response.json();
      setMessages([...newMessages, {
        role: "assistant",
        text: data.query || `-- Error: ${data.error || "Unknown error"}`,
      }]);
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        text: "-- Execution Error: Failed to reach API endpoint.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="workspace">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-left">
          <button type="button" className="back-btn" onClick={onBack}>
            ← back
          </button>
          <div className="schema-pill">
            <span className="schema-icon">{schema.icon}</span>
            <span className="schema-name">{schema.name}</span>
          </div>
        </div>
        <div className="topbar-center">
          <LanguagePicker
            languages={QUERY_LANGUAGES}
            selected={language}
            onChange={setLanguage}
          />
        </div>
        <div className="topbar-right">
          <button
            type="button"
            className={`schema-toggle ${schemaOpen ? "open" : ""}`}
            onClick={() => setSchemaOpen(!schemaOpen)}
          >
            {schemaOpen ? "hide schema" : "view schema"}
          </button>
        </div>
      </header>

      <div className="workspace-body">
        {/* Schema Drawer */}
        {schemaOpen && (
          <aside className="schema-drawer">
            <div className="drawer-header">
              <span className="drawer-title">Schema Context</span>
              <button className="close-drawer" onClick={() => setSchemaOpen(false)}>✕</button>
            </div>
            <pre className="schema-pre">{schema.content}</pre>
          </aside>
        )}

        {/* Chat area */}
        <main className="chat-area">
          <div className="messages-wrap">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} language={language} />
            ))}

            {loading && (
              <div className="loading-indicator">
                <span className="pulse" />
                <span className="loading-text">compiling {language.label}...</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <footer className="input-bar">
            <form onSubmit={handleSend} className="input-form">
              <div className="input-wrap">
                <span className="input-prefix">›</span>
                <textarea
                  ref={inputRef}
                  className="input-field"
                  placeholder={`Describe your ${language.label} query in plain English...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="send-btn"
                >
                  {loading ? (
                    <span className="spin">◌</span>
                  ) : (
                    "⬆ send"
                  )}
                </button>
              </div>
              <p className="input-hint">Enter to send · Shift+Enter for new line</p>
            </form>
          </footer>
        </main>
      </div>

      <style jsx>{`
        .workspace {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #060606;
        }
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          border-bottom: 1px solid #151515;
          background: #080808;
          gap: 16px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .back-btn {
          font-family: "DM Mono", monospace;
          font-size: 11px;
          color: #b3b3b3;
          background: none;
          border: 1px solid #1a1a1a;
          border-radius: 3px;
          padding: 5px 10px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .back-btn:hover { color: #f59e0b; border-color: #f59e0b33; }
        .schema-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          border-radius: 20px;
          padding: 4px 12px;
        }
        .schema-icon { font-size: 13px; }
        .schema-name {
          font-family: "DM Mono", monospace;
          font-size: 11px;
          color: #d4d4d4;
        }
        .topbar-center { flex: 1; display: flex; justify-content: center; }
        .topbar-right {}
        .schema-toggle {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #b3b3b3;
          background: none;
          border: 1px solid #1a1a1a;
          border-radius: 3px;
          padding: 5px 10px;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.05em;
        }
        .schema-toggle:hover, .schema-toggle.open { color: #d4a84b; border-color: #d4a84b33; }
        .workspace-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        .schema-drawer {
          width: 320px;
          flex-shrink: 0;
          background: #080808;
          border-right: 1px solid #141414;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #111;
        }
        .drawer-title {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f59e0b;
        }
        .close-drawer {
          background: none;
          border: none;
          color: #d4d4d4;
          cursor: pointer;
          font-size: 11px;
          transition: color 0.15s;
        }
        .close-drawer:hover { color: #fff; }
        .schema-pre {
          flex: 1;
          overflow: auto;
          padding: 14px 16px;
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #3a3a3a;
          line-height: 1.8;
          margin: 0;
          white-space: pre-wrap;
        }
        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .messages-wrap {
          flex: 1;
          overflow-y: auto;
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .loading-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 3px;
          width: fit-content;
        }
        .pulse {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #f59e0b;
          border-radius: 50%;
          animation: pulse 0.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.6); }
        }
        .loading-text {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #b3b3b3;
          letter-spacing: 0.05em;
        }
        .input-bar {
          padding: 16px 28px 20px;
          border-top: 1px solid #111;
          background: #080808;
        }
        .input-form {}
        .input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #0a0a0a;
          border: 1px solid #1e1e1e;
          border-radius: 4px;
          padding: 2px 4px 2px 14px;
          transition: border-color 0.2s;
        }
        .input-wrap:focus-within {
          border-color: #f59e0b33;
        }
        .input-prefix {
          font-family: "DM Mono", monospace;
          font-size: 16px;
          color: #ffff;
          line-height: 1;
          flex-shrink: 0;
          margin-top: -20px;
        }
        .input-field {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-family: "DM Mono", monospace;
          font-size: 12.5px;
          color: #fffff0;
          resize: none;
          padding: 10px 0;
          line-height: 1.6;
          min-height: 40px;
          max-height: 120px;
        }
        .input-field::placeholder { color: #a3a3a3; }
        .input-field:disabled { opacity: 0.5; }
        .send-btn {
          flex-shrink: 0;
          background: #1a1500;
          border: 1px solid #f59e0b33;
          border-radius: 3px;
          padding: 8px 16px;
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #f59e0b;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          letter-spacing: 0.05em;
          align-self: flex-end;
          margin-bottom: 4px;
        }
        .send-btn:hover:not(:disabled) { background: #241c00; border-color: #f59e0b; }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .spin {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .input-hint {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #a3a3a3;
          margin: 5px 0 0;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
