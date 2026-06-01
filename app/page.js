"use client";
import React, { useState } from "react";

// Pre-configured database templates to make testing immediate
const INITIAL_SCHEMAS = [
  {
    id: "schema-1",
    name: "E-Commerce System",
    content: `Users (id INT PK, name VARCHAR, email VARCHAR, created_at TIMESTAMP)\nOrders (id INT PK, user_id INT FK -> Users.id, amount DECIMAL, date TIMESTAMP)\nOrder_Items (id INT PK, order_id INT FK -> Orders.id, product_name VARCHAR, quantity INT)`
  },
  {
    id: "schema-2",
    name: "SaaS Analytics Platform",
    content: `Subscriptions (id INT, company_id INT, plan_name VARCHAR, monthly_price DOUBLE)\nUsage_Logs (log_id INT, company_id INT, data_consumed_gb INT, log_date DATE)`
  }
];

const LANGUAGES = ["PostgreSQL", "MySQL", "SQLite", "MSSQL", "Oracle SQL"];

export default function SQLBuilderApp() {
  const [dialects] = useState(LANGUAGES);
  const [selectedDialect, setSelectedDialect] = useState(LANGUAGES[0]);
  
  const [schemas, setSchemas] = useState(INITIAL_SCHEMAS);
  const [activeSchemaId, setActiveSchemaId] = useState(INITIAL_SCHEMAS[0].id);
  
  // State management for uploading custom schemas
  const [newSchemaName, setNewSchemaName] = useState("");
  const [newSchemaContent, setNewSchemaContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Tracks unique chat channels mapped precisely to each schema's ID
  const [chats, setChats] = useState({
    "schema-1": [{ role: "assistant", text: "-- Select a Dialect and start typing your request below!" }],
    "schema-2": [{ role: "assistant", text: "-- Schema selected. Ready for queries." }]
  });
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeSchema = schemas.find(s => s.id === activeSchemaId) || schemas[0];
  const currentChat = chats[activeSchemaId] || [];

  // Handles text-area custom schema submissions
  const handleAddSchema = (e) => {
    e.preventDefault();
    if (!newSchemaName || !newSchemaContent) return;

    const newId = `schema-${Date.now()}`;
    const newSchema = { id: newId, name: newSchemaName, content: newSchemaContent };
    
    setSchemas([...schemas, newSchema]);
    setChats(prev => ({ 
      ...prev, 
      [newId]: [{ role: "assistant", text: `-- Schema '${newSchemaName}' loaded successfully.` }] 
    }));
    setActiveSchemaId(newId);
    setNewSchemaName("");
    setNewSchemaContent("");
    setIsUploading(false);
  };

  // Parses raw uploaded .sql or .txt files into text state 
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewSchemaName(file.name.replace(/\.[^/.]+$/, "")); 
      setNewSchemaContent(event.target.result);
    };
    reader.readAsText(file);
  };

  // Makes the API network request to your Next.js backend endpoint
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userPrompt = inputMessage;
    setInputMessage("");

    // Render user message to UI immediately
    const updatedHistory = [...currentChat, { role: "user", text: userPrompt }];
    setChats(prev => ({ ...prev, [activeSchemaId]: updatedHistory }));
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schema: activeSchema.content,
          dialect: selectedDialect,
          prompt: userPrompt
        })
      });

      const data = await response.json();

      setChats(prev => ({
        ...prev,
        [activeSchemaId]: [...updatedHistory, { role: "assistant", text: data.query || `-- Error: ${data.error}` }]
      }));
    } catch (err) {
      setChats(prev => ({
        ...prev,
        [activeSchemaId]: [...updatedHistory, { role: "assistant", text: "-- Execution Error: Failed to reach text-to-sql compilation API." }]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR: Dialect Selection & Schema Management */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col p-4 space-y-6">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            🔀 Text-to-SQL Compiler
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gemini AI Semantic Query engine</p>
        </div>

        {/* SQL Dialect Dropdown */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">Target Database Engine</label>
          <select 
            value={selectedDialect}
            onChange={(e) => setSelectedDialect(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-emerald-500 text-slate-100"
          >
            {dialects.map(d => <option key={d} value={d} className="bg-slate-800">{d}</option>)}
          </select>
        </div>

        {/* Schema Control Center */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">Active Relational Schemas</label>
            <button 
              type="button"
              onClick={() => setIsUploading(!isUploading)}
              className="text-xs text-emerald-400 hover:underline"
            >
              {isUploading ? "Cancel" : "+ Upload New"}
            </button>
          </div>

          {isUploading ? (
            /* Upload custom schemas panel */
            <form onSubmit={handleAddSchema} className="bg-slate-800 border border-slate-700 rounded p-3 space-y-3 overflow-y-auto">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Upload Schema File</label>
                <input type="file" accept=".sql,.txt,.json" onChange={handleFileUpload} className="text-xs block w-full text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600"/>
              </div>
              <div>
                <input 
                  type="text" placeholder="Schema Context Name" value={newSchemaName} onChange={(e) => setNewSchemaName(e.target.value)} required
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs focus:outline-none focus:border-emerald-500 text-slate-100"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Paste table DDL scripts or descriptions..." rows={4} value={newSchemaContent} onChange={(e) => setNewSchemaContent(e.target.value)} required
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs focus:outline-none focus:border-emerald-500 font-mono text-slate-100"
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs font-bold py-1.5 rounded transition">Inject Schema Context</button>
            </form>
          ) : (
            /* Standard Schema selector list */
            <div className="space-y-1 overflow-y-auto flex-1 pr-1">
              {schemas.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSchemaId(s.id)}
                  className={`w-full text-left p-2.5 rounded text-sm transition block ${activeSchemaId === s.id ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300" : "bg-slate-800/50 border border-transparent hover:bg-slate-800 text-slate-300"}`}
                >
                  <div className="font-medium truncate">{s.name}</div>
                  <div className="text-xs text-slate-500 truncate mt-0.5 font-mono">{s.content.substring(0, 45)}...</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* CORE CONTENT: Splitting Schema View & Live Interactive Console */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Active Context Preview Window */}
        <section className="w-full md:w-1/3 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col overflow-hidden">
          <div className="mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Active Schema Context Window</span>
            <h2 className="text-lg font-bold text-slate-200 mt-0.5">{activeSchema.name}</h2>
          </div>
          <pre className="flex-1 bg-slate-900/50 border border-slate-800 rounded p-3 text-xs font-mono text-cyan-400 overflow-auto whitespace-pre-wrap📦">
            {activeSchema.content}
          </pre>
        </section>

        {/* Terminal Compilation Output / Conversational Sandbox */}
        <section className="flex-1 flex flex-col bg-slate-900/20 overflow-hidden">
          
          {/* Chat Stream History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {currentChat.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide mb-1 px-1">
                  {msg.role === "user" ? "English Intent" : `${selectedDialect} Compilation Output`}
                </span>
                
                {msg.role === "user" ? (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 max-w-xl text-sm text-slate-200 shadow-sm">
                    {msg.text}
                  </div>
                ) : (
                  /* Dynamic code display wrapper */
                  <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-lg shadow-md overflow-hidden font-mono text-sm">
                    <div className="bg-slate-800/70 px-4 py-1.5 border-b border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-emerald-400 font-bold">✓ SQL Code Blocks</span>
                    </div>
                    <pre className="p-4 text-emerald-400 overflow-x-auto whitespace-pre-wrap selection:bg-emerald-900">
                      {msg.text}
                    </pre>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono bg-slate-900 p-3 rounded border border-slate-800 max-w-xs">
                <span className="animate-pulse block w-2 h-2 bg-emerald-400 rounded-full"></span>
                <span>Gemini structural analysis runtime...</span>
              </div>
            )}
          </div>

          {/* Prompt Entry Form */}
          <footer className="p-4 border-t border-slate-800 bg-slate-950">
            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask for a ${selectedDialect} query using plain English...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-500 text-slate-100"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-100 disabled:text-slate-500 font-semibold px-5 py-3 rounded-lg text-sm transition shadow-md whitespace-nowrap"
              >
                Compile SQL
              </button>
            </form>
          </footer>
        </section>

      </main>
    </div>
  );
}