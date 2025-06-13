import { Box, Grid2, IconButton, Tab, Tabs } from "@mui/material";
import { HeaderDashboard } from "../../components/App/Header/Header";
import Navbar from "../../components/App/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MediaPage from "./MediaPage";
import VideoPage from "./VideoPage";
import { useTranslation } from "react-i18next";

const ResourcePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [tab, setTab] = useState("Media");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const renderTab = () => {
    switch (tab) {
      case "Media":
        return <MediaPage key="media" />;
      // case "Video":
      //   return <VideoPage key="video" />;
      default:
        return null;
    }
  };

  return (
    <>
      <HeaderDashboard />
      <Box sx={{ padding: "0px 50px" }}>
        <Navbar />

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Box sx={{ width: "100%", padding: 2 }}>
            <Grid2>
              <Tabs
                value={tab}
                onChange={handleChange}
                textColor="inherit"
                indicatorColor="primary"
                aria-label="nav tabs example"
                sx={{
                  fontSize: "20px",
                  width: "100%",
                  maxWidth: "400px",
                  minWidth: "400px",
                }}
              >
                <Tab
                  value="Media"
                  label={t("profile.media")}
                  sx={{ textTransform: "none", fontSize: "15px" }}
                />
                {/* <Tab
                  value="Video"
                  label="Video"
                  sx={{ textTransform: "none", fontSize: "15px" }}
                /> */}
              </Tabs>
            </Grid2>
            {renderTab()}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ResourcePage;
