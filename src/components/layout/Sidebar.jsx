import {
  Bell,
  Compass,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth.js";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handle_logout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">ICHgram</div>

      <nav className="sidebar-nav">
        <NavLink to="/feed" className="sidebar-link">
          <Home size={22} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/search" className="sidebar-link">
          <Search size={22} />
          <span>Search</span>
        </NavLink>

        <NavLink to="/explore" className="sidebar-link">
          <Compass size={22} />
          <span>Explore</span>
        </NavLink>

        <NavLink to="/messages" className="sidebar-link">
          <MessageCircle size={22} />
          <span>Messages</span>
        </NavLink>

        <NavLink to="/notifications" className="sidebar-link">
          <Bell size={22} />
          <span>Notifications</span>
        </NavLink>

        <NavLink to="/create-post" className="sidebar-link">
          <PlusSquare size={22} />
          <span>Create</span>
        </NavLink>

        <NavLink to="/profile" className="sidebar-link">
          <User size={22} />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-name">{user?.username || "user"}</div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handle_logout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
