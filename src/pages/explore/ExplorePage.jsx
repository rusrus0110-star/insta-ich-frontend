import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { get_all_posts } from "../../services/post_api_service.js";

import "../../styles/explore.css";

function normalize_post(post) {
  const author = post.author || {};

  return {
    id: String(post.id || post._id || "").trim(),
    image: post.image_url || post.image || "",
    publicId: post.public_id || post.publicId || "",
    caption: post.caption || "",
    authorUsername: author.username || "unknown",
    likesCount: post.likes_count || post.likesCount || 0,
    commentsCount: post.comments_count || post.commentsCount || 0,
  };
}

function get_clean_image_key(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  let cleanUrl = String(imageUrl).trim().toLowerCase();

  cleanUrl = cleanUrl.split("?")[0];

  if (cleanUrl.includes("/upload/")) {
    const afterUpload = cleanUrl.split("/upload/")[1] || "";

    const withoutVersion = afterUpload.replace(/^v\d+\//, "");

    return withoutVersion.replace(/\.[a-z0-9]+$/, "");
  }

  return cleanUrl.replace(/\.[a-z0-9]+$/, "");
}

function get_duplicate_key(post) {
  const publicId = String(post.publicId || "")
    .trim()
    .toLowerCase();
  const imageKey = get_clean_image_key(post.image);

  if (publicId) {
    return `public_id:${publicId}`;
  }

  if (imageKey) {
    return `image:${imageKey}`;
  }

  return `post:${post.id}`;
}

function remove_duplicate_posts(posts) {
  const seenPostIds = new Set();
  const seenDuplicateKeys = new Set();
  const uniquePosts = [];

  posts.forEach((post) => {
    const postId = String(post.id || "").trim();
    const duplicateKey = get_duplicate_key(post);

    if (!postId || !post.image) {
      return;
    }

    if (seenPostIds.has(postId)) {
      return;
    }

    if (seenDuplicateKeys.has(duplicateKey)) {
      return;
    }

    seenPostIds.add(postId);
    seenDuplicateKeys.add(duplicateKey);
    uniquePosts.push(post);
  });

  return uniquePosts;
}

function shuffle_posts(posts) {
  const shuffledPosts = [...posts];

  for (let index = shuffledPosts.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffledPosts[index], shuffledPosts[randomIndex]] = [
      shuffledPosts[randomIndex],
      shuffledPosts[index],
    ];
  }

  return shuffledPosts;
}

function is_tall_explore_item(index) {
  const positionInBlock = index % 10;

  return positionInBlock === 2 || positionInBlock === 5;
}

function ExplorePage() {
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

        const uniquePosts = remove_duplicate_posts(normalizedPosts);
        const randomizedPosts = shuffle_posts(uniquePosts);

        console.table(
          randomizedPosts.map((post) => ({
            id: post.id,
            username: post.authorUsername,
            duplicateKey: get_duplicate_key(post),
            image: post.image,
          })),
        );

        setPosts(randomizedPosts);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to load explore posts:", error.message);

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
      <main className="explore-page">
        <section className="explore-state-box">
          <p>Loading explore posts...</p>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="explore-page">
        <section className="explore-state-box">
          <h1>Explore is unavailable</h1>
          <p>{errorMessage}</p>
        </section>
      </main>
    );
  }

  if (posts.length === 0) {
    return (
      <main className="explore-page">
        <section className="explore-state-box">
          <h1>No posts yet</h1>
          <p>Create a few posts first, then they will appear here.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="explore-page">
      <section className="explore-grid" aria-label="Explore posts">
        {posts.map((post, index) => (
          <Link
            key={`${post.id}-${get_duplicate_key(post)}`}
            to={`/posts/${post.id}`}
            className={
              is_tall_explore_item(index)
                ? "explore-item explore-item-tall"
                : "explore-item"
            }
            aria-label={`Open post by ${post.authorUsername}`}
          >
            <img src={post.image} alt={post.caption || "Explore post"} />

            <span className="explore-item-overlay">
              <span>{post.authorUsername}</span>
              <small>
                {post.likesCount} likes · {post.commentsCount} comments
              </small>
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}

export default ExplorePage;
