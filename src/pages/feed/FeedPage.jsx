import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import confirmRefreshIcon from "../../assets/icon-confirm-refresh-light.png";
import {
  create_post_comment,
  get_all_posts,
  toggle_post_like,
} from "../../services/post_api_service.js";

import "../../styles/feed.css";

function HeartIcon({ isLiked }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="post-action-icon"
      fill={isLiked ? "currentColor" : "none"}
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

function Avatar({ user }) {
  const username = user?.username || "user";
  const letter = username.charAt(0).toUpperCase();

  return (
    <span className="post-avatar">
      {user?.avatar ? (
        <img src={user.avatar} alt={`${username} avatar`} />
      ) : (
        <span>{letter}</span>
      )}
    </span>
  );
}

function format_post_date(dateValue) {
  if (!dateValue) {
    return "now";
  }

  const date = new Date(dateValue);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes} m`;
  if (diffHours < 24) return `${diffHours} h`;
  if (diffDays < 7) return `${diffDays} d`;

  return `${diffWeeks} w`;
}

function get_id_from_value(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return String(
    value.id ||
      value._id ||
      value.user_id ||
      value.userId ||
      value.user?.id ||
      value.user?._id ||
      value.author?.id ||
      value.author?._id ||
      "",
  ).trim();
}

function get_current_user_id() {
  const storageKeys = ["user", "auth"];

  for (const key of storageKeys) {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      continue;
    }

    try {
      const parsedValue = JSON.parse(storedValue);

      const possibleId =
        get_id_from_value(parsedValue) ||
        get_id_from_value(parsedValue.user) ||
        get_id_from_value(parsedValue.data) ||
        get_id_from_value(parsedValue.data?.user) ||
        get_id_from_value(parsedValue.currentUser) ||
        get_id_from_value(parsedValue.profile);

      if (possibleId) {
        return possibleId;
      }
    } catch {
      continue;
    }
  }

  return "";
}

function get_likes_array(post) {
  if (Array.isArray(post.likes)) {
    return post.likes;
  }

  if (Array.isArray(post.liked_by)) {
    return post.liked_by;
  }

  if (Array.isArray(post.likedBy)) {
    return post.likedBy;
  }

  if (Array.isArray(post.likes_users)) {
    return post.likes_users;
  }

  if (Array.isArray(post.likesUsers)) {
    return post.likesUsers;
  }

  return [];
}

function check_is_liked_by_current_user(post) {
  if (
    post.is_liked_by_current_user === true ||
    post.isLikedByCurrentUser === true ||
    post.liked_by_current_user === true ||
    post.likedByCurrentUser === true
  ) {
    return true;
  }

  const currentUserId = get_current_user_id();

  if (!currentUserId) {
    return false;
  }

  const likes = get_likes_array(post);

  if (!likes.length) {
    return false;
  }

  return likes.some((like) => {
    const likeId = get_id_from_value(like);

    return String(likeId) === String(currentUserId);
  });
}

function get_likes_count(post) {
  if (typeof post.likes_count === "number") {
    return post.likes_count;
  }

  if (typeof post.likesCount === "number") {
    return post.likesCount;
  }

  const likes = get_likes_array(post);

  return likes.length;
}

function normalize_post(post) {
  const author = post.author || {};

  return {
    id: post.id || post._id,
    image: post.image_url || post.image,
    caption: post.caption || "",
    author: {
      id: author.id || author._id,
      username: author.username || "unknown",
      fullName: author.full_name || author.fullName || author.username || "",
      avatar: author.avatar || "",
    },
    likesCount: get_likes_count(post),
    commentsCount: post.comments_count || post.commentsCount || 0,
    isLikedByCurrentUser: check_is_liked_by_current_user(post),
    createdAt: post.created_at || post.createdAt,
  };
}

function normalize_updated_post(updatedPost, fallbackPost) {
  return {
    ...fallbackPost,
    likesCount: get_likes_count(updatedPost),
    isLikedByCurrentUser:
      updatedPost.is_liked_by_current_user ??
      updatedPost.isLikedByCurrentUser ??
      updatedPost.liked_by_current_user ??
      updatedPost.likedByCurrentUser ??
      check_is_liked_by_current_user(updatedPost),
  };
}

function remove_duplicate_posts(posts) {
  const seenIds = new Set();

  return posts.filter((post) => {
    const id = String(post.id || "");

    if (!id || seenIds.has(id)) {
      return false;
    }

    seenIds.add(id);
    return true;
  });
}

function FeedPostCard({ post }) {
  const navigate = useNavigate();

  const [localPost, setLocalPost] = useState(post);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  async function handle_like() {
    if (isLiking) {
      return;
    }

    const previousPost = localPost;

    const nextLikedState = !previousPost.isLikedByCurrentUser;
    const nextLikesCount = nextLikedState
      ? previousPost.likesCount + 1
      : Math.max(previousPost.likesCount - 1, 0);

    setLocalPost({
      ...previousPost,
      isLikedByCurrentUser: nextLikedState,
      likesCount: nextLikesCount,
    });

    try {
      setIsLiking(true);

      const updatedPost = await toggle_post_like(previousPost.id);

      if (updatedPost) {
        setLocalPost((currentPost) =>
          normalize_updated_post(updatedPost, currentPost),
        );
      }
    } catch (error) {
      console.error("Failed to like post:", error.message);
      setLocalPost(previousPost);
    } finally {
      setIsLiking(false);
    }
  }

  async function handle_submit_comment(event) {
    event.preventDefault();

    const trimmedComment = commentText.trim();

    if (!trimmedComment || isSubmittingComment) {
      return;
    }

    try {
      setIsSubmittingComment(true);

      await create_post_comment(localPost.id, trimmedComment);

      setLocalPost((currentPost) => ({
        ...currentPost,
        commentsCount: currentPost.commentsCount + 1,
      }));

      setCommentText("");
    } catch (error) {
      console.error("Failed to create comment:", error.message);
    } finally {
      setIsSubmittingComment(false);
    }
  }

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="post-header-left">
          <Link to={`/profile/${localPost.author.username}`}>
            <Avatar user={localPost.author} />
          </Link>

          <div className="post-header-meta">
            <Link
              to={`/profile/${localPost.author.username}`}
              className="post-username"
            >
              {localPost.author.username}
            </Link>

            <span className="post-meta-separator">•</span>

            <span className="post-date">
              {format_post_date(localPost.createdAt)}
            </span>
          </div>
        </div>
      </header>

      <button
        type="button"
        className="post-image-button"
        onClick={() => navigate(`/posts/${localPost.id}`)}
        aria-label="Open post"
      >
        <img src={localPost.image} alt="Post" className="post-image" />
      </button>

      <div className="post-content">
        <div className="post-actions">
          <div className="post-actions-left">
            <button
              type="button"
              className={
                localPost.isLikedByCurrentUser
                  ? "post-action-button post-action-liked"
                  : "post-action-button"
              }
              aria-label="Like"
              onClick={handle_like}
              disabled={isLiking}
            >
              <HeartIcon isLiked={localPost.isLikedByCurrentUser} />
            </button>

            <button
              type="button"
              className="post-action-button"
              aria-label="Comment"
              onClick={() => navigate(`/posts/${localPost.id}`)}
            >
              <CommentIcon />
            </button>
          </div>
        </div>

        <p className="post-likes">
          {localPost.likesCount} {localPost.likesCount === 1 ? "like" : "likes"}
        </p>

        {localPost.caption ? (
          <p className="post-caption">
            <Link
              to={`/profile/${localPost.author.username}`}
              className="post-caption-author"
            >
              {localPost.author.username}
            </Link>{" "}
            <span className="post-caption-text">{localPost.caption}</span>
          </p>
        ) : null}

        <button
          type="button"
          className="post-comments-button"
          onClick={() => navigate(`/posts/${localPost.id}`)}
        >
          View all comments ({localPost.commentsCount})
        </button>

        <form className="post-comment-form" onSubmit={handle_submit_comment}>
          <input
            type="text"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Add a comment..."
            disabled={isSubmittingComment}
          />

          <button
            type="submit"
            disabled={!commentText.trim() || isSubmittingComment}
          >
            Post
          </button>
        </form>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function load_posts() {
      try {
        const postsData = await get_all_posts();

        if (!isActive) {
          return;
        }

        const normalizedPosts = postsData
          .map(normalize_post)
          .filter((post) => post.id && post.image);

        setPosts(remove_duplicate_posts(normalizedPosts));
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to load feed posts:", error.message);

        if (isActive) {
          setPosts([]);
          setErrorMessage(error.message);
        }
      } finally {
        if (isActive) {
          setCompletedLoading(true);
        }
      }
    }

    load_posts();

    return () => {
      isActive = false;
    };
  }, []);

  if (!completedLoading) {
    return (
      <section className="main-page">
        <div className="feed-state-box">
          <p>Loading feed...</p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="main-page">
        <div className="feed-state-box">
          <h1>Feed is unavailable</h1>
          <p>{errorMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="main-page">
      <div className="feed-grid">
        {posts.map((post) => (
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
