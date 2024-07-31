import React from "react";
import "./ProfilePicture.css"; // Import CSS for styling

const ProfilePicture = ({ profilePicUrl }) => {
  return (
    <div className="profile-picture-container">
      <img src={profilePicUrl} alt="Profile" className="profile-picture" />
    </div>
  );
};

export default ProfilePicture;
