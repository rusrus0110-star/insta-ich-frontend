import notFoundImage from "../../assets/auth-phone.png";

import "../../styles/not_found.css";

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found-container">
        <div className="not-found-image-wrap">
          <img
            src={notFoundImage}
            alt="ICHgram mobile preview"
            className="not-found-image"
          />
        </div>

        <div className="not-found-content">
          <div className="not-found-title">
            Oops! Page Not Found (404 Error)
          </div>

          <div className="not-found-text">
            <p>
              We&apos;re sorry, but the page you&apos;re looking for
              doesn&apos;t seem to exist.
            </p>

            <p>
              If you typed the URL manually, please double-check the spelling.
            </p>

            <p>If you clicked on a link, it may be outdated or broken.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;
