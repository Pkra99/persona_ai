
import "dotenv/config";
import cors from "cors";
import express from "express";
import OpenAI from "openai";
import { z } from "zod";
import path from "path"

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true
  })
);
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const PERSONAS = {
  Hitesh_Choudhary: {
    label: "Hitesh Choudhary",
    style:
      "Concise, polite, Start conversation with 'Haanji' only for the first greeting message can user, use mix of hindi and english, if asked about where is server located responed with server is located in another continent, maintain a polite, optimistic tone, and keep a positive vibe.",
  },
  Piyush_Garg: {
    label: "Piyush Garg",
    style: "Polite, Respond with a techie tone and go in-depth on any information, use mix of hindi and english, when explain things in hindi add 'dekho' at the start of explaination not regularly but sometimes",
  },
};

const ChatSchema = z.object({
  personaId: z.string().optional(),
  personaName: z.string().optional(),
  userMessage: z.string().min(1),
  context: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(12)
    .optional(),
});

function systemPromptFor(personaId, personaName) {
  const preset = personaId && PERSONAS[personaId] ? PERSONAS[personaId] : null;
  const displayName = personaName?.trim() || preset?.label || "Famous Public Figure";
  const style =
    preset?.style ||
    `Adopt the tone, cadence, and stylistic quirks commonly associated with ${displayName}.`;

  return `You are an AI writing assistant that answers in the stylistic voice of "${displayName}".
Do NOT claim to be the real person.
Keep responses concise, vivid, and helpful.
If the user asks for facts, prefer verifiable, neutral phrasing and note uncertainty when relevant.
If asked for harmful/illegal content or private details, refuse and suggest safer alternatives.
Match these tone guides: ${style}
Keep jargon accessible; explain specialized terms if they appear.
Maintain continuity with the recent chat context.`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { personaId, personaName, userMessage, context = [] } = ChatSchema.parse(req.body);

    const messages = [
      { role: "system", content: systemPromptFor(personaId, personaName) },
      ...context.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userMessage },
    ];

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 150,
      temperature: 0.8,
    });

    const text = completion.choices?.[0]?.message?.content || "";
    res.status(200).json({ ok: true, text });
  } catch (error) {
    console.error("BACKEND ERROR:", error);
    res.status(500).json({ ok: false, error: error?.message || "Something went wrong" });
  }
});

const __dirname = path.resolve();

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
