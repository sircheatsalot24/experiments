import EmailCard from "./EmailCard";
import styles from "./EmailList.module.css";

export default function EmailList({ emails, loading, loadingMore, hasMore, onLoadMore, error }) {
  if (loading) {
    return (
      <div className={styles.container}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <span className={styles.errorIcon}>⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!emails.length) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📭</span>
        <p>Your inbox is empty</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.countBar}>
        <span className={styles.count}>{emails.length} emails</span>
        <span className={styles.hint}>Click an email to analyze with Claude</span>
      </div>

      <div className={styles.list}>
        {emails.map((email) => (
          <EmailCard key={email.id} email={email} />
        ))}
      </div>

      {hasMore && (
        <button
          className={styles.loadMore}
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? (
            <>
              <span className={styles.spinner} /> Loading...
            </>
          ) : (
            "Load more emails"
          )}
        </button>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.skeletonLines}>
        <div className={styles.skeletonLine} style={{ width: "120px" }} />
        <div className={styles.skeletonLine} style={{ width: "240px", height: "10px" }} />
      </div>
      <div className={styles.skeletonDate} />
    </div>
  );
}
