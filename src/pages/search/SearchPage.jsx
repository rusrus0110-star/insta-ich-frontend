import { useState } from "react";

import FeedPage from "../feed/FeedPage.jsx";

const mockRecentUsers = [
  {
    id: 1,
    username: "sashaa",
    fullName: "Sasha",
  },
];

function SearchAvatar({ username }) {
  const firstLetter = username?.charAt(0).toUpperCase() || "U";

  return <div className="search-avatar">{firstLetter}</div>;
}

function SearchUserItem({ user }) {
  return (
    <article className="search-user-row">
      <SearchAvatar username={user.username} />

      <div className="search-user-info">
        <p>{user.username}</p>
      </div>
    </article>
  );
}

function SearchPage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <section className="search-page">
      <div className="search-feed-background">
        <FeedPage />
      </div>

      <div className="search-layer">
        <aside className="search-panel">
          <h1>Search</h1>

          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchValue}
              placeholder="Search"
              onChange={(event) => setSearchValue(event.target.value)}
            />

            <button
              type="button"
              className="search-clear-button"
              onClick={() => setSearchValue("")}
              aria-label="Clear search"
            >
              ×
            </button>
          </div>

          <div className="search-section">
            <h2>Recent</h2>

            <div className="search-user-list">
              {mockRecentUsers.map((user) => (
                <SearchUserItem key={user.id} user={user} />
              ))}
            </div>
          </div>
        </aside>

        <div className="search-overlay" />
      </div>
    </section>
  );
}

export default SearchPage;
