import { Box, Divider, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import UserTable from "../../components/Table/UserTable";
import PostChart from "../../components/Chart/PostChart";
import PieGender from "../../components/Chart/PieGender";
import { useDispatch, useSelector } from "react-redux";
import { reportStore } from "../../store/reducers";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const totalReaction = useSelector(reportStore.selectTotalReactions);
  const totalComment = useSelector(reportStore.selectTotalComments);
  const totalUser = useSelector(reportStore.selectTotalUsers);
  useEffect(() => {
    dispatch(reportStore.sagaGetList());
  }, []);

  // Header for the statistic box
  const header = [
    {
      title: "Total User",
      value: totalUser,
      percentage: "+8.6%",
    },
    {
      title: "Total Comment",
      value: totalComment,
      percentage: "+3.1%",
    },
    {
      title: "Total Reaction",
      value: totalReaction,
      percentage: "+6.7%",
    },
  ];
  return (
    <>
      {/* Statistic box (How many user, how many post, how many comment, how many reaction) */}
      <Typography fontSize={24}>Hi, Welcome back 👋</Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        {header.map((item, index) => (
          <Paper
            key={index}
            sx={{ p: 2, textAlign: "center", borderRadius: 2, minWidth: 200 }}
          >
            <Typography fontSize={20} fontWeight="bold" color="grey">
              {item.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 1,
                gap: 1,
              }}
            >
              <Typography fontSize={24} fontWeight="bold">
                {item.value}
              </Typography>
              <Typography fontSize={16} color="blue">
                {item.percentage}
              </Typography>
            </Box>
            <Typography fontSize={14} color="text.secondary" mt={1}>
              Compared to last week
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        {/* Post Statistics Chart (Make it larger) */}
        <Paper
          sx={{
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "background.paper",
            flex: 2, // Increase flex to make it larger
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              textAlign: "center",
              fontSize: 20,
            }}
          >
            Post Statistics
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <PostChart />
          </Box>
        </Paper>

        {/* PieChart (Gender Distribution) */}
        <Paper
          sx={{
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "background.paper",
            flex: 1, // Keep flex as 1 for the PieChart
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              textAlign: "center",
              fontSize: 20,
            }}
          >
            Gender Distribution
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <PieGender />
          </Box>
        </Paper>
      </Box>

      {/* User Detatil side: tracking by comment, like, post new {count} */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          maxHeight: "calc(100vh - 200px)",
          margin: "10px 0px",
        }}
      >
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h5" fontWeight="bold" color={"#333"}>
            User Details
          </Typography>
          <Divider sx={{ marginTop: 1, marginBottom: 2 }} />
        </Box>
        {/* User details to change active/in-active */}
        <UserTable />
      </Paper>

      {/* All of posts that impressive */}
    </>
  );
};

export default Dashboard;
