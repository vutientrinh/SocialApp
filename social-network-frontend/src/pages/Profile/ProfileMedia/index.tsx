import { Box, Button, Grid2 } from "@mui/material";
import MediaPage from "../../Resources/MediaPage";
import VideoPage from "../../Resources/VideoPage";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ProfileMedia = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState("Media");

  const handleChange = (newValue: string) => {
    setTab(newValue);
  };

  const renderTab = () => {
    switch (tab) {
      case "Media":
        return <MediaPage key="media" />;
      case "Video":
        return <VideoPage key="video" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", padding: "0px 0px 50px" }}>
      {/* Sidebar with buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          left: 50,
          top: 100,
          width: "20%",
          marginTop: "20px",
          marginRight: "20px",
          minWidth: "300px",
          alignItems: "flex-start",
        }}
      >
        <Button
          variant={tab === "Media" ? "contained" : "outlined"}
          onClick={() => handleChange("Media")}
          sx={{
            height: "50px",
            width: "100%",
            boxSizing: "border-box",
            padding: "8px 16px",
            borderWidth: tab === "Media" ? "0px" : "1px",
          }}
          fullWidth
        >
          {t("profile.media")}
        </Button>
        <Button
          variant={tab === "Video" ? "contained" : "outlined"}
          onClick={() => handleChange("Video")}
          sx={{
            height: "50px",
            width: "100%",
            boxSizing: "border-box",
            padding: "8px 16px",
            borderWidth: tab === "Video" ? "0px" : "1px",
          }}
          fullWidth
        >
          Video
        </Button>
      </Box>

      {/* Content area that scrolls */}
      <Box
        sx={{
          overflowY: "auto",
          minHeight: "80vh",
        }}
      >
        <Grid2>{renderTab()}</Grid2>
      </Box>
    </Box>
  );
};

export default ProfileMedia;
