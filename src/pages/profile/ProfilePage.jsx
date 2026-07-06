import { useState } from "react";
import { Link, useParams } from "react-router-dom";

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

import "../../styles/profile.css";

const profiles = {
  ruslan: {
    username: "ruslan",
    displayName: "Ruslan Chyhryn",
    avatarText: "RC",
    isOwnProfile: true,
    postsCount: 6,
    followers: "129",
    following: "59",
    bio: [
      "CRM Automation · Backend Integrations · AI Workflows",
      "Building clean data flows between websites, APIs and CRM systems.",
      "Node.js · Express · MongoDB · HubSpot API · OpenAI",
    ],
    website: "linkedin.com/in/ruslan-c-17311460",
    websiteUrl: "https://www.linkedin.com/in/ruslan-c-17311460",
    posts: [
      {
        id: "ruslan-post-1",
        image: ruslanPost1,
        alt: "AI workflow automation dashboard",
      },
      {
        id: "ruslan-post-2",
        image: ruslanPost2,
        alt: "CRM automation pipeline",
      },
      {
        id: "ruslan-post-3",
        image: ruslanPost3,
        alt: "API integration architecture",
      },
      {
        id: "ruslan-post-4",
        image: ruslanPost4,
        alt: "Lead scoring dashboard",
      },
      {
        id: "ruslan-post-5",
        image: ruslanPost5,
        alt: "Data validation workflow",
      },
      {
        id: "ruslan-post-6",
        image: ruslanPost6,
        alt: "Analytics and AI insights dashboard",
      },
    ],
  },

  ichcareerhub: {
    username: "ichcareerhub",
    displayName: "ICH Career Hub",
    avatar: ichAvatar,
    isOwnProfile: false,
    postsCount: 129,
    followers: "9 993",
    following: "59",
    bio: [
      "IT education and career support for adults in Germany.",
      "Web development, practical projects and job search preparation.",
      "Students build real projects, prepare portfolios and apply for IT roles.",
    ],
    website: "ich-careerhub.de",
    websiteUrl: "https://ich-careerhub.de",
    posts: [
      {
        id: "ich-post-1",
        image: ichPost1,
        alt: "ICH Career Hub post 1",
      },
      {
        id: "ich-post-2",
        image: ichPost2,
        alt: "ICH Career Hub post 2",
      },
      {
        id: "ich-post-3",
        image: ichPost3,
        alt: "ICH Career Hub post 3",
      },
      {
        id: "ich-post-4",
        image: ichPost4,
        alt: "ICH Career Hub post 4",
      },
      {
        id: "ich-post-5",
        image: ichPost5,
        alt: "ICH Career Hub post 5",
      },
      {
        id: "ich-post-6",
        image: ichPost6,
        alt: "ICH Career Hub post 6",
      },
    ],
  },
};

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
  const [is_expanded, set_is_expanded] = useState(false);

  const visible_lines = is_expanded ? profile.bio : profile.bio.slice(0, 2);
  const has_more = profile.bio.length > 2;

  return (
    <div className="profile-bio">
      <p className="profile-display-name">{profile.displayName}</p>

      {visible_lines.map((line) => (
        <p key={line}>{line}</p>
      ))}

      {has_more && (
        <button
          type="button"
          className="profile-more-button"
          onClick={() => set_is_expanded((current_value) => !current_value)}
        >
          {is_expanded ? "less" : "...more"}
        </button>
      )}

      <a
        href={profile.websiteUrl}
        target="_blank"
        rel="noreferrer"
        className="profile-website-link"
      >
        {profile.website}
      </a>
    </div>
  );
}

function ProfilePage() {
  const { username } = useParams();

  const profile = profiles[username] || profiles.ruslan;

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
                  <button type="button" className="profile-follow-button">
                    Follow
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
                <strong>{profile.postsCount}</strong> posts
              </li>
              <li>
                <strong>{profile.followers}</strong> followers
              </li>
              <li>
                <strong>{profile.following}</strong> following
              </li>
            </ul>

            <ProfileBio profile={profile} />
          </div>
        </header>

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
      </section>
    </main>
  );
}

export default ProfilePage;