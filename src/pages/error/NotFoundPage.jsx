import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/feed">Back to home</Link>
    </div>
  );
}

export default NotFoundPage;
