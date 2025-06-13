import {
  Menu,
  Pagination,
  styled,
  Stack,
  Typography,
  MenuItem,
  Box,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export type DataTablePaginationProps = {
  totalItems: number;
  page: number;
  perPage: number;
  onChangePage(page: number): void;
  onChangePerPage(perPage: number): void;
  perPageList?: number[];
};

const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    minWidth: "20px !important",
    height: "20px !important",
    padding: 0,
    color: "#777777",
    borderRadius: 4,
  },
  "& .MuiPaginationItem-icon": {
    color: theme.palette.secondary.dark,
  },
  "& .Mui-selected": {
    backgroundColor: `black !important`,
    color: theme.palette.common.white,
  },
}));

const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  page,
  perPage,
  totalItems,
  onChangePage,
  onChangePerPage,
  perPageList = [6, 9, 12, 15, 18, 21],
}) => {
  const { t } = useTranslation();
  const count = Math.ceil(totalItems / perPage);
  const [numberGoToPage, setNumberGoToPage] = useState(0);
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  useEffect(() => {
    setNumberGoToPage(page);
  }, [page]);

  const renderPerPage = () =>
    perPageList.map((item) => (
      <MenuItem onClick={handleChangePerpage(item)} key={`perPage-${item}`}>
        <Typography variant="body2">{item}</Typography>
      </MenuItem>
    ));

  const handleChangePage = (event: any, nextPage: number) => {
    if (nextPage !== 0 && nextPage <= count) {
      onChangePage(nextPage);
    }
  };

  const handleChangePerpage = (perPage: number) => () => {
    popupState.close();
    onChangePerPage(perPage);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{ mx: 1, color: "secondary.dark", height: 45 }}
      >
        <Box sx={{ width: "50%" }}></Box>

        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          justifyContent="end"
          sx={{ width: "50%" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ color: "black" }}
          >
            <Typography component="div" variant="body1" sx={{ mr: 0.5 }}>
              {t("table.rowsPerPage")}
            </Typography>
            <Stack
              sx={{ cursor: "pointer" }}
              spacing={0.5}
              direction="row"
              alignItems="center"
              {...bindTrigger(popupState)}
            >
              <Typography component="span" variant="body1">
                {perPage}
              </Typography>
              <ArrowDropDownIcon sx={{ ml: "0 !important" }} />
            </Stack>
          </Stack>
          <StyledPagination
            count={count}
            onChange={handleChangePage}
            page={page}
          />
        </Stack>
      </Stack>
      <Menu
        {...bindMenu(popupState)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {renderPerPage()}
      </Menu>
    </>
  );
};

export default DataTablePagination;
