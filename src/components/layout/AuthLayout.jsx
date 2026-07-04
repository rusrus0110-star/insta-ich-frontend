import auth_phone from "../../assets/auth-phone.png";

function AuthLayout({ children, hide_visual = false }) {
  return (
    <main className="auth-page">
      <section className="auth-section">
        <article
          className={
            hide_visual ? "auth-article auth-article-single" : "auth-article"
          }
        >
          {!hide_visual && (
            <div className="auth-visual" aria-hidden="true">
              <img src={auth_phone} alt="" className="auth-phone-image" />
            </div>
          )}

          <div className="auth-content">{children}</div>
        </article>
      </section>
    </main>
  );
}

export default AuthLayout;
