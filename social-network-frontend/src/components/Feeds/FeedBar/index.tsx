import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBar, ItemBox } from "./styles";
import { Link } from "react-router-dom";
import GradeIcon from "@mui/icons-material/Grade";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useTranslation } from "react-i18next";

const NavLink = ({
  to,
  icon,
  label,
}: {
  to?: any;
  icon?: any;
  label?: any;
}) => (
  <Link
    to={to}
    style={{ textDecoration: "none", color: "inherit", width: "100%" }}
  >
    <ItemBox>
      <IconButton>{icon}</IconButton>
      <Typography>{label}</Typography>
    </ItemBox>
  </Link>
);

const FeedBar = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ width: "24%", height: "100%" }}>
      <ArrowBar>
        <Typography variant="h6" gutterBottom>
          {t("feed.feed")}
        </Typography>
        <NavLink
          to="/feeds"
          icon={<DynamicFeedIcon />}
          label={t("feed.allFeed")}
        />
        <NavLink
          to="/feeds/follows"
          icon={<GradeIcon />}
          label={t("feed.followFeed")}
        />
        <NavLink
          to="/feeds/friends"
          icon={<PeopleAltIcon />}
          label={t("feed.friendFeed")}
        />
      </ArrowBar>
    </Box>
  );
};

export default FeedBar;
