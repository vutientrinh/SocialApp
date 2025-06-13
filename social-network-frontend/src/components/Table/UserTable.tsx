import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import HelpIcon from "@mui/icons-material/Help";
import CircleIcon from "@mui/icons-material/Circle";
import Apptable from "../../components/App/Common/DataTable";
import DataTablePagination from "../../components/App/Paginate/index";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { reportStore, userStore } from "../../store/reducers";

const UserTable: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const listProfile = useSelector(reportStore.selectProfiles);

  // Transform listProfile to include only the necessary properties
  const listProfiles = listProfile.map((profile) => ({
    id: profile.createdBy.uuid,
    avatar: profile.avatar,
    nameProfile: `${profile.firstName} ${profile.middleName} ${profile.lastName}`,
    username: profile.createdBy.username,
    email: profile.createdBy.email,
    role: profile.createdBy.roles[0].roleName,
    dateCreated:
      profile.createdAt[0] +
      "-" +
      profile.createdAt[1] +
      "-" +
      profile.createdAt[2],
    lastLogin: new Date().toISOString().split("T")[0],
    userStatus: profile.createdBy.active,
  }));

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(6);
  const totalItems = listProfiles.length;
  const paginatedItems = listProfiles.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handleChangePage = (newPage: number) => setPage(newPage);

  const handleChangePerPage = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  const toggleUserStatus = (userId: string) => {
    dispatch(userStore.sagaChangeStatus(userId));
  };

  const columns: GridColDef[] = [
    {
      field: "userStatus",
      minWidth: 50,
      headerName: t("table.status"),
      flex: 0.1,
      type: "boolean",
      sortable: false,
      renderHeader: () => (
        <HelpIcon
          sx={{
            width: 20,
            height: 20,
            fill: "#AEB9CB",
            "&:hover": { fill: "black" },
          }}
        />
      ),
      renderCell: (params) => (
        <CircleIcon
          sx={{
            color: params.row.userStatus ? "#0b5fff" : "#ccc",
            height: 8,
            width: 8,
          }}
        />
      ),
    },
    {
      field: "username",
      flex: 0.5,
      minWidth: 180,
      headerName: t("table.username"),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={
              params.row.avatar
                ? params.row.avatar
                : "/static/avatars/avatar_default.jpg"
            }
            alt="avatar"
            sx={{ marginRight: "10px" }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {params.row.nameProfile}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{params.row.username}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { field: "email", flex: 0.5, minWidth: 200, headerName: t("table.email") },
    { field: "role", flex: 0.3, minWidth: 120, headerName: t("table.role") },
    {
      field: "dateCreated",
      flex: 0.3,
      minWidth: 120,
      headerName: t("table.dateCreated"),
    },
    {
      field: "lastLogin",
      flex: 0.3,
      minWidth: 120,
      headerName: t("table.lastLogin"),
    },
    {
      field: "isActive",
      flex: 0.3,
      minWidth: 120,
      headerName: t("table.active"),
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color={params.row.userStatus ? "success" : "error"}
            onClick={() => toggleUserStatus(params.row.id)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 16px",
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "500",
              fontSize: "14px",
              minWidth: "100px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                transform: "scale(1.05)",
              },
            }}
            startIcon={
              params.row.userStatus ? (
                <CheckCircleIcon sx={{ color: "white" }} />
              ) : (
                <CancelIcon sx={{ color: "white" }} />
              )
            }
          >
            {params.row.userStatus ? "Active" : "Inactive"}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <Apptable
        rowId={(params: any) => params.id}
        listItems={paginatedItems}
        columns={columns}
        tableHeight="calc(100vh - 350px)"
      />
      <DataTablePagination
        totalItems={totalItems}
        page={page}
        perPage={perPage}
        onChangePage={handleChangePage}
        onChangePerPage={handleChangePerPage}
      />
    </Box>
  );
};

export default UserTable;
