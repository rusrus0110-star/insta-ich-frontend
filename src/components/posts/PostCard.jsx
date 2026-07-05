import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";

import Avatar from "../common/Avatar.jsx";

const format_post_date = (value) => {
  if (!value) {
    return "Today";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Today";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function PostCard({ post, on_like }) {
  const author = post.author || {};
  const image_url = post.image_url || post.image || post.photo_url || "";
  const post_id = post.id || post._id;

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="post-header-left">
          <Avatar src={author.avatar} username={author.username} size={32} />

          <div className="post-header-text">
            <p className="post-author">{author.username || "unknown_user"}</p>
            <p className="post-location">Germany</p>
          </div>
        </div>

        <div className="post-header-right">
          <span className="post-date">
            {format_post_date(post.created_at || post.createdAt)}
          </span>

          <button type="button" className="post-follow-btn">
            Follow
          </button>
        </div>
      </header>

      <div className="post-image-wrap">
        {image_url ? (
          <img
            src={image_url}
            alt={post.caption || "Post"}
            className="post-image"
          />
        ) : (
          <div className="post-image-placeholder">No image</div>
        )}
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button
            type="button"
            className={
              post.is_liked_by_current_user
                ? "post-icon-btn liked"
                : "post-icon-btn"
            }
            onClick={() => on_like(post_id)}
          >
            <Heart size={19} />
          </button>

          <button type="button" className="post-icon-btn">
            <MessageCircle size={19} />
          </button>

          <button type="button" className="post-icon-btn">
            <Send size={19} />
          </button>
        </div>

        <button type="button" className="post-icon-btn">
          <Bookmark size={19} />
        </button>
      </div>

      <div className="post-body">
        <p className="post-likes">
          {post.likes_count || post.likes?.length || 0} likes
        </p>

        {post.caption && (
          <p className="post-caption">
            <strong>{author.username || "user"}</strong> {post.caption}
          </p>
        )}

        <button type="button" className="post-comments-link">
          View all comments
        </button>
      </div>
    </article>
  );
}

export default PostCard;
