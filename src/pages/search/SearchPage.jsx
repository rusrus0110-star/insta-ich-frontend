import { useState } from "react";
import { Search } from "lucide-react";

import { search_users } from "../../api/users_api.js";
import Avatar from "../../components/common/Avatar.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

function SearchPage() {
  const [query, set_query] = useState("");
  const [users, set_users] = useState([]);
  const [error, set_error] = useState("");
  const [is_loading, set_is_loading] = useState(false);

  const handle_submit = async (event) => {
    event.preventDefault();

    if (!query.trim()) {
      set_users([]);
      return;
    }

    try {
      set_error("");
      set_is_loading(true);

      const data = await search_users(query.trim());

      set_users(data.users || []);
    } catch (err) {
      set_error(err.response?.data?.message || "Could not search users");
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <section className="main-page main-panel-page">
      <div className="side-panel">
        <h1>Search</h1>

        <form className="search-form" onSubmit={handle_submit}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(event) => set_query(event.target.value)}
          />
        </form>

        <ErrorMessage message={error} />

        <div className="panel-list">
          {is_loading && <p className="panel-muted">Searching...</p>}

          {!is_loading && users.length === 0 && (
            <p className="panel-muted">No results yet</p>
          )}

          {users.map((user) => (
            <div className="panel-user-item" key={user.id || user._id}>
              <Avatar src={user.avatar} username={user.username} size={42} />

              <div>
                <p className="panel-user-name">{user.username}</p>
                <p className="panel-user-subtitle">{user.full_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="main-overlay-preview" />
    </section>
  );
}

export default SearchPage;
