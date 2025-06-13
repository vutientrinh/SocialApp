import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Iconify from "../Iconify/Iconify";
import { profileStore } from "../../../../store/reducers";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

function InfoFileItem({
  avatar,
  email,
  username,
}: {
  avatar: string;
  email: string;
  username: string;
}) {
  return (
    <ListItemButton
      sx={{
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      <ListItemAvatar>
        <Avatar src={avatar} alt={username} />
      </ListItemAvatar>
      <ListItemText
        primary={username}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <Iconify
              icon="eva:email-outline"
              sx={{ mr: 0.5, width: 16, height: 16 }}
            />
            {email}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

interface InfoUserItemProps {
  createdBy: {
    uuid: string;
    username: string;
    email: string;
  };
}

interface ProfileItemType {
  avatar: string;
}

const InfoUserItem: React.FC<InfoUserItemProps> = ({ createdBy }) => {
  const dispatch = useDispatch();
  const [profileItem, setProfileItem] = useState<ProfileItemType | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(profileStore.sagaGetProfile());

      try {
        const cookies = parseCookies();
        const token = cookies["accessToken"];
        const URL = `${process.env.REACT_APP_BACKEND_URL}api/profile/get-profile-by-username/${createdBy.username}`;

        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProfileItem(data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [createdBy, dispatch]);

  if (!profileItem) {
    return <div>Loading...</div>; // Show a loader while fetching
  }

  return (
    <InfoFileItem
      key={createdBy.uuid}
      avatar={profileItem.avatar}
      email={createdBy.email}
      username={createdBy.username}
    />
  );
};

export default InfoUserItem;
