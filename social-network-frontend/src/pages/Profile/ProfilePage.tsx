import { Box } from "@mui/material";
import { HeaderNotification } from "../../components/App/Header/Header";
import Navbar from "../../components/App/Navbar/Navbar";
import Profile from "../Profile/index";

const ProfilePage = () => {
  return (
    <>
      <HeaderNotification number={3} />
      <Box sx={{ padding: "0px 50px" }}>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "80%" }}>
            <Profile />
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default ProfilePage;
