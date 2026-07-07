import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, MessageCircle, MoreHorizontal, Send, X } from "lucide-react";

import ProfilePage from "../profile/ProfilePage.jsx";

import ruslanPost1 from "../../assets/profiles/ruslan/post-1.png";
import ruslanPost2 from "../../assets/profiles/ruslan/post-2.png";
import ruslanPost3 from "../../assets/profiles/ruslan/post-3.png";
import ruslanPost4 from "../../assets/profiles/ruslan/post-4.png";
import ruslanPost5 from "../../assets/profiles/ruslan/post-5.png";
import ruslanPost6 from "../../assets/profiles/ruslan/post-6.png";

import ichAvatar from "../../assets/profiles/ich/avatar.png";
import ichPost1 from "../../assets/profiles/ich/post-1.png";
import ichPost2 from "../../assets/profiles/ich/post-2.png";
import ichPost3 from "../../assets/profiles/ich/post-3.png";
import ichPost4 from "../../assets/profiles/ich/post-4.png";
import ichPost5 from "../../assets/profiles/ich/post-5.png";
import ichPost6 from "../../assets/profiles/ich/post-6.png";

import "../../styles/post.css";

const users = {
  ruslan: {
    username: "ruslan",
    displayName: "Ruslan Chyhryn",
    avatarText: "RC",
  },
  ichcareerhub: {
    username: "ichcareerhub",
    displayName: "ICH Career Hub",
    avatar: ichAvatar,
  },
  sashaa: {
    username: "sashaa",
    displayName: "Sasha",
    avatarText: "S",
  },
  alex: {
    username: "alex",
    displayName: "Alex",
    avatarText: "A",
  },
  marina: {
    username: "marina",
    displayName: "Marina",
    avatarText: "M",
  },
  natalia: {
    username: "natalia",
    displayName: "Natalia",
    avatarText: "N",
  },
  roman: {
    username: "roman",
    displayName: "Roman",
    avatarText: "R",
  },
  anna: {
    username: "anna",
    displayName: "Anna",
    avatarText: "A",
  },
  max: {
    username: "max",
    displayName: "Max",
    avatarText: "M",
  },
  lena: {
    username: "lena",
    displayName: "Lena",
    avatarText: "L",
  },
};

const posts = {
  "ruslan-post-1": {
    id: "ruslan-post-1",
    image: ruslanPost1,
    username: "ruslan",
    likes: 128,
    time: "2 d",
    isOwnPost: true,
    caption:
      "AI workflow automation connects forms, CRM records, scoring logic and follow-up actions into one clean backend process.",
    comments: [
      {
        id: 1,
        username: "ichcareerhub",
        text: "Strong practical project for CRM automation.",
      },
      {
        id: 2,
        username: "sashaa",
        text: "Clean architecture and useful business case.",
      },
    ],
  },
  "ruslan-post-2": {
    id: "ruslan-post-2",
    image: ruslanPost2,
    username: "ruslan",
    likes: 94,
    time: "3 d",
    isOwnPost: true,
    caption:
      "CRM automation pipeline: capture, validate, enrich, score and sync clean lead data.",
    comments: [
      {
        id: 1,
        username: "alex",
        text: "This is exactly how middleware should be shown.",
      },
    ],
  },
  "ruslan-post-3": {
    id: "ruslan-post-3",
    image: ruslanPost3,
    username: "ruslan",
    likes: 117,
    time: "4 d",
    isOwnPost: true,
    caption:
      "API integration layer between frontend forms, backend services and external CRM systems.",
    comments: [
      {
        id: 1,
        username: "marina",
        text: "Very clear API concept.",
      },
    ],
  },
  "ruslan-post-4": {
    id: "ruslan-post-4",
    image: ruslanPost4,
    username: "ruslan",
    likes: 86,
    time: "5 d",
    isOwnPost: true,
    caption:
      "Lead scoring helps sales teams focus on qualified contacts instead of raw database noise.",
    comments: [
      {
        id: 1,
        username: "natalia",
        text: "Good business value.",
      },
    ],
  },
  "ruslan-post-5": {
    id: "ruslan-post-5",
    image: ruslanPost5,
    username: "ruslan",
    likes: 102,
    time: "1 wek",
    isOwnPost: true,
    caption:
      "Data quality validation before CRM sync prevents duplicates, invalid emails and incomplete records.",
    comments: [
      {
        id: 1,
        username: "roman",
        text: "This is a useful backend feature.",
      },
    ],
  },
  "ruslan-post-6": {
    id: "ruslan-post-6",
    image: ruslanPost6,
    username: "ruslan",
    likes: 140,
    time: "1 wek",
    isOwnPost: true,
    caption:
      "Analytics and AI summaries turn raw lead activity into actionable business insights.",
    comments: [
      {
        id: 1,
        username: "anna",
        text: "Nice visual direction.",
      },
    ],
  },

  "ich-post-1": {
    id: "ich-post-1",
    image: ichPost1,
    username: "ichcareerhub",
    likes: 256,
    time: "2 d",
    isOwnPost: false,
    caption:
      "Graduate project with IT Career Hub will be presented at Web Summit 2024 in Lisbon.",
    comments: [
      {
        id: 1,
        username: "ruslan",
        text: "Great opportunity for students and career changers.",
      },
      {
        id: 2,
        username: "sashaa",
        text: "Very inspiring project.",
      },
    ],
  },
  "ich-post-2": {
    id: "ich-post-2",
    image: ichPost2,
    username: "ichcareerhub",
    likes: 198,
    time: "3 d",
    isOwnPost: false,
    caption:
      "A practical guide for job search in Germany: portfolio, CV, LinkedIn and interview preparation.",
    comments: [
      {
        id: 1,
        username: "ruslan",
        text: "This is useful for every career changer.",
      },
    ],
  },
  "ich-post-3": {
    id: "ich-post-3",
    image: ichPost3,
    username: "ichcareerhub",
    likes: 221,
    time: "4 d",
    isOwnPost: false,
    caption:
      "Learning web development through real projects, teamwork and practical career support.",
    comments: [
      {
        id: 1,
        username: "anna",
        text: "Real projects make the difference.",
      },
    ],
  },
  "ich-post-4": {
    id: "ich-post-4",
    image: ichPost4,
    username: "ichcareerhub",
    likes: 176,
    time: "5 d",
    isOwnPost: false,
    caption:
      "Students receive support, learning materials and practical tools for entering the IT market.",
    comments: [
      {
        id: 1,
        username: "max",
        text: "Good motivation for new students.",
      },
    ],
  },
  "ich-post-5": {
    id: "ich-post-5",
    image: ichPost5,
    username: "ichcareerhub",
    likes: 209,
    time: "1 wek",
    isOwnPost: false,
    caption:
      "Changing careers into IT is challenging, but structured learning and mentoring make it realistic.",
    comments: [
      {
        id: 1,
        username: "ruslan",
        text: "Exactly. Structure and practice are essential.",
      },
    ],
  },
  "ich-post-6": {
    id: "ich-post-6",
    image: ichPost6,
    username: "ichcareerhub",
    likes: 188,
    time: "1 wek",
    isOwnPost: false,
    caption:
      "Students with children also build new professional paths and work toward a bigger goal.",
    comments: [
      {
        id: 1,
        username: "lena",
        text: "Very motivating story.",
      },
    ],
  },
};

function getUser(username) {
  return (
    users[username] || {
      username,
      displayName: username,
      avatarText: username.charAt(0).toUpperCase(),
    }
  );
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const post = posts[postId] || posts["ich-post-1"];
  const postUser = getUser(post.username);

  function handleClosePost() {
    navigate(`/profile/${post.username}`);
  }

  function handleOpenMenu() {
    setIsMenuOpen(true);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  function handleGoToPost() {
    setIsMenuOpen(false);
    navigate(`/profile/${post.username}`);
  }

  function handleEditPost() {
    setIsMenuOpen(false);
    navigate(`/posts/${post.id}/edit`);
  }

  function handleDeletePost() {
    setIsMenuOpen(false);
    console.log("Delete post will be connected to backend later:", post.id);
  }

  async function handleCopyLink() {
    const postUrl = `${window.location.origin}/posts/${post.id}`;

    try {
      await navigator.clipboard.writeText(postUrl);
    } catch (error) {
      console.log("Copy link fallback:", postUrl, error);
    }

    setIsMenuOpen(false);
  }

  return (
    <main className="post-page">
      <div className="post-background">
        <ProfilePage forcedUsername={post.username} />
      </div>

      <div className="post-dark-overlay" />

      <section className="post-modal">
        <div className="post-modal-image-side">
          <img
            src={post.image}
            alt={post.caption}
            className="post-modal-image"
          />
        </div>

        <aside className="post-modal-content">
          <header className="post-modal-header">
            <Link to={`/profile/${post.username}`} className="post-modal-user">
              <PostAvatar user={postUser} />

              <div className="post-modal-user-text">
                <p>{postUser.username}</p>
                <span>{postUser.displayName}</span>
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
                to={`/profile/${post.username}`}
                className="post-modal-caption-avatar"
              >
                <PostAvatar user={postUser} />
              </Link>

              <div>
                <p>
                  <Link to={`/profile/${post.username}`}>
                    {postUser.username}
                  </Link>{" "}
                  {post.caption}
                </p>
                <span>{post.time}</span>
              </div>
            </article>

            <div className="post-modal-comments">
              {post.comments.map((comment) => {
                const commentUser = getUser(comment.username);

                return (
                  <article key={comment.id} className="post-modal-comment">
                    <Link
                      to={`/profile/${comment.username}`}
                      className="post-modal-comment-avatar"
                    >
                      <PostAvatar user={commentUser} />
                    </Link>

                    <p>
                      <Link to={`/profile/${comment.username}`}>
                        {commentUser.username}
                      </Link>{" "}
                      {comment.text}
                    </p>
                  </article>
                );
              })}
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

              <button type="button" aria-label="Share post">
                <Send size={22} strokeWidth={1.9} />
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
            >
              Delete
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
