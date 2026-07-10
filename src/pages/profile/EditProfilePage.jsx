import { useEffect, useRef, useState } from "react";

import { upload_image } from "../../services/upload_api_service.js";
import {
  get_current_user_profile,
  update_current_user_profile,
} from "../../services/user_api_service.js";

import "../../styles/edit_profile.css";

function get_avatar_text(user) {
  const source = user?.username || user?.full_name || "U";

  return source
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function save_user_to_local_storage(user) {
  const userData = localStorage.getItem("user");

  const normalizedUser = {
    id: user.id || user._id,
    _id: user.id || user._id,
    username: user.username,
    full_name: user.full_name,
    fullName: user.full_name,
    email: user.email,
    bio: user.bio || "",
    website: user.website || "",
    avatar: user.avatar || "",
  };

  if (!userData) {
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    return;
  }

  try {
    const parsedUserData = JSON.parse(userData);

    if (parsedUserData.user) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...parsedUserData,
          user: {
            ...parsedUserData.user,
            ...normalizedUser,
          },
        }),
      );
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...parsedUserData,
        ...normalizedUser,
      }),
    );
  } catch {
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  }
}

function EditProfilePage() {
  const fileInputRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    website: "",
    bio: "",
    avatar: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const bioLimit = 300;

  useEffect(() => {
    let isActive = true;

    async function load_current_user() {
      try {
        const user = await get_current_user_profile();

        if (!isActive) {
          return;
        }

        setCurrentUser(user);
        setAvatarPreview(user.avatar || "");

        setFormData({
          username: user.username || "",
          full_name: user.full_name || "",
          website: user.website || "",
          bio: user.bio || "",
          avatar: user.avatar || "",
        });

        setErrorMessage("");
      } catch (error) {
        console.error("Failed to load current user:", error.message);

        if (isActive) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    load_current_user();

    return () => {
      isActive = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "bio" && value.length > bioLimit) {
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

    setSelectedAvatarFile(file);
    setAvatarPreview(imageUrl);
    setStatusMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setStatusMessage("");
      setErrorMessage("");

      let avatarUrl = formData.avatar;

      if (selectedAvatarFile) {
        const uploadResult = await upload_image(
          selectedAvatarFile,
          "ichgram/avatars",
        );

        avatarUrl = uploadResult.image_url;
      }

      const updatedUser = await update_current_user_profile({
        username: formData.username.trim(),
        full_name: formData.full_name.trim(),
        website: formData.website.trim(),
        bio: formData.bio.trim(),
        avatar: avatarUrl,
      });

      setCurrentUser(updatedUser);
      setSelectedAvatarFile(null);
      setAvatarPreview(updatedUser.avatar || "");

      setFormData({
        username: updatedUser.username || "",
        full_name: updatedUser.full_name || "",
        website: updatedUser.website || "",
        bio: updatedUser.bio || "",
        avatar: updatedUser.avatar || "",
      });

      save_user_to_local_storage(updatedUser);

      setStatusMessage("Profile saved successfully.");

      window.location.href = `/profile/${updatedUser.username}`;
    } catch (error) {
      console.error("Failed to save profile:", error.message);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="edit-profile-page">
        <section className="edit-profile-container">
          <div className="edit-profile-form">
            <h1>Edit profile</h1>
            <p className="edit-profile-status">Loading profile...</p>
          </div>
        </section>
      </main>
    );
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
                <div className="edit-profile-avatar-fallback">
                  {get_avatar_text(currentUser)}
                </div>
              )}
            </div>

            <div className="edit-profile-card-text">
              <p>{formData.username || "username"}</p>
              <span>{formData.full_name || "Full name"}</span>
            </div>

            <button
              type="button"
              className="edit-profile-photo-button"
              onClick={handlePhotoButtonClick}
              disabled={isSaving}
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
              disabled={isSaving}
            />
          </label>

          <label className="edit-profile-field">
            <span>Name</span>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={isSaving}
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
                disabled={isSaving}
              />
            </div>
          </label>

          <label className="edit-profile-field edit-profile-about-field">
            <span>Bio</span>
            <div className="edit-profile-textarea-wrap">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={isSaving}
              />
              <small>
                {formData.bio.length} / {bioLimit}
              </small>
            </div>
          </label>

          {statusMessage && (
            <p className="edit-profile-status">{statusMessage}</p>
          )}

          {errorMessage && <p className="edit-profile-error">{errorMessage}</p>}

          <button
            type="submit"
            className="edit-profile-save-button"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default EditProfilePage;
