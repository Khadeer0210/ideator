import express from "express";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import path from "path";

// Process-level unhandled rejection catching to prevent hard server crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('IDEATOR - SERVER FAULT INTERCEPTED (Unhandled Rejection):', reason);
});
process.on('uncaughtException', (error) => {
  console.error('IDEATOR - SERVER FAULT INTERCEPTED (Uncaught Exception):', error);
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Defensive JSON Body Parser (guards against payload too large or malformed)
  app.use(express.json({ limit: '5mb' }));
  
  // Syntax error interceptor for JSON body parsing
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err && err.status === 400 && 'body' in err) {
      return res.status(400).send({ error: "Malformed JSON payload intercepted." });
    }
    next();
  });

  // DeepSeek BRON MetaCognitive Action Engine
  app.post("/api/bron/action", async (req, res) => {
    try {
      const { action, profile, canvasContext } = req.body;
      
      if (!canvasContext || typeof canvasContext !== 'string') {
        return res.status(400).json({ error: "Invalid or missing 'canvasContext' parameter." });
      }

      if (!process.env.DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: "DEEPSEEK_API_KEY is not configured in environment variables." });
      }

      const openai = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: "https://api.deepseek.com", 
      });

      // Construct dynamic system prompt based on user profile and action
      let systemPrompt = `You are BRON, an ultra-advanced AI metacognitive engine running structurally inside a spatial canvas.
The operator's profile is: Role: ${profile?.role || 'Unknown'}, Trajectory: ${profile?.ambition || 'Unknown'}.
You must adapt your tone, complexity, and scale of thinking to accurately challenge and assist THIS specific profile.

`;

      if (action === 'red_team') {
        systemPrompt += `ACTION: DEVIL'S ADVOCATE (RED TEAM).
The user is providing an idea or context from their canvas. Your job is to aggressively pressure test it. Find fatal flaws, market vulnerabilities, technical impossibilities, or competitor threats.
Respond strictly in JSON format.
{
  "attacks": [
    { "type": "constraint", "text": "Short brutal critique 1" },
    { "type": "threat", "text": "Short brutal critique 2" }
  ]
}`;
      } else if (action === 'what_if') {
        systemPrompt += `ACTION: WHAT-IF SPLINTERING.
The user is providing an idea. Generate 3 radical alternative reality pivots. What if they flipped the business model? What if they open-sourced it? What if they targeted a completely different industry?
Respond strictly in JSON format.
{
  "pivots": [
    { "title": "Pivot 1", "description": "Detail..." },
    { "title": "Pivot 2", "description": "Detail..." }
  ]
}`;
      } else if (action === 'analyze') {
        systemPrompt += `ACTION: DEEP ANALYSIS.
Analyze the idea and break it down into spatial nodes.
Respond strictly in JSON format.
{
  "feasibility": {"score": 85, "insight": "Technical feasibility summary..."},
  "market": {"score": 60, "insight": "Market landscape summary..."},
  "constraints": {"severity": "High", "insight": "Critical roadblocks..."},
  "novelty": {"score": 90, "insight": "Is this genuinely new?..."}
}`;
      } else {
         systemPrompt += `Analyze the provided context and return structured JSON. {"insight": "General analysis"}`;
      }

      const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `CANVAS CONTEXT:\n${canvasContext}` },
        ],
        response_format: { type: "json_object" },
      });

      const resultContent = response.choices[0].message.content;
      
      let parsed = {};
      try {
        parsed = JSON.parse(resultContent || '{}');
      } catch (parseError) {
        return res.status(500).json({ error: "BRON Engine returned structurally invalid data." });
      }
      
      res.json(parsed);
    } catch (error: any) {
      console.error("BRON DeepSeek Routing Error:", error);
      res.status(500).json({ error: error?.message || "Failed to process internal BRON neural pathways." });
    }
  });

  // DeepSeek BRON MetaCognitive Stream Endpoint (Chat)
  app.post("/api/bron/chat", async (req, res) => {
    try {
      const { messages, profile } = req.body;
      
      if (!process.env.DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: "DEEPSEEK_API_KEY is not configured." });
      }

      const openai = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: "https://api.deepseek.com", 
      });

      const systemPrompt = `You are BRON, an ultra-advanced AI metacognitive engine running structurally inside a spatial canvas.
The operator's profile is: Role: ${profile?.role || 'Unknown'}, Trajectory: ${profile?.ambition || 'Unknown'}.
Use markdown extensively to structure your thoughts (bolding, lists, code blocks). Do not regurgitate generic advice. Be sharp, brilliant, and slightly ominous.`;

      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role === 'bron' ? 'assistant' : 'user',
          content: m.content
        }))
      ];

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: apiMessages,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error("BRON Stream Error:", error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  });

  // Vite Middleware integration for Full-Stack Hot-Reloading
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Catcher for Express Routes
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global Server Error Intercepted:", err.stack);
    res.status(500).json({ error: "CRITICAL: Internal System Failure." });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IDEATOR Backend Server engaged at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to initialize server:", err);
});
