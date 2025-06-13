// icons
import { Icon, IconifyIcon } from "@iconify/react";
// @mui
import { Box, SxProps, Theme } from "@mui/material";

interface IconifyProps {
  icon: string | IconifyIcon;
  sx?: SxProps<Theme>;
  [key: string]: any;
}

export default function Iconify({ icon, sx, ...other }: IconifyProps) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}
