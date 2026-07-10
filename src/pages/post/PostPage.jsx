import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, MessageCircle, MoreHorizontal, X } from "lucide-react";

import ProfilePage from "../profile/ProfilePage.jsx";

import {
  delete_post,
  get_post_by_id,
} from "../../services/post_api_service.js";

import "../../styles/post.css";

function get_current_user() {
  const userData = localStorage.getItem("user");

  if (!userData) {
    return null;
  }

  try {
    const parsedUserData = JSON.parse(userData);
    const user = parsedUserData.user || parsedUserData;

    return {
      id: user.id || user._id || user.user_id,
      username: user.username,
    };
  } catch {
    return null;
  }
}

function get_avatar_text(user) {
  const source = user?.username || user?.full_name || "U";

  return source
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function format_time(value) {
  if (!value) {
    return "";
  }

  const createdDate = new Date(value);
  const now = new Date();

  const diffMs = now.getTime() - createdDate.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  }

  if (diffHours < 24) {
    return `${diffHours} h`;
  }

  if (diffDays < 7) {
    return `${diffDays} d`;
  }

  return createdDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function normalize_post(post, currentUser) {
  const author = post.author || {};
  const authorId = author.id || author._id;

  return {
    id: post.id || post._id,
    image: post.image_url || post.image,
    caption: post.caption || "",
    likes: post.likes_count || post.likesCount || 0,
    commentsCount: post.comments_count || post.commentsCount || 0,
    isLiked: Boolean(post.is_liked_by_current_user),
    time: format_time(post.created_at || post.createdAt),
    createdAt: post.created_at || post.createdAt,
    isOwnPost:
      String(authorId) === String(currentUser?.id) ||
      author.username === currentUser?.username,
    author: {
      id: authorId,
      username: author.username || "unknown",
      displayName: author.full_name || author.fullName || author.username,
      avatar: author.avatar || "",
      avatarText: get_avatar_text(author),
    },
  };
}

function PostAvatar({ user }) {
  return (
    <span className="post-page-avatar-ring">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={`${user.username} avatar`}
          className="post-page-avatar-image"
        />
      ) : (
        <span className="post-page-avatar-fallback">{user.avatarText}</span>
      )}
    </span>
  );
}

function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUser = useMemo(() => get_current_user(), []);

  const [post, setPost] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [completedPostId, setCompletedPostId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isPostLoaded = completedPostId === postId;

  useEffect(() => {
    if (!postId) {
      return;
    }

    let isActive = true;

    async function load_post() {
      try {
        const postData = await get_post_by_id(postId);

        if (!isActive) {
          return;
        }

        setPost(normalize_post(postData, currentUser));
        setErrorMessage("");
        setCompletedPostId(postId);
      } catch (error) {
        console.error("Failed to load post:", error.message);

        if (!isActive) {
          return;
        }

        setPost(null);
        setErrorMessage(error.message);
        setCompletedPostId(postId);
      }
    }

    load_post();

    return () => {
      isActive = false;
    };
  }, [postId, currentUser]);

  function handleClosePost() {
    if (post?.author?.username) {
      navigate(`/profile/${post.author.username}`);
      return;
    }

    navigate("/profile");
  }

  function handleOpenMenu() {
    setIsMenuOpen(true);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  function handleGoToPost() {
    setIsMenuOpen(false);
    navigate(`/posts/${post.id}`);
  }

  function handleEditPost() {
    setIsMenuOpen(false);
    navigate(`/posts/${post.id}/edit`);
  }

  async function handleDeletePost() {
    const shouldDelete = window.confirm("Delete this post?");

    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setIsMenuOpen(false);

      await delete_post(post.id);

      navigate(`/profile/${post.author.username}`);
    } catch (error) {
      console.error("Failed to delete post:", error.message);
      window.alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleCopyLink() {
    const postUrl = `${window.location.origin}/posts/${post.id}`;

    try {
      await navigator.clipboard.writeText(postUrl);
      window.alert("Link copied.");
    } catch (error) {
      console.log("Copy link fallback:", postUrl, error);
      window.alert(postUrl);
    }

    setIsMenuOpen(false);
  }

  if (!isPostLoaded) {
    return (
      <main className="post-page">
        <div className="post-dark-overlay" />

        <section className="post-modal">
          <div className="post-modal-image-side" />

          <aside className="post-modal-content">
            <div className="post-modal-body">
              <p>Loading post...</p>
            </div>
          </aside>
        </section>
      </main>
    );
  }

  if (errorMessage || !post) {
    return (
      <main className="post-page">
        <div className="post-dark-overlay" />

        <section className="post-modal">
          <div className="post-modal-image-side" />

          <aside className="post-modal-content">
            <header className="post-modal-header">
              <p>Post not found</p>

              <button
                type="button"
                className="post-modal-close-button"
                aria-label="Close post"
                onClick={() => navigate("/profile")}
              >
                <X size={18} strokeWidth={2} />
              </button>
            </header>

            <div className="post-modal-body">
              <p>{errorMessage || "This post does not exist."}</p>
            </div>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className="post-page">
      <div className="post-background">
        <ProfilePage forcedUsername={post.author.username} />
      </div>

      <div className="post-dark-overlay" />

      <section className="post-modal">
        <div className="post-modal-image-side">
          <img
            src={post.image}
            alt={post.caption || "Post image"}
            className="post-modal-image"
          />
        </div>

        <aside className="post-modal-content">
          <header className="post-modal-header">
            <Link
              to={`/profile/${post.author.username}`}
              className="post-modal-user"
            >
              <PostAvatar user={post.author} />

              <div className="post-modal-user-text">
                <p>{post.author.username}</p>
                <span>{post.author.displayName}</span>
              </div>
            </Link>

            {!post.isOwnPost && (
              <button type="button" className="post-modal-follow-button">
                Follow
              </button>
            )}

            {post.isOwnPost && (
              <button
                type="button"
                className="post-modal-menu-button"
                aria-label="Post menu"
                onClick={handleOpenMenu}
              >
                <MoreHorizontal size={20} strokeWidth={2} />
              </button>
            )}

            <button
              type="button"
              className="post-modal-close-button"
              aria-label="Close post"
              onClick={handleClosePost}
            >
              <X size={18} strokeWidth={2} />
            </button>
          </header>

          <div className="post-modal-body">
            <article className="post-modal-caption">
              <Link
                to={`/profile/${post.author.username}`}
                className="post-modal-caption-avatar"
              >
                <PostAvatar user={post.author} />
              </Link>

              <div>
                <p>
                  <Link to={`/profile/${post.author.username}`}>
                    {post.author.username}
                  </Link>{" "}
                  {post.caption}
                </p>
                <span>{post.time}</span>
              </div>
            </article>

            <div className="post-modal-comments">
              {post.commentsCount > 0 ? (
                <p>{post.commentsCount} comments</p>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>

          <footer className="post-modal-footer">
            <div className="post-modal-actions">
              <button type="button" aria-label="Like post">
                <Heart size={22} strokeWidth={1.9} />
              </button>

              <button type="button" aria-label="Comment post">
                <MessageCircle size={22} strokeWidth={1.9} />
              </button>
            </div>

            <p className="post-modal-likes">{post.likes} likes</p>
            <p className="post-modal-time">{post.time}</p>

            <form className="post-modal-comment-form">
              <input type="text" placeholder="Add comment..." />
              <button type="submit">Send</button>
            </form>
          </footer>
        </aside>
      </section>

      {isMenuOpen && post.isOwnPost && (
        <div className="post-action-layer">
          <div className="post-action-dialog" role="dialog" aria-modal="true">
            <button
              type="button"
              className="post-action-button post-action-button-danger"
              onClick={handleDeletePost}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>

            <button
              type="button"
              className="post-action-button"
              onClick={handleEditPost}
            >
              Edit
            </button>

            <button
              type="button"
              className="post-action-button"
              onClick={handleGoToPost}
            >
              Go to post
            </button>

            <button
              type="button"
              className="post-action-button"
              onClick={handleCopyLink}
            >
              Copy link
            </button>

            <button
              type="button"
              className="post-action-button"
              onClick={handleCloseMenu}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default PostPage;
