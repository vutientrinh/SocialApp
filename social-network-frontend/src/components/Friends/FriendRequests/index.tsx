import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { commonStore, friendStore } from "../../../store/reducers";
import { useDispatch, useSelector } from "react-redux";
import { parseCookies } from "nookies";
import { useTranslation } from "react-i18next";

const ListRequest = () => {
  const { t } = useTranslation();
  const cookies = parseCookies();
  const dispatch = useDispatch();
  const friendRequestList = useSelector(friendStore.selectFriendRequest);

  // get cookies
  const accessToken = cookies["accessToken"];
  const uuid = cookies["uuid"];

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
      {/* List request, suggestions */}
      <Box sx={{ margin: "10px", flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle1">
            {t("friend.friendRequest")}
          </Typography>
          <Link to="/friends/requests">
            <Typography variant="subtitle2">{t("friend.viewAll")}</Typography>
          </Link>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            width: "100%",
          }}
        >
          {friendRequestList.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ width: "100%" }}>
              {t("friend.listRequestEmpty")}
            </Typography>
          ) : (
            friendRequestList.map((request) => (
              <Box
                key={request.user?.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  padding: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  width: "calc(100% / 5 - 16px)",
                }}
              >
                <img
                  src={request.avatar}
                  alt="User Avatar"
                  style={{
                    width: "100%",
                    height: 150,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
                <Typography variant="subtitle1" align="center">
                  {request.firstName} {request.middleName} {request.lastName}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {
                      dispatch(
                        friendStore.actions.removeFriendRequest(request.id)
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
                    fullWidth
                    onClick={() => {
                      dispatch(
                        friendStore.actions.removeFriendRequest(request.id)
                      );
                      // call API to reject friend request
                      callAPIRejectRequest(request.createdBy.uuid);
                    }}
                  >
                    {t("friend.reject")}
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </>
  );
};

export default ListRequest;
