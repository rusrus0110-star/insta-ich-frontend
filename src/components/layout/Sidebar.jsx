import {
  CirclePlus,
  Compass,
  Heart,
  Home,
  MessageCircle,
  Search,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import ichgra_logo from "../../assets/ichgra_logo.png";
import useAuth from "../../hooks/useAuth.js";

function Sidebar() {
  const { user } = useAuth();

  const profile_link = user?.username
    ? `/profile/${user.username}`
    : "/profile/ruslan";

  const nav_items = [
    {
      label: "Home",
      to: "/feed",
      icon: Home,
    },
    {
      label: "Search",
      to: "/search",
      icon: Search,
    },
    {
      label: "Explore",
      to: "/explore",
      icon: Compass,
    },
    {
      label: "Messages",
      to: "/messages",
      icon: MessageCircle,
    },
    {
      label: "Notifications",
      to: "/notifications",
      icon: Heart,
    },
    {
      label: "Create",
      to: "/create-post",
      icon: CirclePlus,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <NavLink to="/feed" className="sidebar-logo-link">
          <img src={ichgra_logo} alt="ICHgram" className="sidebar-logo" />
        </NavLink>

        <nav className="sidebar-nav">
          {nav_items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
                }
              >
                <Icon size={20} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <NavLink
          to={profile_link}
          className={({ isActive }) =>
            isActive
              ? "sidebar-link sidebar-link-active sidebar-profile"
              : "sidebar-link sidebar-profile"
          }
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="sidebar-profile-avatar"
            />
          ) : (
            <User size={20} strokeWidth={1.8} />
          )}

          <span>Profile</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
