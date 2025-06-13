import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  IconButton,
  Typography,
} from "@mui/material";
import { HeaderDashboard } from "../../../components/App/Header/Header";
import Navbar from "../../../components/App/Navbar/Navbar";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Scrollbar from "../../../components/App/Common/Scrollbar/Scrollbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { commonStore, dialogStore, friendStore } from "../../../store/reducers";
import Profile from "../../Profile";
import { useEffect } from "react";
import { parseCookies } from "nookies";
import { useTranslation } from "react-i18next";

const FriendRequestPage = () => {
  const { t } = useTranslation();
  const cookies = parseCookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const friendRequests = useSelector(friendStore.selectFriendRequest);
  const isSelectedProfile = useSelector(dialogStore.selectIsSelectedProfile);

  // get cookies
  const accessToken = cookies["accessToken"];
  const uuid = cookies["uuid"];
  const handleBack = () => {
    navigate(-1);
    dispatch(dialogStore.setIsSelectedProfile(true));
  };

  useEffect(() => {
    dispatch(friendStore.sagaGetList());
  }, [dispatch]);

  const callAPIAcceptRequest = async (requester: any) => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/friend-request/accept?requester=${requester}&receiver=${uuid}`;

    try {
      // Fetch request to accept friend
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to accept friend request");
      }

      const data = await response.json();
      dispatch(
        commonStore.actions.setSuccessMessage(
          "Accept friend request successfully!"
        )
      );
      dispatch(friendStore.sagaGetList());
    } catch (error) {
      dispatch(
        commonStore.actions.setErrorMessage("Failed to accept friend request")
      );
      console.error("Error accepting friend request:", error);
    }
  };

  const callAPIRejectRequest = async (requester: any) => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/friend-request/reject?requester=${requester}&receiver=${uuid}`;

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reject friend request");
      }

      const data = await response.json();
      dispatch(
        commonStore.actions.setSuccessMessage(
          "Reject friend request successfully!"
        )
      );
      dispatch(friendStore.sagaGetList());
    } catch (error) {
      dispatch(
        commonStore.actions.setErrorMessage("Failed to reject friend request")
      );
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <>
      <HeaderDashboard />
      <Box sx={{ padding: "0px 50px" }}>
        <Navbar />

        {/* List friend suggestion */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* set zindex */}
          <Box sx={{ width: "25%", padding: 2 }}>
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
                {t("friend.friendRequest")}
              </Typography>
            </Box>
            <Typography variant="subtitle2">
              {`${friendRequests.length}`} {t("friend.friendRequest")}
            </Typography>
            {/* friend request */}
            <Box
              sx={{
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Scrollbar sx={{ maxHeight: "600px" }}>
                <Box>
                  {friendRequests.map((request, index) => (
                    <ButtonBase
                      key={index}
                      sx={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        borderRadius: "10px",
                        marginBottom: "12px",
                        padding: "10px",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                      onClick={() => {
                        dispatch(dialogStore.setSelectedProfile(request));
                        dispatch(dialogStore.setIsSelectedProfile(false)); // set state in case choice tab
                        dispatch(dialogStore.actionToSetProfilePost()); // call to get posts data for profile
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={request.avatar}
                            alt={`${request.firstName} ${request.lastName}`}
                            sx={{ marginRight: "10px" }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <Typography variant="subtitle2" color="black">
                              {`${request.firstName} ${request.middleName} ${request.lastName}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {request.username}
                            </Typography>
                          </Box>
                        </Box>
                        {/* Wrap buttons in a non-clickable div */}
                        <Box sx={{ display: "flex", gap: "5px" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => {
                              dispatch(
                                friendStore.actions.removeFriendRequest(
                                  request.id
                                )
                              );
                              // call API to accept friend request
                              callAPIAcceptRequest(request.createdBy.uuid);
                            }}
                          >
                            {t("friend.accept")}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              dispatch(
                                friendStore.actions.removeFriendRequest(
                                  request.id
                                )
                              );
                              // call API to reject friend request
                              callAPIRejectRequest(request.createdBy.uuid);
                            }}
                          >
                            {t("friend.reject")}
                          </Button>
                        </Box>
                      </Box>
                    </ButtonBase>
                  ))}
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
export default FriendRequestPage;
