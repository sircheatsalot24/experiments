import { useState, useCallback, useRef } from "react";
import { fetchMessageList, fetchMessage, fetchProfile, parseEmail } from "../api/gmail";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

export function useGmail() {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  const tokenClientRef = useRef(null);

  const loadEmails = useCallback(async (token, pageToken = null) => {
    const isFirstPage = !pageToken;
    if (isFirstPage) setLoading(true);
    else setLoadingMore(true);

    setError(null);

    try {
      const [profileData, listData] = await Promise.all([
        isFirstPage ? fetchProfile(token) : Promise.resolve(null),
        fetchMessageList(token, 20, "in:inbox", pageToken),
      ]);

      if (profileData) setProfile(profileData);

      const ids = listData.messages || [];
      setNextPageToken(listData.nextPageToken || null);

      // Fetch each email in parallel (batched)
      const parsed = await Promise.all(
        ids.map(({ id }) =>
          fetchMessage(token, id).then(parseEmail).catch(() => null)
        )
      );

      const valid = parsed.filter(Boolean);
      setEmails((prev) => (isFirstPage ? valid : [...prev, ...valid]));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const signIn = useCallback(() => {
    if (!window.google) {
      setError("Google Identity Services not loaded. Check your internet connection.");
      return;
    }

    if (!tokenClientRef.current) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
          if (response.error) {
            setError(`Sign in failed: ${response.error}`);
            return;
          }
          const token = response.access_token;
          setAccessToken(token);
          loadEmails(token);
        },
      });
    }

    tokenClientRef.current.requestAccessToken();
  }, [loadEmails]);

  const signOut = useCallback(() => {
    if (accessToken && window.google) {
      window.google.accounts.oauth2.revoke(accessToken);
    }
    setAccessToken(null);
    setProfile(null);
    setEmails([]);
    setNextPageToken(null);
    setError(null);
  }, [accessToken]);

  const loadMore = useCallback(() => {
    if (nextPageToken && accessToken) {
      loadEmails(accessToken, nextPageToken);
    }
  }, [nextPageToken, accessToken, loadEmails]);

  const refresh = useCallback(() => {
    if (accessToken) {
      setNextPageToken(null);
      loadEmails(accessToken);
    }
  }, [accessToken, loadEmails]);

  return {
    isSignedIn: !!accessToken,
    profile,
    emails,
    loading,
    loadingMore,
    error,
    hasMore: !!nextPageToken,
    signIn,
    signOut,
    loadMore,
    refresh,
  };
}
