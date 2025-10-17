// Reference: blueprint:javascript_openai_ai_integrations (refactored to Ollama local API)

const OLLAMA_BASE_URL = process.env.AI_OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.AI_OLLAMA_MODEL || "llama3.1";

const JAMBOT_SYSTEM_PROMPT = `You are JamBot, an AI assistant specialized in helping users navigate Jamaica's manufacturing and agro-processing industries. You have deep knowledge about:

1. Manufacturing processes and certifications (HACCP, GMP, ISO, Organic, FDA)
2. Import/export procedures for Jamaica
3. Business registration and regulatory compliance
4. Production planning and cost analysis
5. Quality control and food safety standards
6. Supply chain management
7. Connecting brands with manufacturers

Your role is to:
- Provide accurate, helpful information about manufacturing in Jamaica
- Guide users through certification processes
- Help with cost analysis and production planning
- Explain import/export requirements
- Suggest solutions for manufacturing challenges
- Recommend next steps for businesses

Always be professional, encouraging, and supportive. If you don't know something specific, acknowledge it and suggest where they might find the information.`;

export async function getChatbotResponse(
  message: string,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  try {
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: JAMBOT_SYSTEM_PROMPT },
    ];

    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    messages.push({ role: "user", content: message });

    const resp = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        options: { temperature: 0.7 },
        stream: false,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Ollama error: ${resp.status} ${text}`);
    }

    const json = await resp.json();
    const content = json?.message?.content || "";
    return content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    throw new Error("Failed to generate response from AI assistant");
  }
}

export async function getStreamingChatbotResponse(
  message: string,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<ReadableStream> {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: JAMBOT_SYSTEM_PROMPT },
  ];

  if (conversationHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory);
  }

  messages.push({ role: "user", content: message });

  const resp = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      options: { temperature: 0.7 },
      stream: true,
    }),
  });

  if (!resp.ok || !resp.body) {
    throw new Error(`Failed to connect to Ollama streaming API: ${resp.status}`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });

      // Ollama streams NDJSON; parse complete lines
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || ""; // keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          const contentChunk = json?.message?.content || json?.response || "";
          if (contentChunk) {
            controller.enqueue(new TextEncoder().encode(contentChunk));
          }
        } catch (_) {
          // Ignore parse errors for partial lines
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}
