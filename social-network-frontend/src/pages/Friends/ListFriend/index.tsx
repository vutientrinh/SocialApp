import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Dialog,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Scrollbar from "../../../components/App/Common/Scrollbar/Scrollbar";
import { HeaderDashboard } from "../../../components/App/Header/Header";
import Navbar from "../../../components/App/Navbar/Navbar";
import SearchCustom from "../../../components/App/SeachBar/index";
import { commonStore, dialogStore, friendStore } from "../../../store/reducers";
import Profile from "../../Profile";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useTranslation } from "react-i18next";

const ListFriend = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const listFriend = useSelector(friendStore.selectFriends);
  const isSelectedProfile = useSelector(dialogStore.selectIsSelectedProfile);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null as any);

  const handleBack = () => {
    navigate(-1);
    dispatch(dialogStore.setIsSelectedProfile(true));
  };

  // Fetch friend list on component mount
  useEffect(() => {
    dispatch(friendStore.sagaGetList());
  }, [dispatch]);

  const handleOpenDialog = (friend: any) => {
    setSelectedFriend(friend);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFriend(null);
  };

  // remove friend
  const fHandleRemoveFriend = async (friend: any) => {
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const currentUser = cookies["uuid"];

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}api/friend/remove?currentUser=${currentUser}&friendUser=${friend.createdBy.uuid}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        dispatch(
          commonStore.actions.setErrorMessage("Error removing relationship")
        );
        return;
      }

      const data = await response.json();
      if (data.code === 200) {
        dispatch(
          commonStore.actions.setSuccessMessage(
            "Relationship removed successfully"
          )
        );
      } else {
        dispatch(
          commonStore.actions.setErrorMessage("Error removing relationship")
        );
      }
    } catch (error) {
      console.error("Error removing relationship:", error);
      dispatch(
        commonStore.actions.setErrorMessage("Error removing relationship")
      );
    }
  };

  const handleRemoveFriend = () => {
    if (selectedFriend) {
      console.log("Remove friend", selectedFriend);
      fHandleRemoveFriend(selectedFriend);
      // dispatch remove in store
      dispatch(friendStore.actions.removeFriend(selectedFriend.id));
    }
    handleCloseDialog();
  };

  return (
    <>
      <HeaderDashboard />
      <Box sx={{ padding: "0px 50px" }}>
        <Navbar />

        {/* List friend suggestion */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ width: "25%", padding: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={handleBack}>
                <KeyboardReturnIcon />
              </IconButton>
              <Typography variant="subtitle1" fontSize={20}>
                {t("friend.friendList")}
              </Typography>
            </Box>

            {/* Search Bar */}
            <SearchCustom searchTitle="navbar.search" />
            <Divider sx={{ margin: "10px 0px" }} />
            <Typography variant="subtitle2">
              {`${listFriend.length}`} {t("friend.friend")}
            </Typography>

            {/* Friend list */}
            <Box
              sx={{
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Scrollbar sx={{ maxHeight: "540px" }}>
                <Box>
                  {listFriend.map((friend, index) => (
                    <ButtonBase
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: "12px",
                        paddingBottom: "10px",
                      }}
                      onClick={() => {
                        dispatch(dialogStore.setSelectedProfile(friend));
                        dispatch(dialogStore.setIsSelectedProfile(false));
                        dispatch(dialogStore.actionToSetProfilePost());
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={friend.avatar}
                          alt={`${friend.firstName} ${friend.lastName}`}
                          sx={{ marginRight: "10px" }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            maxWidth: "80%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Typography variant="subtitle2" color="black">
                            {`${friend.firstName} ${friend.middleName} ${friend.lastName}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {friend.username}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent parent click
                          handleOpenDialog(friend);
                        }}
                      >
                        <MoreHorizIcon />
                      </IconButton>
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

      {/* Dialog for confirmation */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ padding: "20px", minWidth: "300px" }}>
          <Typography variant="h6" gutterBottom>
            Bạn có chắc chắn muốn xóa bạn này?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              marginTop: 2,
            }}
          >
            <Button variant="outlined" onClick={handleCloseDialog}>
              Hủy
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleRemoveFriend}
            >
              Xóa
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ListFriend;
