import { Box } from "@mui/material";
import { HeaderNotification } from "../../components/App/Header/Header";
import AppRouter from "../../routers/routes";
import SideBarv2 from "../../components/App/SideBarv2";
import Dashboard from "./Dashboard";
import User from "./User";
import File from "./File";
import { useState } from "react";

const AdminPage = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />;
      case "All User":
        return <User />;
      case "All Resource":
        return <File />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <HeaderNotification number={3} />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <SideBarv2
          open={true}
          userInformation={""}
          onClick={(pageName: string) => setCurrentPage(pageName)}
        />
        <Box
          width="82%"
          sx={{
            padding: "20px",
            marginLeft: "18%",
            overflowY: "auto",
            height: "100vh",
          }}
        >
          {renderCurrentPage()}
        </Box>
      </Box>
    </>
  );
};

export default AdminPage;
