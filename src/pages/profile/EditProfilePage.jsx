import { useRef, useState } from "react";

import "../../styles/edit_profile.css";

function EditProfilePage() {
  const fileInputRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    username: "ruslan",
    website: "linkedin.com/in/ruslanchyhryn",
    about:
      "CRM Automation · Backend Integrations · AI Workflows. Building clean data flows between websites, APIs and CRM systems.",
  });

  const aboutLimit = 150;

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "about" && value.length > aboutLimit) {
      return;
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handlePhotoButtonClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setAvatarPreview(imageUrl);
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Profile saved:", {
      ...formData,
      avatarPreview,
    });
  }

  return (
    <main className="edit-profile-page">
      <section className="edit-profile-container">
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <h1>Edit profile</h1>

          <section className="edit-profile-card">
            <div className="edit-profile-avatar-wrap">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile avatar preview"
                  className="edit-profile-avatar-image"
                />
              ) : (
                <div className="edit-profile-avatar-fallback">RC</div>
              )}
            </div>

            <div className="edit-profile-card-text">
              <p>ruslan</p>
              <span>Ruslan Chyhryn</span>
            </div>

            <button
              type="button"
              className="edit-profile-photo-button"
              onClick={handlePhotoButtonClick}
            >
              New photo
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="edit-profile-file-input"
              onChange={handlePhotoChange}
            />
          </section>

          <label className="edit-profile-field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>

          <label className="edit-profile-field">
            <span>Website</span>
            <div className="edit-profile-input-with-icon">
              <span aria-hidden="true">↗</span>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </label>

          <label className="edit-profile-field edit-profile-about-field">
            <span>About</span>
            <div className="edit-profile-textarea-wrap">
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
              />
              <small>
                {formData.about.length} / {aboutLimit}
              </small>
            </div>
          </label>

          <button type="submit" className="edit-profile-save-button">
            Save
          </button>
        </form>
      </section>
    </main>
  );
}

export default EditProfilePage;
