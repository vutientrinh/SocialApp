import { SxProps } from "@mui/material";

// types.ts
export interface SidebarProps {
  children: React.ReactNode;
  width?: string;
  collapsewidth?: string;
  textColor?: string;
  isCollapse?: boolean;
  themeColor?: string;
  themeSecondaryColor?: string;
  mode?: "light" | "dark";
  direction?: "ltr" | "rtl";
  userName?: string;
  designation?: string;
  showProfile?: boolean;
  userimg?: string;
  sx?: SxProps;
}

export interface SidebarContextProps {
  width: string;
  collapsewidth: string;
  textColor: string;
  isCollapse: boolean;
  themeColor: string;
}

export interface MenuProps {
  children: React.ReactNode;
  subHeading?: string;
}

export interface MenuItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  link?: string;
  badge?: boolean;
  badgeColor?:
    | "secondary"
    | "default"
    | "primary"
    | "error"
    | "info"
    | "success"
    | "warning";
  badgeContent?: string;
  textFontSize?: string;
  borderRadius?: string;
  disabled?: boolean;
  badgeType?: "filled" | "outlined";
  target?: string;
}

export interface SubmenuProps {
  children: React.ReactNode;
  title?: string;
  icon: React.ReactNode;
  borderRadius?: string;
  textFontSize?: string;
  disabled?: boolean;
}

export interface LogoProps {
  children: React.ReactNode;
  img: string;
}
