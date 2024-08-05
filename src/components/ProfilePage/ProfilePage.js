import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../redux/actions/authActions";
import ProfilePicture from "../ProfilePicutre/ProfilePicture";
import { auth, firestore } from "../../services/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
  TextField,
  Button,
  Typography,
  Fade,
  Box,
  CircularProgress,
} from "@mui/material";
import "./ProfilePage.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { createChat } from "../../services/firestore";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { isAuthenticated } = useAuth();

  const convertTimestampToDate = (userData) => {
    if (userData.last_login && userData.last_login.toDate) {
      userData.last_login = userData.last_login.toDate().toString();
    }
    if (userData.created_at && userData.created_at.toDate) {
      userData.created_at = userData.created_at.toDate().toString();
    }
    if (userData.updated_at && userData.updated_at.toDate) {
      userData.updated_at = userData.updated_at.toDate().toString();
    }
    return userData;
  };

  const [profileData, setProfileData] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      <Navigate to={"/"}></Navigate>;
    }
    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const serializedUserData = convertTimestampToDate(userData);
          setProfileData(serializedUserData);
        }
        const user = auth.currentUser;
        if (user && user.uid === userId) {
          setIsEditable(true);
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    };

    fetchUserProfile();
  }, [userId, isAuthenticated]);

  const { error: updateError, success: updateSuccess } = useSelector(
    (state) => state
  );

  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true); // Trigger fade-in effect on component mount
  }, []);

  const uploadFile = async (file) => {
    const storage = getStorage();
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(
      storage,
      `profile_pics/${auth.currentUser.uid}/${uniqueFileName}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      try {
        let profilePicUrl = await uploadFile(file);
        const tempData = {
          ...profileData,
          profilePicUrl: profilePicUrl,
        };
        dispatch(updateUserProfile(tempData));
        setProfileData(tempData);
        setSelectedFile(null);
      } catch (err) {}
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserProfile(profileData));
    } catch (err) {}
  };

  const handleAbort = async (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleChatButtonClick = async () => {
    const chatId = await createChat([auth.currentUser.uid, userId]);
    navigate(`/chat/${chatId}`);
  };

  if (!profileData) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          paddingTop: "20px",
          alignItems: "flex-start",
          justifyContent: "space-around",
        }}
      >
        <CircularProgress style={{ color: "white" }} />
      </div>
    );
  }

  return (
    <Fade in={fadeIn} timeout={1000}>
      <div className="profile-container">
        {isEditable ? (
          <div className="profile-form">
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  paddingBlock: 20,
                  flexDirection: "column",
                  gap: "45px",
                  justifyContent: "space-between ",
                }}
              >
                <div className="form-group">
                  <div onClick={() => fileInputRef.current.click()}>
                    <ProfilePicture profilePicUrl={profileData.profilePicUrl} />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <div className="progress-container">
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="follow-stats">
                  <Box textAlign={"center"}>
                    <Typography variant="body1">
                      {profileData.game_points}
                    </Typography>
                    <Typography color={"grey"} fontSize={12} variant="body1">
                      Points
                    </Typography>
                  </Box>
                  <Box textAlign={"center"}>
                    <Typography variant="body1">
                      {profileData.followers.length}
                    </Typography>
                    <Typography color={"grey"} fontSize={12} variant="body1">
                      Followers
                    </Typography>
                  </Box>
                  <Box textAlign={"center"}>
                    <Typography variant="body1">
                      {profileData.following.length}
                    </Typography>
                    <Typography color={"grey"} fontSize={12} variant="body1">
                      Following
                    </Typography>
                  </Box>
                </div>
              </div>

              <TextField
                label="Username"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                disabled={!isEditable}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                disabled={true}
                value={profileData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                label="Bio"
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                disabled={!isEditable}
              />
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => handleAbort(e)}
                >
                  Back
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Update Profile
                </Button>
              </div>

              <br />
              <br />

              {updateSuccess && (
                <Typography align="center" color="success" variant="body2">
                  {updateSuccess}
                </Typography>
              )}
              {updateError && (
                <Typography color="error" variant="body2">
                  {updateError}
                </Typography>
              )}
            </form>
          </div>
        ) : (
          <div className="profile-view">
            <ProfilePicture profilePicUrl={profileData.profilePicUrl} />
            <Typography variant="h5" textAlign="center">
              {profileData.username}
            </Typography>
            <div className="follow-stats">
              <Box textAlign={"center"}>
                <Typography variant="body1">
                  {profileData.game_points}
                </Typography>
                <Typography color={"grey"} fontSize={12} variant="body1">
                  Points
                </Typography>
              </Box>
              <Box textAlign={"center"}>
                <Typography variant="body1">
                  {profileData.followers.length}
                </Typography>
                <Typography color={"grey"} fontSize={12} variant="body1">
                  Followers
                </Typography>
              </Box>
              <Box textAlign={"center"}>
                <Typography variant="body1">
                  {profileData.following.length}
                </Typography>
                <Typography color={"grey"} fontSize={12} variant="body1">
                  Following
                </Typography>
                <Button variant="contained" onClick={handleChatButtonClick}>
        Chat
      </Button>
              </Box>
            </div>
            <Typography variant="body1" textAlign="center">
              {profileData.bio}
            </Typography>
          </div>
        )}
      </div>
    </Fade>
  );
};

export default Profile;
