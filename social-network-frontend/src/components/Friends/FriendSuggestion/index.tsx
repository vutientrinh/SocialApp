import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { commonStore, friendStore } from "../../../store/reducers";
import { parseCookies } from "nookies";
import { useTranslation } from "react-i18next";

const FriendSuggestion = () => {
  const { t } = useTranslation();
  const cookies = parseCookies();
  const dispatch = useDispatch();
  const friendSuggests = useSelector(friendStore.selectFriendSuggestion);

  // get cookies
  const accessToken = cookies["accessToken"];
  const uuid = cookies["uuid"];

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
      {/* List request, suggestions */}
      <Box sx={{ margin: "10px", flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle1">
            {t("friend.suggestFriend")}
          </Typography>
          <Link to="/friends/suggestions">
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
          {friendSuggests.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ width: "100%" }}>
              List suggestions is empty
            </Typography>
          ) : (
            friendSuggests.map((request) => (
              <Box
                key={request.id}
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

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {
                      // remove friend suggestion
                      dispatch(
                        friendStore.actions.removeFriendSuggestion(request.id)
                      );
                      // call API to add friend
                      callAPIAddFriend(request.createdBy.uuid);
                    }}
                  >
                    {t("friend.addFriend")}
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
export default FriendSuggestion;
