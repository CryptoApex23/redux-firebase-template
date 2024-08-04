import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { Fade } from "@mui/material";

const MainPage = React.memo(() => {
  const loading = useSelector((store) => {
    return store.loading;
  });

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true); // Trigger fade-in effect on component mount
  }, []);

  return (
    <div style={styles.container}>
      {loading === true ? (
        <CircularProgress color="success" />
      ) : (
        <Fade timeout={1000} in={fadeIn}>
          <div></div>
        </Fade>
      )}
    </div>
  );
});

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
