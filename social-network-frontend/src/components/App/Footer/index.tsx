import { Box, styled, Typography } from "@mui/material";

const AppFooter = () => {
  const CustomBox = styled(Box)({
    height: 25,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  const year = new Date().getFullYear();

  return (
    <CustomBox>
      <Typography>{`Copyright © ${year} by Flick`}</Typography>
    </CustomBox>
  );
};

export default AppFooter;
