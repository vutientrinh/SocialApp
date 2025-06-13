import { Components } from "@mui/material";
import { secondaryColor } from "./palette";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";

const components: Components = {
  MuiButton: {
    defaultProps: {
      size: "small",
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: "capitalize",
      },
    },
  },
  MuiCheckbox: {
    defaultProps: {
      size: "small",
      color: "primary",
    },
  },
  MuiDataGrid: {
    styleOverrides: {
      root: {
        border: "1px solid #e0e0e0",
        "& .MuiDataGrid-columnHeaders": {
          borderBottom: "none",
          color: "black",
          fontWeight: "500",
          fontSize: "14px",
          lineHeight: "1.5rem",
        },

        "& .MuiDataGrid-row": {
          "&:hover": {
            backgroundColor: `${secondaryColor.light} !important`,
          },
          "&.Mui-selected": {
            backgroundColor: `${secondaryColor.light} !important`,
          },
        },
        "& .MuiDataGrid-row:nth-child(odd)": {
          backgroundColor: "#ffffff",
        },
        "& .MuiDataGrid-row:nth-child(even)": {
          backgroundColor: "#ffffff",
        },
        "& .MuiDataGrid-cell": {
          color: "#323232",
          fontSize: 14,
          fontWeight: 400,
          "&:focus-within": {
            outline: "none",
          },
        },
        "& .highlight-row": {
          backgroundColor: "rgba(10, 194, 93, 0.6)",
        },
        "& .highlight-cell": {
          backgroundColor: "rgba(254, 252, 232, 0.8)",
        },
        "& .highlight-cell-FPA": {
          backgroundColor: "rgba(255, 204, 153, 0.6)",
        },
        "& .MuiDataGrid-row:nth-child(even) .highlight-cell-FPA": {
          backgroundColor: "rgba(255, 204, 153, 0.8)",
        },
        "& .highlight-cell-actual": {
          backgroundColor: "rgba(0, 153, 76, 0.4)",
        },
        "& .MuiDataGrid-row:nth-child(even) .highlight-cell-actual": {
          backgroundColor: "rgba(0, 153, 76, 0.6)",
        },
        "& .MuiDataGrid-columnHeaderDraggableContainer": {
          "& .MuiDataGrid-menuIcon": {
            visibility: "visible !important",
            width: "auto",
          },
        },
        "& .MuiDataGrid-columnHeaders .pricing-team": {
          backgroundColor: "rgba(232, 192, 86, 0.8)",
          borderRight: "1px solid white",
          borderLeft: "1px solid white",
        },
        "& .MuiDataGrid-columnHeaders .FPA-team": {
          backgroundColor: "rgba(255, 204, 153, 0.8)",
          borderRight: "1px solid white",
          borderLeft: "1px solid white",
        },
        "& .MuiDataGrid-columnHeaders .actual-team": {
          backgroundColor: "rgba(0, 153, 76, 0.6)",
          borderRight: "1px solid white",
          borderLeft: "1px solid white",
        },
      },
    },
  },
};

export default components;
