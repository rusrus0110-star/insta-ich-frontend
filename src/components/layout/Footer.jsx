import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <Link to="/feed">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/create-post">Create</Link>
      </nav>

      <p className="footer-copy">© 2024 ICHgram</p>
    </footer>
  );
}

export default Footer;
