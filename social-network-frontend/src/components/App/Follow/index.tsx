import { Avatar, Box, Button, Link, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followStore } from "../../../store/reducers";
import Scrollbar from "../Common/Scrollbar/Scrollbar";
import { useTranslation } from "react-i18next";

const ListFollow: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const followRequestList = useSelector(followStore.selectNonFollowing);
  useEffect(() => {
    dispatch(followStore.sagaGetNotFollowing());
  }, [dispatch]);

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: "250px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        height: "50%",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
      }}
    >
      <Typography
        variant="h6"
        sx={{ paddingBottom: "10px", borderBottom: "1px solid #e0e0e0" }}
      >
        {t("mainPage.followRequest")}
      </Typography>

      <Scrollbar>
        <Box
          sx={{
            width: "100%",
            padding: 2,
            flex: 1,
            overflowY: "auto",
            marginTop: "10px",
          }}
        >
          {followRequestList.length > 0 ? (
            followRequestList.map((request, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "12px",
                  paddingBottom: "10px",
                  borderBottom:
                    index < followRequestList.length - 1
                      ? "1px solid #e0e0e0"
                      : "none",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={request.avatar}
                    alt={request.username}
                    sx={{ marginRight: "10px" }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {request.firstName} {request.middleName}{" "}
                      {request.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{request.createdBy.username}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: "8px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ zIndex: "10" }}
                    onClick={() => {
                      dispatch(
                        followStore.createFollowRequest(request.createdBy.uuid)
                      );
                    }}
                  >
                    {t("follow.follow")}
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", marginTop: "20px" }}
            >
              {t("follow.noRequestFollow")}
            </Typography>
          )}
        </Box>
      </Scrollbar>

      <Link
        href="/friends/follow-page"
        underline="hover"
        sx={{ textAlign: "center", marginTop: "10px", fontSize: "14px" }}
      >
        {t("mainPage.viewAllRequest")}
      </Link>
    </Box>
  );
};

export default ListFollow;
