import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  IconButton,
  Typography,
} from "@mui/material";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Scrollbar from "../../../components/App/Common/Scrollbar/Scrollbar";
import { HeaderDashboard } from "../../../components/App/Header/Header";
import Navbar from "../../../components/App/Navbar/Navbar";
import { commonStore, dialogStore, friendStore } from "../../../store/reducers";
import Profile from "../../Profile";
import { useTranslation } from "react-i18next";

const FriendSuggestionPage: React.FC = () => {
  const { t } = useTranslation();
  const cookies = parseCookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const FriendSuggestions = useSelector(friendStore.selectFriendSuggestion);
  const isSelectedProfile = useSelector(dialogStore.selectIsSelectedProfile);

  // get cookies
  const accessToken = cookies["accessToken"];
  const uuid = cookies["uuid"];
  useEffect(() => {
    dispatch(friendStore.sagaGetList());
  }, [dispatch]);

  const handleBack = () => {
    navigate(-1);
    dispatch(dialogStore.setIsSelectedProfile(true));
  };

  const callAPIAddFriend = async (friendUser: any) => {
    console.log("Friend user:", friendUser);
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/friend-request/create?requester=${uuid}&receiver=${friendUser}`;
    try {
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
      dispatch(friendStore.sagaGetList());
      if (data.code === 400) {
        dispatch(commonStore.actions.setErrorMessage(data.message));
      } else dispatch(commonStore.actions.setSuccessMessage(data.message));
    } catch (error) {
      dispatch(commonStore.actions.setErrorMessage("Failed to sent request"));
      console.error("Error accepting friend request:", error);
    }
  };

  return (
    <>
      <HeaderDashboard />
      <Box sx={{ padding: "0px 50px" }}>
        <Navbar />

        {/* List friend suggestion */}
        <Box sx={{ display: "flex", gap: 2 }}>
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
                {t("friend.suggestFriend")}
              </Typography>
            </Box>
            {/* friend request */}
            <Box
              sx={{
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "10px",
                width: "100%",
              }}
            >
              <Scrollbar sx={{ maxHeight: "600px", paddingRight: "5px" }}>
                <Box>
                  {FriendSuggestions.length > 0 ? (
                    FriendSuggestions.map((request, index) => (
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
                          dispatch(dialogStore.setIsSelectedProfile(false)); // set state in case choice tab
                          dispatch(dialogStore.actionToSetProfilePost()); // call to get posts data for profile
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

                        <Box
                          sx={{
                            display: "flex",
                            zIndex: "10",
                            width: "30%",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ zIndex: "10" }}
                            onClick={() => {
                              // remove friend suggestion
                              dispatch(
                                friendStore.actions.removeFriendSuggestion(
                                  request.id
                                )
                              );
                              // call API to add friend
                              callAPIAddFriend(request.createdBy.uuid);
                            }}
                          >
                            {t("friend.add")}
                          </Button>
                        </Box>
                      </ButtonBase>
                    ))
                  ) : (
                    <>Empty</>
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
export default FriendSuggestionPage;
