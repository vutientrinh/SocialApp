import { Box, Divider } from "@mui/material";
import { HeaderDashboard } from "../../components/App/Header/Header";
import Navbar from "../../components/App/Navbar/Navbar";
import styled from "@mui/material/styles/styled";
import FriendBar from "../../components/Friends/FriendBar";
import ListRequest from "../../components/Friends/FriendRequests";
import FriendSuggestion from "../../components/Friends/FriendSuggestion";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { friendStore } from "../../store/reducers";
import FollowPage from "../Follow";

export const NewPostStyles = styled(Box)({
  width: "55%",
  padding: "0px 20px",
});

const FriendPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(friendStore.sagaGetList());
  }, []);
  return (
    <>
      <HeaderDashboard />
      <Box sx={{ padding: "0px 50px" }}>
        <Navbar />
        <Box sx={{ display: "flex", marginTop: "20px" }}>
          <FriendBar />

          {/* Friend request */}
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <ListRequest />
            <Divider sx={{ margin: "10px" }} />
            <FriendSuggestion />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FriendPage;
