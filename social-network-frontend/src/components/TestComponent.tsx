import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

const TestComponent = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState("en");

  return (
    <>
      {/* <nav>
        <ul>
          <li>
            <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
              <Typography sx={{ fontSize: 20 }}>
                {t("navbar.dashboard")}
              </Typography>
            </Link>
          </li>
          <li>
            <Link to="/admin/user" style={{ textDecoration: "none" }}>
              <Typography sx={{ fontSize: 20 }}>{t("navbar.user")}</Typography>
            </Link>
          </li>
        </ul>
      </nav> */}
      <Button
        variant="contained"
        onClick={() => {
          setCurrentLanguage(currentLanguage === "en" ? "vi" : "en");
          i18n.changeLanguage(currentLanguage === "en" ? "vi" : "en");
        }}
        sx={{
          margin: 4,
          color: "black",
          fontSize: 16,
          backgroundColor: theme.palette.primary.main,
        }}
      >
        Change Language En - Vi
      </Button>

      <Box>
        <Typography
          sx={{
            color: theme.palette.primary.main,
            fontSize: 24,
          }}
        >
          Welcome to Flick
        </Typography>
      </Box>
    </>
  );
};

export default TestComponent;
