import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import Apptable from "../../components/App/Common/DataTable";
import DataTablePagination from "../../components/App/Paginate/index";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { dialogStore, reportStore } from "../../store/reducers";

const UTableDetail: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const listProfile = useSelector(reportStore.selectProfiles);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(6);
  const totalItems = listProfile.length;
  const paginatedItems = listProfile.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangePerPage = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Define column structure with buttons for Add, View, and Delete
  const columns = [
    {
      field: "username",
      flex: 0.5,
      minWidth: 180,
      headerName: t("table.username"),
      renderCell: (params: any) => (
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
              {params.row.firstName} {""}
              {params.row.middleName}
              {""} {params.row.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{params.row.createdBy.username}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "email",
      flex: 0.5,
      minWidth: 200,
      headerName: t("table.email"),
      renderCell: (params: any) => (
        <Typography>{params.row.createdBy.email}</Typography>
      ),
    },
    {
      field: "role",
      flex: 0.3,
      minWidth: 120,
      headerName: t("table.role"),
      renderCell: (params: any) => (
        <Typography>{params.row.createdBy.roles[0].roleName}</Typography>
      ),
    },
    {
      field: "dateCreated",
      flex: 0.3,
      minWidth: 120,
      headerName: t("table.dateCreated"),
      renderCell: (params: any) => (
        <Typography>
          {params.row.createdAt[0] +
            "-" +
            params.row.createdAt[1] +
            "-" +
            params.row.createdAt[2]}
        </Typography>
      ),
    },
    {
      field: "lastLogin",
      flex: 0.3,
      minWidth: 120,
      headerName: t("table.lastLogin"),
      renderCell: (params: any) => <Typography>{""}</Typography>,
    },
    {
      field: "edit",
      headerName: "Edit",
      minWidth: 100,
      flex: 0.2,
      renderCell: (params: any) => (
        <IconButton
          color="warning"
          onClick={() => {
            dispatch(dialogStore.setSelectedItemProfile(true));
            dispatch(dialogStore.setItemProfile(params.row));
          }}
          sx={{
            backgroundColor: "warning.main",
            color: "white",
            "&:hover": {
              backgroundColor: "warning.dark",
            },
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   minWidth: 100,
    //   flex: 0.2,
    //   renderCell: (params: any) => (
    //     <IconButton
    //       color="error"
    //       onClick={() => console.log("Delete user:", params.row.username)}
    //       sx={{
    //         backgroundColor: "error.main",
    //         color: "white",
    //         "&:hover": {
    //           backgroundColor: "error.dark",
    //         },
    //       }}
    //     >
    //       <DeleteIcon />
    //     </IconButton>
    //   ),
    // },
  ];

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <Apptable
        rowId={(params: any) => params.id}
        listItems={paginatedItems}
        columns={columns}
        tableHeight="calc(100vh - 350px)"
      />

      {/* Pagination */}
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

export default UTableDetail;
