import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Apptable from "../../components/App/Common/DataTable";
import InfoUserItem from "../../components/App/Common/DataTable/InfoItem";
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import FileItem from "../../components/App/Common/DataTable/FileItem";
import CircleIcon from "@mui/icons-material/Circle";
import HelpIcon from "@mui/icons-material/Help";
import { GridColDef } from "@mui/x-data-grid-pro";
import FilterBar from "../../components/App/Common/FilterBar";
import DataTablePagination from "../../components/App/Paginate/index";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useDispatch, useSelector } from "react-redux";
import { imagesStore } from "../../store/reducers";
import { fChangeToMB } from "../../utils/formatNumber";
import axios from "axios";

const File: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // fetching media resources
  useEffect(() => {
    dispatch(imagesStore.fetchMediaResources());
  }, []);

  const mediaResources = useSelector(imagesStore.selectMediaResources);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(6);
  const totalItems = mediaResources ? mediaResources.length : 0;
  const paginatedItems = mediaResources
    ? mediaResources.slice((page - 1) * perPage, page * perPage)
    : [];

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangePerPage = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Table columns
  const columns: GridColDef<any>[] = [
    {
      field: "fileType",
      minWidth: 50,
      headerName: "File Type",
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
      renderCell() {
        return <CircleIcon sx={{ color: "#0b5fff", height: 8, width: 8 }} />;
      },
    },
    {
      field: "fileName",
      flex: 0.6,
      minWidth: 200,
      headerName: `${t("table.fileName")}`,
      renderCell: (params: any) => (
        <FileItem
          fileName={params.row.fileName}
          fileType={params.row.fileType}
        />
      ),
    },
    {
      field: "dateUploaded",
      flex: 0.3,
      minWidth: 120,
      headerName: `${t("table.dateUploaded")}`,
      renderCell: (params: any) => (
        <span>
          {params?.row.createdAt[0] +
            "-" +
            params?.row.createdAt[1] +
            "-" +
            params?.row.createdAt[2]}
        </span>
      ),
    },
    {
      field: "fileSize",
      flex: 0.2,
      minWidth: 100,
      headerName: `${t("table.fileSize")}`,
      renderCell: (params: any) => (
        <span>{fChangeToMB(params?.row.fileSize)}</span>
      ),
    },
    {
      field: "fileOwner",
      flex: 0.5,
      minWidth: 180,
      headerName: `${t("table.fileOwner")}`,
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <InfoUserItem createdBy={params.row.createdBy} />
        </Box>
      ),
    },
    {
      field: "lastUpdated",
      flex: 0.3,
      minWidth: 120,
      renderCell: (params: any) => (
        <span>
          {params?.row.lastModifiedDate[0] +
            "-" +
            params?.row.lastModifiedDate[1] +
            "-" +
            params?.row.lastModifiedDate[2]}
        </span>
      ),
    },
    {
      field: "download",
      headerName: `${t("table.download")}`,
      flex: 0.2,
      minWidth: 80,
      sortable: false,
      renderCell: (params: any) => {
        const handleDownloadFromServer = async (
          filePath: string,
          fileName: string
        ) => {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}api/file/downloadFile`,
              {
                params: { filePath },
                responseType: "blob",
              }
            );
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              fileName + "." + filePath.split(".").pop() || "file"
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Error downloading the file:", error);
          }
        };

        return (
          <IconButton
            color="primary"
            onClick={() =>
              handleDownloadFromServer(params.row.filePath, params.row.fileName)
            }
            aria-label="download"
          >
            <CloudDownloadIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <Typography sx={{ color: "black", fontSize: 20, padding: 1 }}>
        All Files
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <FilterBar />
        <Divider sx={{ padding: 1 }} />
        <Apptable
          rowId={(params: any) => params.uuid}
          listItems={paginatedItems}
          columns={columns}
          tableHeight="calc(100vh - 250px)"
        />

        {/* Pagination */}
        <DataTablePagination
          totalItems={totalItems}
          page={page}
          perPage={perPage}
          onChangePage={handleChangePage}
          onChangePerPage={handleChangePerPage}
        />
      </Paper>
    </Box>
  );
};

export default File;
