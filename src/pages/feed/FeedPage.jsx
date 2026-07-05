import "../../styles/main.css";
import confirmRefreshIcon from "../../assets/icon-confirm-refresh-light.png";
import treesPostImage from "../../assets/post-trees.png";

const mockPosts = [
  {
    id: 1,
    username: "sashaa",
    date: "2 wek",
    likes: "101 824 likes",
    captionAuthor: "Sashaa",
    captionText: "It's golden, Ponyboy!",
    previewText: "heyyyyy",
    commentsCount: 732,
    image: treesPostImage,
  },
  {
    id: 2,
    username: "sashaa",
    date: "2 wek",
    likes: "101 824 likes",
    captionAuthor: "Sashaa",
    captionText: "It's golden, Ponyboy!",
    previewText: "heyyyyy",
    commentsCount: 732,
    image: treesPostImage,
  },
  {
    id: 3,
    username: "sashaa",
    date: "2 wek",
    likes: "101 824 likes",
    captionAuthor: "Sashaa",
    captionText: "It's golden, Ponyboy!",
    previewText: "heyyyyy",
    commentsCount: 732,
    image: treesPostImage,
  },
  {
    id: 4,
    username: "sashaa",
    date: "2 wek",
    likes: "101 824 likes",
    captionAuthor: "Sashaa",
    captionText: "It's golden, Ponyboy!",
    previewText: "heyyyyy",
    commentsCount: 732,
    image: treesPostImage,
  },
];

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="post-action-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.1 20.3s-7.1-4.4-9.2-8.3C1 8.8 2.7 5.2 6.4 5.2c2 0 3.2 1 4 2.2.8-1.2 2-2.2 4-2.2 3.7 0 5.4 3.6 3.5 6.8-2.1 3.9-9.2 8.3-9.2 8.3Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="post-action-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11.2c0 4.6-4.1 8.3-9.1 8.3-1.1 0-2.1-.2-3.1-.5L4 20l1.1-3.1C4.4 15.6 4 13.5 4 11.2 4 6.6 8.1 3 13.1 3S20 6.6 20 11.2Z" />
    </svg>
  );
}

function AvatarFallback({ username }) {
  const letter = username ? username.charAt(0).toUpperCase() : "U";

  return <div className="post-avatar-fallback">{letter}</div>;
}

function FeedPostCard({ post }) {
  return (
    <article className="post-card">
      <header className="post-header">
        <div className="post-header-left">
          <AvatarFallback username={post.username} />

          <div className="post-header-meta">
            <span className="post-username">{post.username}</span>
            <span className="post-meta-separator">•</span>
            <span className="post-date">{post.date}</span>
            <span className="post-meta-separator">•</span>
          </div>
        </div>

        <button type="button" className="post-follow-button">
          follow
        </button>
      </header>

      <div className="post-image-wrap">
        <img src={post.image} alt="Post" className="post-image" />
      </div>

      <div className="post-content">
        <div className="post-actions">
          <div className="post-actions-left">
            <button
              type="button"
              className="post-action-button"
              aria-label="Like"
            >
              <HeartIcon />
            </button>

            <button
              type="button"
              className="post-action-button"
              aria-label="Comment"
            >
              <CommentIcon />
            </button>
          </div>

          <button
            type="button"
            className="post-action-button"
            aria-label="Save"
          ></button>
        </div>

        <p className="post-likes">{post.likes}</p>

        <p className="post-caption">
          <span className="post-caption-author">{post.captionAuthor}</span>{" "}
          <span className="post-caption-text">{post.captionText}</span>
        </p>

        <p className="post-preview">
          <span className="post-preview-text">{post.previewText}</span>
          <span className="post-preview-separator"> | </span>
          <button type="button" className="post-more-button">
            M... more
          </button>
        </p>

        <button type="button" className="post-comments-button">
          View all comments ({post.commentsCount})
        </button>
      </div>
    </article>
  );
}

export default function FeedPage() {
  return (
    <section className="main-page">
      <div className="feed-grid">
        {mockPosts.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}

        <section className="feed-updates-card" aria-label="All updates viewed">
          <img
            src={confirmRefreshIcon}
            alt="All updates viewed"
            className="feed-updates-icon"
          />

          <h2 className="feed-updates-title">
            You&apos;ve seen all the updates
          </h2>

          <p className="feed-updates-text">
            You have viewed all new publications
          </p>
        </section>
      </div>
    </section>
  );
}
