import React, { useState } from "react";
import { logout } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog/ConfirmationDialog";
import ProfilePicture from "./ProfilePicutre/ProfilePicture";

const MainPage = () => {
  const user = useSelector((store) => {
    return store.user;
  });
  const loading = useSelector((store) => {
    return store.loading;
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingLogout, setPendingLogout] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsDialogOpen(true);
    setPendingLogout(true);
  };

  const handleConfirmLogout = async () => {
    setIsDialogOpen(false);
    if (pendingLogout) {
      dispatch(logout());
      navigate("/login");
      setPendingLogout(false);
    }
  };

  const handleCancelLogout = () => {
    setIsDialogOpen(false);
    setPendingLogout(false);
  };

  return (
    <div style={styles.container}>
      {loading === true ? (
        <p>Loading</p>
      ) : (
        <div>
          {user && (
            <>
              <ProfilePicture profilePicUrl={user.profilePicUrl} />
              <h1 style={styles.email}>{user?.username}</h1>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={handleLogout}>Sign out</button>
              </div>
              <ConfirmationDialog
                isOpen={isDialogOpen}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
                message="Are you sure you want to log out?"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#333",
    color: "#fff",
  },
  email: {
    fontSize: "24px",
    textAlign: "center",
  },
};

export default MainPage;
