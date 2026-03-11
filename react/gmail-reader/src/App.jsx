import { useGmail } from "./hooks/useGmail";
import AuthScreen from "./components/AuthScreen";
import Header from "./components/Header";
import EmailList from "./components/EmailList";
import styles from "./App.module.css";

export default function App() {
  const {
    isSignedIn,
    profile,
    emails,
    loading,
    loadingMore,
    error,
    hasMore,
    signIn,
    signOut,
    loadMore,
    refresh,
  } = useGmail();

  if (!isSignedIn) {
    return <AuthScreen onSignIn={signIn} error={error} />;
  }

  return (
    <div className={styles.app}>
      <Header
        profile={profile}
        onSignOut={signOut}
        onRefresh={refresh}
        loading={loading}
      />
      <main className={styles.main}>
        <EmailList
          emails={emails}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          error={error}
        />
      </main>
    </div>
  );
}
