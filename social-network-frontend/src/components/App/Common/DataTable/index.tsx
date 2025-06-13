import React from "react";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { Grid2, Paper } from "@mui/material";
import { paperStyle } from "../../../../theme/paperStyle";

export type TableState = {
  pageNo: number;
  perPage: number;
  totalItems: number;
  summaryItem: any;
  listItems: any[];
  loading: boolean; //loading when change filters
  loadingSwitchPage: boolean; // loading when switch page
};

interface TableProps {
  rowId: (params: any) => string;
  listItems: any[];
  //   handleChangePage?(pageNo: number): void;
  //   handleChangePerPage?(perPage: number): void;
  columns: GridColDef<any>[];
  tableHeight: string;
}

const Apptable: React.FC<TableProps> = (props) => {
  const {
    rowId,
    columns,
    listItems,
    // loading,
    // loadingSwitchPage,
    // pageNo,
    // perPage,
    // totalItems,
    // handleChangePage,
    // handleChangePerPage,
    tableHeight,
  } = props;
  return (
    <>
      <Paper
        elevation={1}
        sx={{
          marginTop: 2,
          position: "relative",
          paperStyle,
          "& .highlight-cell": {
            backgroundColor: "#e7a800",
          },
        }}
      >
        <Grid2 container sx={{ height: tableHeight }}>
          <DataGridPro
            hideFooter
            disableColumnMenu
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                whiteSpace: "break-spaces",
                lineHeight: 1.2,
                fontWeight: 600,
              },
            }}
            columnHeaderHeight={60}
            rowHeight={60}
            rows={listItems}
            columns={columns}
            getRowId={rowId}
          />
        </Grid2>
      </Paper>
    </>
  );
};
export default Apptable;
