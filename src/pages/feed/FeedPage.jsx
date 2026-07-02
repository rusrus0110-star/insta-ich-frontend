import useAuth from "../../hooks/useAuth.js";

function FeedPage() {
  const { user } = useAuth();

  return (
    <section className="page-section">
      <h1>Home feed</h1>
      <p>
        Logged in as <strong>{user?.username}</strong>
      </p>

      <div className="placeholder-card">
        Frontend foundation is ready. Next step: posts feed integration.
      </div>
    </section>
  );
}

export default FeedPage;
