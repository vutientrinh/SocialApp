import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Scrollbar from "../../components/App/Common/Scrollbar/Scrollbar";
import { HeaderDashboard } from "../../components/App/Header/Header";
import Navbar from "../../components/App/Navbar/Navbar";
import { dialogStore, followStore } from "../../store/reducers";
import Profile from "../Profile";
import { useTranslation } from "react-i18next";

const FollowPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const NonFollowing = useSelector(followStore.selectNonFollowing);
  const isSelectedProfile = useSelector(dialogStore.selectIsSelectedProfile);

  useEffect(() => {
    dispatch(followStore.sagaGetNotFollowing());
  }, [dispatch]);

  // back to previous page
  const handleBack = () => {
    navigate(-1);
    dispatch(dialogStore.setIsSelectedProfile(true));
  };

  return (
    <>
      <HeaderDashboard />
      <Box sx={{ padding: "0px 50px" }}>
        <Navbar />

        {/* List friend suggestion */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ width: "25%", padding: 2, margin: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton onClick={handleBack}>
                <KeyboardReturnIcon />
              </IconButton>
              <Typography variant="subtitle1" fontSize={20}>
                {t("follow.suggestFollow")}
              </Typography>
            </Box>
            {/* follow request */}
            <Box
              sx={{
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Scrollbar sx={{ maxHeight: "600px", paddingRight: "10px" }}>
                <Box>
                  {NonFollowing && NonFollowing.length > 0 ? (
                    NonFollowing.map((request, index) => (
                      <ButtonBase
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "5px",
                          borderRadius: "5px",
                          width: "100%",
                          marginBottom: "12px",
                          paddingBottom: "10px",
                        }}
                        onClick={() => {
                          dispatch(dialogStore.setSelectedProfile(request));
                          dispatch(dialogStore.setIsSelectedProfile(false));
                          dispatch(dialogStore.actionToSetProfilePost());
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "70%",
                          }}
                        >
                          <Avatar
                            src={request.avatar}
                            alt={request.firstName + " " + request.lastName}
                            sx={{ marginRight: "10px" }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              maxWidth: "70%",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <Typography variant="subtitle2" color="black">
                              {request.firstName +
                                " " +
                                request.middleName +
                                " " +
                                request.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {request.username}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: "5px", zIndex: "10" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ zIndex: "10" }}
                            onClick={() => {
                              dispatch(
                                followStore.createFollowRequest(
                                  request.createdBy.uuid
                                )
                              );
                            }}
                          >
                            {t("follow.follow")}
                          </Button>
                        </Box>
                      </ButtonBase>
                    ))
                  ) : (
                    <div>
                      {/* Display message when NonFollowing is empty or undefined */}
                      <p>Empty Following</p>
                    </div>
                  )}
                </Box>
              </Scrollbar>
            </Box>
          </Box>

          <Box sx={{ width: "75%", padding: 2 }}>
            {!isSelectedProfile && <Profile />}
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default FollowPage;
