// src/components/Profile.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../redux/actions/authActions"; // Ensure you have an action for updating profile
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const {
    error: updateError,
    success: updateSuccess,
    user: userData,
  } = useSelector((state) => {
    return state;
  });

  const [profileData, setProfileData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    profilePicUrl: userData?.profilePicUrl || "",
    bio: userData?.bio || "",
    settings: userData?.settings || {
      theme: "light",
      notifications: true,
      language: "en",
    },
    address: userData?.address || "",
    phone: userData?.phone || "",
    favorite_games: userData?.favorite_games || [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfileData({
      username: userData?.username || "",
      email: userData?.email || "",
      profilePicUrl: userData?.profilePicUrl || "",
      bio: userData?.bio || "",
      settings: userData?.settings || {
        theme: "light",
        notifications: true,
        language: "en",
      },
      address: userData?.address || "",
      phone: userData?.phone || "",
      favorite_games: userData?.favorite_games || [],
    });
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      settings: { ...prevState.settings, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      dispatch(updateUserProfile(profileData));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="overlay">
          <div className="spinner">Loading...</div>
        </div>
      )}

      {updateSuccess && (
        <div className="alert alert-success">{updateSuccess}</div>
      )}
      {updateError && <div className="alert alert-error">{updateError}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={profileData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="profilePicUrl">Profile Picture URL:</label>
          <input
            type="text"
            id="profilePicUrl"
            name="profilePicUrl"
            value={profileData.profilePicUrl}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="theme">Theme:</label>
          <select
            id="theme"
            name="theme"
            value={profileData.settings.theme}
            onChange={handleSettingsChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label htmlFor="notifications">Notifications:</label>
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={profileData.settings.notifications}
            onChange={(e) =>
              handleSettingsChange({
                target: { name: "notifications", value: e.target.checked },
              })
            }
          />
        </div>
        <div>
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            name="language"
            value={profileData.settings.language}
            onChange={handleSettingsChange}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            {/* Add other languages as needed */}
          </select>
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={profileData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="favorite_games">Favorite Games:</label>
          <textarea
            id="favorite_games"
            name="favorite_games"
            value={profileData.favorite_games.join(", ")}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                favorite_games: e.target.value.split(", "),
              })
            }
            rows="3"
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
