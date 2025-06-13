import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="grey.100"
      overflow="hidden"
    >
      <Box textAlign="center" className="animate-float">
        <Typography
          variant="h1"
          fontWeight="bold"
          color="primary"
          className="animate-shake"
          sx={{ fontSize: { xs: "6rem", md: "9rem" } }}
        >
          404
        </Typography>
        <Typography variant="h6" mt={2} color="textSecondary">
          Oops! Page Not Found
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            mt: 3,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          Go Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
