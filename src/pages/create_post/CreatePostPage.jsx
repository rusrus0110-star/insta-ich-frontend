import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smile, UploadCloud, X } from "lucide-react";

import ProfilePage from "../profile/ProfilePage.jsx";

import { get_current_user_profile } from "../../services/user_api_service.js";
import { upload_image } from "../../services/upload_api_service.js";
import { create_post } from "../../services/post_api_service.js";

import "../../styles/create_post.css";

const emojis = ["😀", "🔥", "🚀", "💡", "👏", "❤️", "✅", "🎯", "📌", "💻"];

function get_avatar_text(user) {
  const source = user?.username || user?.full_name || "U";

  return source
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function CreatePostPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function load_current_user() {
      try {
        const user = await get_current_user_profile();

        if (!isActive) {
          return;
        }

        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to load current user:", error.message);

        if (isActive) {
          setErrorMessage(error.message);
        }
      }
    }

    load_current_user();

    return () => {
      isActive = false;
    };
  }, []);

  function handleCloseCreatePost() {
    navigate(`/profile/${currentUser?.username || "ruslan"}`);
  }

  function handleOpenFileDialog() {
    if (isSaving) {
      return;
    }

    fileInputRef.current?.click();
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorMessage("");
  }

  function handleCaptionChange(event) {
    setCaption(event.target.value);
  }

  function handleToggleEmojiPicker() {
    setIsEmojiPickerOpen((currentValue) => !currentValue);
  }

  function handleAddEmoji(emoji) {
    setCaption((currentCaption) => `${currentCaption}${emoji}`);
    setIsEmojiPickerOpen(false);
  }

  async function handleSharePost() {
    if (!selectedFile) {
      setErrorMessage("Please select a photo before sharing the post.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const uploadResult = await upload_image(selectedFile, "ichgram/posts");

      await create_post({
        image: uploadResult.image_url,
        image_url: uploadResult.image_url,
        public_id: uploadResult.public_id,
        caption: caption.trim(),
      });

      navigate(`/profile/${currentUser?.username || "ruslan"}`);
    } catch (error) {
      console.error("Failed to create post:", error.message);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="create-post-page">
      <div className="create-post-background">
        <ProfilePage forcedUsername={currentUser?.username || "ruslan"} />
      </div>

      <div className="create-post-dark-overlay" />

      <section className="create-post-modal">
        <header className="create-post-header">
          <h1>Create new post</h1>

          <button
            type="button"
            className="create-post-share-button"
            onClick={handleSharePost}
            disabled={isSaving}
          >
            {isSaving ? "Sharing..." : "Share"}
          </button>

          <button
            type="button"
            className="create-post-close-button"
            aria-label="Close create post"
            onClick={handleCloseCreatePost}
            disabled={isSaving}
          >
            <X size={18} strokeWidth={2} />
          </button>
        </header>

        <div className="create-post-content">
          <section
            className={
              imagePreview
                ? "create-post-upload-area create-post-upload-area-filled"
                : "create-post-upload-area"
            }
            onClick={handleOpenFileDialog}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="New post preview"
                className="create-post-preview-image"
              />
            ) : (
              <div className="create-post-upload-placeholder">
                <UploadCloud size={34} strokeWidth={1.5} />

                <p>Select photo to upload</p>

                <button type="button" disabled={isSaving}>
                  Select photo
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="create-post-file-input"
              onChange={handleImageChange}
            />
          </section>

          <aside className="create-post-details">
            <div className="create-post-user">
              <div className="create-post-avatar-ring">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={`${currentUser.username} avatar`}
                    className="create-post-avatar-image"
                  />
                ) : (
                  <span>{get_avatar_text(currentUser)}</span>
                )}
              </div>

              <div className="create-post-user-info">
                <p>{currentUser?.username || "username"}</p>
                <span>{currentUser?.full_name || "Full name"}</span>
              </div>
            </div>

            <label className="create-post-caption-field">
              <span>Caption</span>

              <textarea
                value={caption}
                onChange={handleCaptionChange}
                placeholder="Write a caption..."
                maxLength={2200}
                disabled={isSaving}
              />

              <div className="create-post-caption-tools">
                <div className="create-post-emoji-wrap">
                  <button
                    type="button"
                    className="create-post-emoji-button"
                    aria-label="Add emoji"
                    onClick={handleToggleEmojiPicker}
                    disabled={isSaving}
                  >
                    <Smile size={17} strokeWidth={1.8} />
                  </button>

                  {isEmojiPickerOpen && (
                    <div className="create-post-emoji-picker">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleAddEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <small>{caption.length} / 2200</small>
              </div>
            </label>

            {errorMessage && (
              <p className="create-post-error-message">{errorMessage}</p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

export default CreatePostPage;
