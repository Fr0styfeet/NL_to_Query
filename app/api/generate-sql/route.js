import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini SDK using the API key stored in your .env.local file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    // 1. Extract the schema data, SQL dialect, and English prompt from the incoming frontend request
    const { schema, dialect, prompt } = await req.json();

    // Validation: make sure the frontend actually sent all required pieces of data
    if (!schema || !dialect || !prompt) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // 2. Construct the strict System Instruction to prime Gemini's behavior
    const systemInstruction = `
      You are an expert database administrator and SQL developer.
      Your task is to convert natural language requests into mathematically precise, optimized SQL queries based strictly on the provided database schema.
      
      TARGET SQL DIALECT: ${dialect}
      
      DATABASE SCHEMA:
      ${schema}
      
      RULES:
      1. ONLY return the executable SQL query string. 
      2. Do NOT wrap the code in markdown code blocks like \`\`\`sql ... \`\`\`.
      3. Do NOT provide any explanations, comments, or introductory text.
      4. If the request cannot be fulfilled by the schema, return a comment starting with '-- Error: ' explaining why.
    `;

    // 3. Dispatch the payload to the gemini-2.5-flash model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1, // Forces deterministic, non-creative, precise code output
      }
    });

    const sqlQuery = response.text.trim();

    // 4. Return the clean SQL query string back to the client interface
    return new Response(JSON.stringify({ query: sqlQuery }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate query" }), { status: 500 });
  }
}