import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { Link } from "react-router-dom";
import { LogoProps } from "../../SideBar/type";

// Use styled on Link instead of Box
const LogoStyled = styled(Link)(({ theme }) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  WebkitLineClamp: "1",
  fontSize: "2rem",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  width: "100%",
}));

const Logo = React.forwardRef<HTMLAnchorElement, LogoProps>(
  ({ children, img }, ref) => {
    return (

      <LogoStyled to="/" ref={ref}>
        {img === "" ? (
          <Typography variant="body1">{children}</Typography>
        ) : (
          <Box
            component="img"
            sx={{
              objectFit: "contain",
              width: "80%",
              height: "80%",
            }}
            src={img}
            alt="Logo"
          />
        )}
      </LogoStyled>
    );
  }
);

export default Logo;
