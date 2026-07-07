import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smile, UploadCloud, X } from "lucide-react";

import ProfilePage from "../profile/ProfilePage.jsx";

import "../../styles/create_post.css";

const emojis = ["😀", "🔥", "🚀", "💡", "👏", "❤️", "✅", "🎯", "📌", "💻"];

function CreatePostPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  function handleCloseCreatePost() {
    navigate("/profile/ruslan");
  }

  function handleOpenFileDialog() {
    fileInputRef.current?.click();
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
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

  function handleSharePost() {
    if (!selectedFile) {
      alert("Please select a photo before sharing the post.");
      return;
    }

    console.log("Create post will be connected to backend later:", {
      image: selectedFile,
      caption,
    });

    navigate("/profile/ruslan");
  }

  return (
    <main className="create-post-page">
      <div className="create-post-background">
        <ProfilePage forcedUsername="ruslan" />
      </div>

      <div className="create-post-dark-overlay" />

      <section className="create-post-modal">
        <header className="create-post-header">
          <h1>Create new post</h1>

          <button
            type="button"
            className="create-post-share-button"
            onClick={handleSharePost}
          >
            Share
          </button>

          <button
            type="button"
            className="create-post-close-button"
            aria-label="Close create post"
            onClick={handleCloseCreatePost}
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

                <button type="button">Select photo</button>
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
                <span>RC</span>
              </div>

              <div className="create-post-user-info">
                <p>ruslan</p>
                <span>Ruslan Chyhryn</span>
              </div>
            </div>

            <label className="create-post-caption-field">
              <span>Caption</span>

              <textarea
                value={caption}
                onChange={handleCaptionChange}
                placeholder="Write a caption..."
                maxLength={2200}
              />

              <div className="create-post-caption-tools">
                <div className="create-post-emoji-wrap">
                  <button
                    type="button"
                    className="create-post-emoji-button"
                    aria-label="Add emoji"
                    onClick={handleToggleEmojiPicker}
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
          </aside>
        </div>
      </section>
    </main>
  );
}

export default CreatePostPage;
