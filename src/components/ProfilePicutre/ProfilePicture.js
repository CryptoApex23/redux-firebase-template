import React from "react";
import "./ProfilePicture.css"; // Import CSS for styling

const ProfilePicture = ({ profilePicUrl,picSize = 80 }) => {
  return (
    <div className="profile-picture-container" style={{width:picSize,height:picSize}}>
      <img src={profilePicUrl} alt="Profile" className="profile-picture" style={{width:picSize,height:picSize}} />
    </div>
  );
};

export default ProfilePicture;
