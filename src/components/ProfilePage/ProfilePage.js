import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../redux/actions/authActions"; 
import ProfilePicture from "../ProfilePicutre/ProfilePicture";
import { auth } from "../../services/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { CircularProgress, TextField, Button, Typography,  Fade,IconButton ,Box} from '@mui/material';
import "./ProfilePage.css";
import EditIcon from "@mui/icons-material/Edit"
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const {
    error: updateError,
    success: updateSuccess,
    user: userData,
    loading:isLoading
  } = useSelector((state) => state);

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
    followers:userData?.followers || [],
    following:userData?.following || [],
    address: userData?.address || "",
    phone: userData?.phone || "",
    favorite_games: userData?.favorite_games || [],
  });

  const [loading, setLoading] = useState(isLoading);
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
    const storageRef = ref(storage, `profile_pics/${auth.currentUser.uid}/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
    setLoading(true);
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
        setLoading(false);
        setSelectedFile(null);
      } catch (err) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setLoading(isLoading);

    setProfileData({
      username: userData?.username || "",
      email: userData?.email || "",
      followers:userData?.followers || [],
      following:userData?.following || [],
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
  }, [userData,isLoading]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      dispatch(updateUserProfile(profileData));
    } catch (err) {
      setLoading(false);
    }
  };

  const handleAbort = async(e)=>{
    e.preventDefault();
    navigator("/")
  }

  return (
    <Fade in={fadeIn} timeout={1000}>
    <div className="profile-container ">
      {loading && (
        <div className="loading-overlay">
          <CircularProgress color="primary" />
        </div>
      )}

      <div className="profile-form">
        <form onSubmit={handleSubmit} >
          <div style={{display:"flex",paddingBlock:20,justifyContent:"space-between "}}>
          <div className="form-group">
            <div onClick={()=>fileInputRef.current.click()}>
            <ProfilePicture  profilePicUrl={profileData.profilePicUrl} />
            </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
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
            <Typography variant="body2">
                  Followers
                </Typography>
            <Typography variant="body1">
                  {profileData.followers.length}
                </Typography>
            </Box>
            <Box textAlign={"center"}>
            <Typography variant="body2">
                  Following
                </Typography>
            <Typography variant="body1">
                  {profileData.following.length}
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
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            disabled={true  }
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
          />
          <div style={{display:"flex", gap:"10px",justifyContent:"center"}}>
          <Button  variant="contained" color="error" onClick={(e)=>handleAbort(e)}>
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary" >
            Update Profile
          </Button>
         
          </div>

          <br/>
          <br/>

          {updateSuccess && (
          <Typography color="success" variant="body2">
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
    </div>
    </Fade>
  );
};

export default Profile;
