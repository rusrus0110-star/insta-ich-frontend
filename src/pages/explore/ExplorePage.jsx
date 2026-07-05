import { useEffect, useState } from "react";

import { get_posts } from "../../api/posts_api.js";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Loader from "../../components/common/Loader.jsx";

function ExplorePage() {
  const [posts, set_posts] = useState([]);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState("");

  useEffect(() => {
    let is_mounted = true;

    const load_posts = async () => {
      try {
        const data = await get_posts();

        if (is_mounted) {
          set_posts(data.posts || []);
          set_error("");
        }
      } catch (err) {
        if (is_mounted) {
          set_error(err.response?.data?.message || "Could not load explore");
        }
      } finally {
        if (is_mounted) {
          set_is_loading(false);
        }
      }
    };

    load_posts();

    return () => {
      is_mounted = false;
    };
  }, []);

  if (is_loading) {
    return <Loader text="Loading explore..." />;
  }

  return (
    <section className="main-page">
      <div className="explore-grid">
        <ErrorMessage message={error} />

        {posts.length === 0 ? (
          <div className="main-empty-card">
            <p>No posts to explore</p>
          </div>
        ) : (
          posts.map((post) => {
            const image_url =
              post.image_url || post.image || post.photo_url || "";

            return (
              <div className="explore-item" key={post.id || post._id}>
                {image_url ? (
                  <img src={image_url} alt={post.caption || "Explore post"} />
                ) : (
                  <div className="explore-placeholder">No image</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default ExplorePage;
