import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  get_user_profile_by_username,
  toggle_follow_user,
} from "../../services/user_api_service.js";

import { get_user_posts } from "../../services/post_api_service.js";

import "../../styles/profile.css";

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

function get_avatar_text(profile) {
  const source = profile?.username || profile?.full_name || "U";

  return source
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function build_website_url(website) {
  const normalizedWebsite = String(website || "").trim();

  if (!normalizedWebsite) {
    return "";
  }

  if (
    normalizedWebsite.startsWith("http://") ||
    normalizedWebsite.startsWith("https://")
  ) {
    return normalizedWebsite;
  }

  return `https://${normalizedWebsite}`;
}

function format_count(value) {
  const numberValue = Number(value || 0);

  return new Intl.NumberFormat("en-US")
    .format(numberValue)
    .replaceAll(",", " ");
}

function normalize_posts(posts, username) {
  if (!Array.isArray(posts)) {
    return [];
  }

  return posts
    .map((post) => ({
      id: post.id || post._id,
      image: post.image_url || post.image,
      alt: post.caption || `${username} post`,
    }))
    .filter((post) => post.id && post.image);
}

function normalize_profile(user, currentUser) {
  const posts = normalize_posts(user.posts, user.username);

  const isCurrentUser =
    user?.is_current_user ||
    String(user?.id) === String(currentUser?.id) ||
    user?.username === currentUser?.username;

  return {
    id: user.id || user._id,
    username: user.username || "unknown",
    displayName: user.full_name || user.fullName || user.username || "Unknown",
    avatar: user.avatar || "",
    avatarText: get_avatar_text(user),
    bio: user.bio || "",
    website: user.website || "",
    websiteUrl: build_website_url(user.website),
    postsCount: user.posts_count ?? user.postsCount ?? posts.length,
    followersCount: user.followers_count || user.followersCount || 0,
    followingCount: user.following_count || user.followingCount || 0,
    isOwnProfile: isCurrentUser,
    isFollowed: Boolean(user.is_followed_by_current_user),
    posts,
  };
}

function ProfileAvatar({ profile }) {
  if (profile.avatar) {
    return (
      <img
        src={profile.avatar}
        alt={`${profile.username} avatar`}
        className="profile-avatar-image"
      />
    );
  }

  return <div className="profile-avatar-fallback">{profile.avatarText}</div>;
}

function ProfileBio({ profile }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const bioText = profile.bio.trim();
  const bioLines = bioText ? bioText.split("\n").filter(Boolean) : [];
  const visibleLines = isExpanded ? bioLines : bioLines.slice(0, 2);
  const hasMore = bioLines.length > 2;

  return (
    <div className="profile-bio">
      <p className="profile-display-name">{profile.displayName}</p>

      {visibleLines.map((line) => (
        <p key={line}>{line}</p>
      ))}

      {hasMore && (
        <button
          type="button"
          className="profile-more-button"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
        >
          {isExpanded ? "less" : "...more"}
        </button>
      )}

      {profile.website && (
        <a
          href={profile.websiteUrl}
          target="_blank"
          rel="noreferrer"
          className="profile-website-link"
        >
          {profile.website}
        </a>
      )}
    </div>
  );
}

function ProfilePage({ forcedUsername }) {
  const { username } = useParams();
  const currentUser = useMemo(() => get_current_user(), []);

  const activeUsername = forcedUsername || username || currentUser?.username;

  const [profile, setProfile] = useState(null);
  const [completedUsername, setCompletedUsername] = useState("");
  const [profileError, setProfileError] = useState("");

  const isProfileLoaded = completedUsername === activeUsername;

  useEffect(() => {
    if (!activeUsername) {
      return;
    }

    let isActive = true;

    async function load_profile() {
      try {
        const userData = await get_user_profile_by_username(activeUsername);
        const userPosts = await get_user_posts(userData.id || userData._id);

        if (!isActive) {
          return;
        }

        const normalizedPosts = normalize_posts(userPosts, userData.username);

        setProfile(
          normalize_profile(
            {
              ...userData,
              posts_count: normalizedPosts.length,
              posts: normalizedPosts,
            },
            currentUser,
          ),
        );

        setProfileError("");
        setCompletedUsername(activeUsername);
      } catch (error) {
        console.error("Failed to load profile:", error.message);

        if (!isActive) {
          return;
        }

        setProfile(null);
        setProfileError(error.message);
        setCompletedUsername(activeUsername);
      }
    }

    load_profile();

    return () => {
      isActive = false;
    };
  }, [activeUsername, currentUser]);

  async function handleFollowClick() {
    if (!profile?.id) {
      return;
    }

    try {
      const updatedUser = await toggle_follow_user(profile.id);

      setProfile((currentProfile) => {
        const currentPosts = currentProfile?.posts || [];

        return normalize_profile(
          {
            ...updatedUser,
            posts_count: currentPosts.length,
            posts: currentPosts,
          },
          currentUser,
        );
      });
    } catch (error) {
      console.error("Failed to follow user:", error.message);
    }
  }

  if (!isProfileLoaded) {
    return (
      <main className="profile-page">
        <section className="profile-container">
          <div className="profile-state-box">Loading profile...</div>
        </section>
      </main>
    );
  }

  if (profileError || !profile) {
    return (
      <main className="profile-page">
        <section className="profile-container">
          <div className="profile-state-box">
            <h1>User not found</h1>
            <p>{profileError || "This profile does not exist."}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-container">
        <header className="profile-header">
          <div className="profile-avatar-wrapper">
            <ProfileAvatar profile={profile} />
          </div>

          <div className="profile-info">
            <div className="profile-title-row">
              <h1>{profile.username}</h1>

              {profile.isOwnProfile ? (
                <Link to="/profile/edit" className="profile-edit-button">
                  Edit profile
                </Link>
              ) : (
                <div className="profile-actions">
                  <button
                    type="button"
                    className={
                      profile.isFollowed
                        ? "profile-follow-button profile-follow-button-active"
                        : "profile-follow-button"
                    }
                    onClick={handleFollowClick}
                  >
                    {profile.isFollowed ? "Following" : "Follow"}
                  </button>

                  <Link
                    to={`/messages/${profile.username}`}
                    className="profile-message-button"
                  >
                    Message
                  </Link>
                </div>
              )}
            </div>

            <ul className="profile-stats">
              <li>
                <strong>{format_count(profile.postsCount)}</strong> posts
              </li>
              <li>
                <strong>{format_count(profile.followersCount)}</strong>{" "}
                followers
              </li>
              <li>
                <strong>{format_count(profile.followingCount)}</strong>{" "}
                following
              </li>
            </ul>

            <ProfileBio profile={profile} />
          </div>
        </header>

        {profile.posts.length > 0 ? (
          <section
            className="profile-posts-grid"
            aria-label={`${profile.username} posts`}
          >
            {profile.posts.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className="profile-post-link"
                aria-label={`Open post ${post.id}`}
              >
                <img src={post.image} alt={post.alt} />
              </Link>
            ))}
          </section>
        ) : (
          <section className="profile-empty-posts">
            <p>No posts yet.</p>
          </section>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;
