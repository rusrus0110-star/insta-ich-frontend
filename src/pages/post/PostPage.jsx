import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, MessageCircle, MoreHorizontal, X } from "lucide-react";

import ProfilePage from "../profile/ProfilePage.jsx";

import {
  create_post_comment,
  delete_post,
  delete_post_comment,
  get_post_by_id,
  get_post_comments,
  toggle_post_like,
} from "../../services/post_api_service.js";

import {
  get_current_user_profile,
  get_user_profile_by_username,
  toggle_follow_user,
} from "../../services/user_api_service.js";

import "../../styles/post.css";

function get_avatar_text(user) {
  const source = user?.username || user?.full_name || user?.displayName || "U";

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

function normalize_author(author) {
  const authorId = author?.id || author?._id;

  return {
    id: authorId,
    username: author?.username || "unknown",
    displayName:
      author?.full_name || author?.fullName || author?.username || "Unknown",
    avatar: author?.avatar || "",
    avatarText: get_avatar_text(author),
    isFollowed: Boolean(author?.is_followed_by_current_user),
  };
}

function normalize_post(post, currentUser, authorProfile = null) {
  const authorSource = authorProfile || post.author || {};
  const author = normalize_author(authorSource);

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
      String(author.id) === String(currentUser?.id) ||
      author.username === currentUser?.username,
    author,
  };
}

function normalize_comment(comment) {
  const author = normalize_author(comment.author || comment.user || {});

  return {
    id: comment.id || comment._id,
    text: comment.text || comment.content || "",
    time: format_time(comment.created_at || comment.createdAt),
    author,
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

  const [currentUser, setCurrentUser] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [completedPostId, setCompletedPostId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState("");

  const isPostLoaded = completedPostId === postId;

  useEffect(() => {
    if (!postId) {
      return;
    }

    let isActive = true;

    async function load_post() {
      try {
        const [currentUserData, postData, commentsData] = await Promise.all([
          get_current_user_profile(),
          get_post_by_id(postId),
          get_post_comments(postId),
        ]);

        const normalizedCurrentUser = {
          id: currentUserData?.id || currentUserData?._id,
          username: currentUserData?.username || "",
        };

        if (!isActive) {
          return;
        }

        setCurrentUser(normalizedCurrentUser);

        const basePost = normalize_post(postData, normalizedCurrentUser);
        let authorProfile = null;

        if (
          basePost.author.username &&
          basePost.author.username !== normalizedCurrentUser.username
        ) {
          authorProfile = await get_user_profile_by_username(
            basePost.author.username,
          );
        }

        if (!isActive) {
          return;
        }

        setPost(normalize_post(postData, normalizedCurrentUser, authorProfile));

        setComments(commentsData.map(normalize_comment));
        setErrorMessage("");
        setCompletedPostId(postId);
      } catch (error) {
        console.error("Failed to load post:", error.message);

        if (!isActive) {
          return;
        }

        setPost(null);
        setComments([]);
        setErrorMessage(error.message);
        setCompletedPostId(postId);
      }
    }

    load_post();

    return () => {
      isActive = false;
    };
  }, [postId]);

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

  async function handleLikePost() {
    if (!post?.id || isLiking) {
      return;
    }

    try {
      setIsLiking(true);

      const updatedPost = await toggle_post_like(post.id);

      setPost((currentPost) => {
        const nextPost = normalize_post(updatedPost, currentUser);

        return {
          ...nextPost,
          author: currentPost.author,
          isOwnPost: currentPost.isOwnPost,
        };
      });
    } catch (error) {
      console.error("Failed to like post:", error.message);
      window.alert(error.message);
    } finally {
      setIsLiking(false);
    }
  }

  async function handleToggleFollow() {
    if (!post?.author?.id || isFollowing || post.isOwnPost) {
      return;
    }

    try {
      setIsFollowing(true);

      const updatedUser = await toggle_follow_user(post.author.id);

      setPost((currentPost) => ({
        ...currentPost,
        author: {
          ...currentPost.author,
          id: updatedUser.id || updatedUser._id || currentPost.author.id,
          username: updatedUser.username || currentPost.author.username,
          displayName:
            updatedUser.full_name ||
            updatedUser.fullName ||
            currentPost.author.displayName,
          avatar: updatedUser.avatar || currentPost.author.avatar,
          avatarText: get_avatar_text(updatedUser),
          isFollowed: Boolean(updatedUser.is_followed_by_current_user),
        },
      }));
    } catch (error) {
      console.error("Failed to follow user:", error.message);
      window.alert(error.message);
    } finally {
      setIsFollowing(false);
    }
  }

  function handleCommentTextChange(event) {
    setCommentText(event.target.value);
  }

  async function handleSubmitComment(event) {
    event.preventDefault();

    const normalizedCommentText = commentText.trim();

    if (!normalizedCommentText || !post?.id || isCommenting) {
      return;
    }

    try {
      setIsCommenting(true);

      const createdComment = await create_post_comment(
        post.id,
        normalizedCommentText,
      );

      setComments((currentComments) => [
        normalize_comment(createdComment),
        ...currentComments,
      ]);

      setPost((currentPost) => ({
        ...currentPost,
        commentsCount: currentPost.commentsCount + 1,
      }));

      setCommentText("");
    } catch (error) {
      console.error("Failed to create comment:", error.message);
      window.alert(error.message);
    } finally {
      setIsCommenting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    const shouldDelete = window.confirm("Delete this comment?");

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingCommentId(commentId);

      await delete_post_comment(commentId);

      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== commentId),
      );

      setPost((currentPost) => ({
        ...currentPost,
        commentsCount: Math.max(currentPost.commentsCount - 1, 0),
      }));
    } catch (error) {
      console.error("Failed to delete comment:", error.message);
      window.alert(error.message);
    } finally {
      setDeletingCommentId("");
    }
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

            {!post.isOwnPost ? (
              <button
                type="button"
                className={
                  post.author.isFollowed
                    ? "post-modal-follow-button post-modal-follow-button-active"
                    : "post-modal-follow-button"
                }
                onClick={handleToggleFollow}
                disabled={isFollowing}
              >
                {isFollowing
                  ? "..."
                  : post.author.isFollowed
                    ? "Following"
                    : "Follow"}
              </button>
            ) : (
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
              {comments.length > 0 ? (
                comments.map((comment) => {
                  const canDeleteComment =
                    String(comment.author.id) === String(currentUser?.id) ||
                    post.isOwnPost;

                  return (
                    <article key={comment.id} className="post-modal-comment">
                      <Link
                        to={`/profile/${comment.author.username}`}
                        className="post-modal-comment-avatar"
                      >
                        <PostAvatar user={comment.author} />
                      </Link>

                      <div>
                        <p>
                          <Link to={`/profile/${comment.author.username}`}>
                            {comment.author.username}
                          </Link>{" "}
                          {comment.text}
                        </p>

                        <div className="post-modal-comment-meta">
                          {comment.time && <span>{comment.time}</span>}

                          {canDeleteComment && (
                            <button
                              type="button"
                              className="post-modal-comment-delete-button"
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={deletingCommentId === comment.id}
                            >
                              {deletingCommentId === comment.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="post-modal-empty-comments">No comments yet.</p>
              )}
            </div>
          </div>

          <footer className="post-modal-footer">
            <div className="post-modal-actions">
              <button
                type="button"
                aria-label="Like post"
                onClick={handleLikePost}
                disabled={isLiking}
                className={post.isLiked ? "post-modal-action-liked" : ""}
              >
                <Heart
                  size={22}
                  strokeWidth={1.9}
                  fill={post.isLiked ? "currentColor" : "none"}
                />
              </button>

              <button
                type="button"
                aria-label="Comment post"
                onClick={() =>
                  document
                    .querySelector(".post-modal-comment-form input")
                    ?.focus()
                }
              >
                <MessageCircle size={22} strokeWidth={1.9} />
              </button>
            </div>

            <p className="post-modal-likes">{post.likes} likes</p>
            <p className="post-modal-time">{post.time}</p>

            <form
              className="post-modal-comment-form"
              onSubmit={handleSubmitComment}
            >
              <input
                type="text"
                placeholder="Add comment..."
                value={commentText}
                onChange={handleCommentTextChange}
                disabled={isCommenting}
              />

              <button
                type="submit"
                disabled={!commentText.trim() || isCommenting}
              >
                {isCommenting ? "Sending..." : "Send"}
              </button>
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
