import styles from "./Header.module.css";

export default function Header({ profile, onSignOut, onRefresh, loading }) {
  const name = profile?.emailAddress?.split("@")[0] || "User";
  const email = profile?.emailAddress || "";

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.logo}>✉️</span>
        <div>
          <h1 className={styles.title}>Gmail Digest</h1>
          <p className={styles.email}>{email}</p>
        </div>
      </div>

      <div className={styles.right}>
        <button
          className={styles.refreshBtn}
          onClick={onRefresh}
          disabled={loading}
          title="Refresh inbox"
        >
          <span className={loading ? styles.spinning : ""}>↻</span>
          Refresh
        </button>

        <div className={styles.avatar}>
          {name.charAt(0).toUpperCase()}
        </div>

        <button className={styles.signOutBtn} onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}
