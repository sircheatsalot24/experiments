import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function analyzeEmail(email) {
  const prompt = `You are analyzing an email for a busy professional. Be concise and practical.

From: ${email.from}
Subject: ${email.subject}
Date: ${email.date}

Email body:
---
${email.body || email.snippet}
---

Respond in this exact JSON format (no markdown, no code block, just raw JSON):
{
  "summary": "2-3 sentence plain-English summary of what this email is about",
  "priority": "high|medium|low",
  "priorityReason": "one sentence explaining why",
  "actionItems": [
    "Specific action item 1",
    "Specific action item 2"
  ],
  "category": "one of: Work, Finance, Social, Newsletter, Notification, Shopping, Travel, Other"
}

If there are no action items needed, return an empty array. Be direct and actionable.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0]?.text || "{}";

  try {
    return JSON.parse(text);
  } catch {
    // Attempt to extract JSON if Claude added any surrounding text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Failed to parse Claude response");
  }
}
