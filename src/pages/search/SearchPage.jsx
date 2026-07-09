import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import FeedPage from "../feed/FeedPage.jsx";
import { search_users } from "../../services/message_api_service.js";

import "../../styles/search.css";

const RECENT_SEARCH_USERS_KEY = "recent_search_users";

function get_current_user() {
  const userData = localStorage.getItem("user");

  if (!userData) {
    return null;
  }

  try {
    const parsedUserData = JSON.parse(userData);
    const user = parsedUserData.user || parsedUserData;

    return {
      id: user.id || user._id || user.user_id,
      username: user.username,
    };
  } catch {
    return null;
  }
}

function get_user_id(user) {
  return user?.id || user?._id || user?.user_id || null;
}

function get_avatar_text(user) {
  const source = user?.username || user?.full_name || user?.fullName || "U";

  return source.charAt(0).toUpperCase();
}

function normalize_user(user) {
  return {
    id: get_user_id(user),
    username: user.username || "unknown",
    displayName: user.full_name || user.fullName || user.username || "Unknown",
    avatar: user.avatar || null,
    avatarText: get_avatar_text(user),
  };
}

function get_recent_search_users() {
  const recentUsersData = localStorage.getItem(RECENT_SEARCH_USERS_KEY);

  if (!recentUsersData) {
    return [];
  }

  try {
    const parsedRecentUsers = JSON.parse(recentUsersData);

    if (!Array.isArray(parsedRecentUsers)) {
      return [];
    }

    return parsedRecentUsers;
  } catch {
    return [];
  }
}

function save_recent_search_user(user) {
  const currentRecentUsers = get_recent_search_users();

  const nextRecentUsers = [
    user,
    ...currentRecentUsers.filter(
      (recentUser) => String(recentUser.id) !== String(user.id),
    ),
  ].slice(0, 8);

  localStorage.setItem(
    RECENT_SEARCH_USERS_KEY,
    JSON.stringify(nextRecentUsers),
  );

  return nextRecentUsers;
}

function SearchPage() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => get_current_user(), []);

  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [completedQuery, setCompletedQuery] = useState("");
  const [recentUsers, setRecentUsers] = useState(() =>
    get_recent_search_users(),
  );

  const normalizedQuery = searchQuery.trim();

  const hasSearchQuery = normalizedQuery.length >= 2;
  const hasCompletedCurrentSearch = completedQuery === normalizedQuery;

  const visibleUsers = hasSearchQuery && hasCompletedCurrentSearch ? users : [];

  useEffect(() => {
    const query = normalizedQuery;

    if (query.length < 2) {
      return;
    }

    let isActive = true;

    const timeoutId = window.setTimeout(async () => {
      try {
        const usersData = await search_users(query);

        if (!isActive) {
          return;
        }

        const normalizedUsers = usersData
          .map(normalize_user)
          .filter((user) => user.id)
          .filter((user) => String(user.id) !== String(currentUser?.id));

        setUsers(normalizedUsers);
        setCompletedQuery(query);
      } catch (error) {
        console.error("Failed to search users:", error.message);

        if (isActive) {
          setUsers([]);
          setCompletedQuery(query);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [normalizedQuery, currentUser]);

  function handleClearSearch() {
    setSearchQuery("");
    setUsers([]);
    setCompletedQuery("");
  }

  function handleOpenProfile(user) {
    const normalizedUser = normalize_user(user);
    const nextRecentUsers = save_recent_search_user(normalizedUser);

    setRecentUsers(nextRecentUsers);
    navigate(`/profile/${normalizedUser.username}`);
  }

  function handleOpenRecentProfile(user) {
    navigate(`/profile/${user.username}`);
  }

  function handleClearRecent() {
    localStorage.removeItem(RECENT_SEARCH_USERS_KEY);
    setRecentUsers([]);
  }

  return (
    <main className="search-page">
      <section className="search-panel">
        <h1>Search</h1>

        <div className="search-input-box">
          <Search size={16} strokeWidth={1.8} />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search"
            autoComplete="off"
          />

          {searchQuery && (
            <button
              type="button"
              className="search-clear-button"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {!hasSearchQuery && recentUsers.length === 0 && (
          <p className="search-hint">
            Type at least 2 characters to search users.
          </p>
        )}

        {!hasSearchQuery && recentUsers.length > 0 && (
          <div className="search-section">
            <div className="search-section-header">
              <h2>Recent</h2>

              <button
                type="button"
                className="search-clear-recent-button"
                onClick={handleClearRecent}
              >
                Clear all
              </button>
            </div>

            {recentUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                className="search-user-item"
                onClick={() => handleOpenRecentProfile(user)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.username} avatar`}
                    className="search-avatar-image"
                  />
                ) : (
                  <span className="search-avatar-fallback">
                    {user.avatarText || get_avatar_text(user)}
                  </span>
                )}

                <span className="search-user-info">
                  <span className="search-username">{user.username}</span>
                  <span className="search-display-name">
                    {user.displayName}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        {hasSearchQuery && (
          <div className="search-section">
            <h2>Results</h2>

            {!hasCompletedCurrentSearch && (
              <p className="search-empty-text">Searching users...</p>
            )}

            {hasCompletedCurrentSearch && visibleUsers.length === 0 && (
              <p className="search-empty-text">No users found.</p>
            )}

            {visibleUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                className="search-user-item"
                onClick={() => handleOpenProfile(user)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.username} avatar`}
                    className="search-avatar-image"
                  />
                ) : (
                  <span className="search-avatar-fallback">
                    {user.avatarText}
                  </span>
                )}

                <span className="search-user-info">
                  <span className="search-username">{user.username}</span>
                  <span className="search-display-name">
                    {user.displayName}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="search-feed-background">
        <FeedPage />
        <div className="search-feed-overlay" />
      </section>
    </main>
  );
}

export default SearchPage;
