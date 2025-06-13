import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBar, ItemBox } from "./styles";
import { Link } from "react-router-dom";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Groups3Icon from "@mui/icons-material/Groups3";
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

const FriendBar = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ width: "30%", height: "100%" }}>
      <ArrowBar>
        <Typography variant="h6">{t("friend.friend")}</Typography>
        <NavLink to="/" icon={<PeopleAltIcon />} label={t("friend.mainPage")} />
        <NavLink
          to="/friends/requests"
          icon={<GroupAddIcon />}
          label={t("friend.friendRequest")}
        />
        <NavLink
          to="/friends/suggestions"
          icon={<MapsUgcIcon />}
          label={t("friend.suggestFriend")}
        />
        <NavLink
          to="/friends/list"
          icon={<Diversity3Icon />}
          label={t("friend.friendList")}
        />

        {/* Follow box */}
        <NavLink
          to="/friends/follow-page"
          icon={<PersonAddAltIcon />}
          label={t("friend.suggestFollow")}
        />
        <NavLink
          to="/friends/following-page"
          icon={<Groups3Icon />}
          label={t("friend.listFollow")}
        />
      </ArrowBar>
    </Box>
  );
};

export default FriendBar;
