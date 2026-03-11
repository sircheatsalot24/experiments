const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

async function gmailFetch(path, token, params = {}) {
  const url = new URL(`${GMAIL_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gmail API error ${res.status}`);
  }

  return res.json();
}

export async function fetchProfile(token) {
  return gmailFetch("/profile", token);
}

export async function fetchMessageList(token, maxResults = 25, query = "in:inbox") {
  return gmailFetch("/messages", token, { maxResults, q: query });
}

export async function fetchMessage(token, id) {
  return gmailFetch(`/messages/${id}`, token, { format: "full" });
}

// Decode base64url-encoded email body
function decodeBase64(data) {
  if (!data) return "";
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return atob(base64);
  }
}

// Recursively extract text from MIME parts
function extractText(payload) {
  if (!payload) return { plain: "", html: "" };

  let plain = "";
  let html = "";

  function walk(part) {
    const mimeType = part.mimeType || "";
    if (mimeType === "text/plain" && part.body?.data) {
      plain += decodeBase64(part.body.data) + "\n";
    } else if (mimeType === "text/html" && part.body?.data) {
      html += decodeBase64(part.body.data);
    } else if (part.parts) {
      part.parts.forEach(walk);
    }
  }

  walk(payload);
  return { plain, html };
}

// Strip HTML tags for Claude input
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function parseEmail(message) {
  const headers = message.payload?.headers || [];
  const get = (name) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

  const { plain, html } = extractText(message.payload);

  // Prefer plain text, fall back to stripped HTML
  let body = plain.trim() || stripHtml(html);

  // Truncate very long emails for Claude
  if (body.length > 6000) body = body.slice(0, 6000) + "\n\n[... email truncated ...]";

  const labels = message.labelIds || [];

  return {
    id: message.id,
    threadId: message.threadId,
    subject: get("Subject") || "(No Subject)",
    from: get("From"),
    to: get("To"),
    date: get("Date"),
    snippet: message.snippet || "",
    body,
    isUnread: labels.includes("UNREAD"),
    isStarred: labels.includes("STARRED"),
    hasAttachment: labels.includes("HAS_ATTACHMENT"),
    labels,
  };
}
