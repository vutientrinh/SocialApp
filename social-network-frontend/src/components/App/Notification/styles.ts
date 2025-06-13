// style.ts
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material";

// Styles for NotificationItem
export const notificationItemStyle = (isUnRead: boolean): SxProps<Theme> => ({
  py: 1.5,
  px: 2.5,
  mt: "1px",
  ...(isUnRead && {
    bgcolor: "action.selected",
  }),
});

// General styles
export const iconButtonStyle: SxProps<Theme> = {
  width: 40,
  height: 40,
};

export const popoverStyle: SxProps<Theme> = {
  width: 360,
  p: 0,
  mt: 1.5,
  ml: 0.75,
};
