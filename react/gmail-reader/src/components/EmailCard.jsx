import { useState, useCallback } from "react";
import { analyzeEmail } from "../api/claude";
import styles from "./EmailCard.module.css";

const PRIORITY_CONFIG = {
  high: { label: "High", color: "var(--red)", bg: "var(--red-muted)" },
  medium: { label: "Medium", color: "var(--amber)", bg: "var(--amber-muted)" },
  low: { label: "Low", color: "var(--green)", bg: "var(--green-muted)" },
};

const CATEGORY_ICONS = {
  Work: "💼",
  Finance: "💰",
  Social: "💬",
  Newsletter: "📰",
  Notification: "🔔",
  Shopping: "🛍️",
  Travel: "✈️",
  Other: "📧",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  if (diffHours < 24 * 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function parseSender(from) {
  const match = from?.match(/^"?([^"<]+?)"?\s*<?[^>]*>?$/);
  const name = match?.[1]?.trim() || from || "Unknown";
  const emailMatch = from?.match(/<([^>]+)>/);
  const email = emailMatch?.[1] || from || "";
  return { name, email };
}

export default function EmailCard({ email }) {
  const [expanded, setExpanded] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);

  const { name, email: senderEmail } = parseSender(email.from);
  const priority = analysis ? PRIORITY_CONFIG[analysis.priority] || PRIORITY_CONFIG.medium : null;

  const handleExpand = useCallback(async () => {
    setExpanded((prev) => {
      const next = !prev;
      if (next && !analysis && !analyzing) {
        setAnalyzing(true);
        setAnalyzeError(null);
        analyzeEmail(email)
          .then(setAnalysis)
          .catch((err) => setAnalyzeError(err.message))
          .finally(() => setAnalyzing(false));
      }
      return next;
    });
  }, [email, analysis, analyzing]);

  return (
    <div
      className={`${styles.card} ${email.isUnread ? styles.unread : ""} ${expanded ? styles.expanded : ""}`}
    >
      {/* Collapsed row */}
      <button className={styles.row} onClick={handleExpand}>
        <div className={styles.sender}>
          <div className={styles.avatar}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.senderInfo}>
            <span className={styles.name}>{name}</span>
            {email.isUnread && <span className={styles.unreadDot} />}
          </div>
        </div>

        <div className={styles.middle}>
          <span className={styles.subject}>{email.subject}</span>
          <span className={styles.snippet}>{email.snippet}</span>
        </div>

        <div className={styles.right}>
          {analysis && (
            <span
              className={styles.priorityBadge}
              style={{ color: priority.color, background: priority.bg }}
            >
              {priority.label}
            </span>
          )}
          {email.isStarred && <span className={styles.star}>★</span>}
          <span className={styles.date}>{formatDate(email.date)}</span>
          <span className={styles.chevron}>{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className={styles.body}>
          <div className={styles.emailMeta}>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>From</span>
              <span>{name} &lt;{senderEmail}&gt;</span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Date</span>
              <span>{email.date}</span>
            </span>
          </div>

          {analyzing && (
            <div className={styles.analyzing}>
              <span className={styles.dots}>
                <span />
                <span />
                <span />
              </span>
              Claude is analyzing this email...
            </div>
          )}

          {analyzeError && (
            <div className={styles.analyzeError}>
              ⚠️ Analysis failed: {analyzeError}
            </div>
          )}

          {analysis && (
            <div className={styles.analysis}>
              {/* Category + priority header */}
              <div className={styles.analysisHeader}>
                <span className={styles.category}>
                  {CATEGORY_ICONS[analysis.category] || "📧"} {analysis.category}
                </span>
                <span
                  className={styles.priorityFull}
                  style={{ color: priority.color, background: priority.bg }}
                >
                  {priority.label} Priority · {analysis.priorityReason}
                </span>
              </div>

              {/* Summary */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <span>📋</span> Summary
                </h3>
                <p className={styles.summary}>{analysis.summary}</p>
              </div>

              {/* Action items */}
              {analysis.actionItems?.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <span>✅</span> Action Items
                  </h3>
                  <ul className={styles.actions}>
                    {analysis.actionItems.map((item, i) => (
                      <ActionItem key={i} text={item} />
                    ))}
                  </ul>
                </div>
              )}

              {analysis.actionItems?.length === 0 && (
                <div className={styles.noActions}>
                  No action required
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActionItem({ text }) {
  const [done, setDone] = useState(false);
  return (
    <li
      className={`${styles.actionItem} ${done ? styles.actionDone : ""}`}
      onClick={() => setDone((d) => !d)}
    >
      <span className={styles.checkbox}>{done ? "✓" : ""}</span>
      <span className={styles.actionText}>{text}</span>
    </li>
  );
}
