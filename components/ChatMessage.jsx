"use client";
import { useState } from "react";

export default function ChatMessage({ message, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === "user") {
    return (
      <div className="user-msg-wrap">
        <div className="user-bubble">
          <span className="msg-tag">You</span>
          <p className="msg-text">{message.text}</p>
        </div>

        <style jsx>{`
          .user-msg-wrap {
            display: flex;
            justify-content: flex-end;
            padding: 4px 0;
          }
          .user-bubble {
            max-width: 480px;
            background: #212121;
            border: 1px solid #333;
            border-radius: 20px 20px 0 20px;
            padding: 12px 16px;
          }
          .msg-tag {
            display: block;
            font-family: "DM Mono", monospace;
            font-size: 9px;
            letter-spacing: 0.12em;
            color: #b3b3b3;
            text-transform: uppercase;
            margin-bottom: 6px;
          }
          .msg-text {
            font-size: 13px;
            color: #ffffff;
            margin: 0;
            line-height: 1.6;
            font-family: "DM Mono", monospace;
          }
        `}</style>
      </div>
    );
  }

  const isError = message.text?.startsWith("-- Error") || message.text?.startsWith("-- Execution");
  const lineCount = message.text?.split("\n").length || 0;

  return (
    <div className="ai-msg-wrap">
      <div className={`ai-block ${isError ? "error" : ""}`}>
        <div className="ai-header">
          <div className="ai-header-left">
            <span className="ai-dot" />
            <span className="ai-tag">{language?.label || "SQL"} Output</span>
            <span className="ai-lines">{lineCount} lines</span>
          </div>
          <button type="button" className="copy-btn" onClick={handleCopy}>
            {copied ? "✓ copied" : "copy"}
          </button>
        </div>
        <div className="code-body">
          <div className="line-nums">
            {message.text?.split("\n").map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <pre className="code-content">{message.text}</pre>
        </div>
      </div>

      <style jsx>{`
        .ai-msg-wrap {
          padding: 4px 0;
          max-width: 760px;
        }
        .ai-block {
          // background: #212121;
          border: 2px solid #1e1e1e;
          border-radius: 4px;
          overflow: hidden;
        }
        .ai-block.error {
          border-color: #3d1515;
        }
        .ai-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          border-bottom: 1px solid #141414;
          background: #0d0d0d;
        }
        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ai-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${isError ? "#ef4444" : "#f59e0b"};
          display: inline-block;
        }
        .ai-tag {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          color: ${isError ? "#ef4444" : "#f59e0b"};
          text-transform: uppercase;
        }
        .ai-lines {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #a3a3a3;
        }
        .copy-btn {
          font-family: "DM Mono", monospace;
          font-size: 9px;
          color: #d4d4d4;
          background: none;
          border: 1px solid #a3a3a3;
          padding: 3px 8px;
          border-radius: 2px;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.15s;
        }
        .copy-btn:hover {
          color: #f59e0b;
          border-color: #f59e0b33;
        }
        .code-body {
          display: flex;
          overflow-x: auto;
        }
        .line-nums {
          display: flex;
          flex-direction: column;
          padding: 14px 12px 14px 14px;
          border-right: 1px solid #111;
          min-width: 36px;
          text-align: right;
          user-select: none;
        }
        .line-nums span {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          color: #a3a3a3;
          line-height: 1.8;
        }
        .code-content {
          flex: 1;
          padding: 14px 16px;
          font-family: "DM Mono", monospace;
          font-size: 12px;
          color: ${isError ? "#ef4444" : "#d4a84b"};
          line-height: 1.8;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
