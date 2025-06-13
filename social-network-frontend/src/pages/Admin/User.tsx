import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import UTableDetail from "../../components/Table/UTableDetail";
import FilterBar from "../../components/App/Common/FilterBar";
import { useDispatch, useSelector } from "react-redux";
import {
  commonStore,
  dialogStore,
  imagesStore,
  reportStore,
  userStore,
} from "../../store/reducers";

// change profile with dialog
interface UserProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
  phoneNumber: string;
  avatar: string;
}

const User: React.FC = () => {
  // fetch user, profiles counts
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(reportStore.sagaGetList());
  });
  const isSelectedItemProfile = useSelector(
    dialogStore.selectIsSelectedItemProfile
  );

  // ItemProfile from Redux store
  const ItemProfile = useSelector(dialogStore.selectItemProfile);

  // user active and inactive
  const userActive = useSelector(reportStore.selectActives);
  const userInActive = useSelector(reportStore.selectInactives);

  // upload avatar
  const imageAvatar = useSelector(imagesStore.selectImageAvatar);
  useEffect(() => {
    console.log("imageAvatar", imageAvatar);
    if (imageAvatar != null) {
      dispatch(
        dialogStore.setItemProfile({
          ...ItemProfile,
          avatar: imageAvatar,
        })
      );
    }
  }, [imageAvatar]);

  // Header data
  const header = [
    {
      title: "Total User Active",
      value: userActive,
    },
    {
      title: "Total User In-Active",
      value: userInActive,
    },
  ];

  // Handle profile changes (no local state, using ItemProfile directly)
  const handleChange =
    (field: keyof UserProfile) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        dialogStore.setItemProfile({
          ...ItemProfile,
          [field]: event.target.value,
        })
      );
    };

  const handleSave = () => {
    if (!ItemProfile) {
      dispatch(commonStore.actions.setErrorMessage("No profile data to save"));
      return;
    }
    dispatch(userStore.sagaEditUser(ItemProfile, ItemProfile?.createdBy?.uuid));
  };

  // images upload
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setUploadedFileName(file.name); // hook to display the file name
      const blobUrl = URL.createObjectURL(file);
      dispatch(imagesStore.uploadAvatarToCloud(blobUrl));
    }
  };

  return (
    <>
      {/* Table title */}
      <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
        User Table Detail
      </Typography>
      {/* Header */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {header.map((item, index) => (
          <Paper
            key={index}
            sx={{ p: 2, textAlign: "center", borderRadius: 2, minWidth: 200 }}
          >
            <Typography fontSize={20} fontWeight="bold" color="grey">
              {item.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 1,
                gap: 1,
              }}
            >
              <Typography fontSize={24} fontWeight="bold">
                {item.value}
              </Typography>
            </Box>
            <Typography fontSize={14} color="text.secondary" mt={1}>
              Updated to now
            </Typography>
          </Paper>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 3,
              width: "100%",
              maxHeight: "calc(100vh - 200px)",
              margin: "10px 0px",
            }}
          >
            {/* Filter Bar */}
            <FilterBar />
            <Divider sx={{ padding: 1 }} />
            {/* Table Component */}
            <UTableDetail />
          </Paper>
        </Box>
      </Box>

      {/* Dialog box */}
      <Dialog
        open={isSelectedItemProfile}
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            value={ItemProfile?.firstName || ""}
            onChange={handleChange("firstName")}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Middle Name"
            value={ItemProfile?.middleName || ""}
            onChange={handleChange("middleName")}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            value={ItemProfile?.lastName || ""}
            onChange={handleChange("lastName")}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Gender"
            value={ItemProfile?.gender || "MALE"}
            onChange={handleChange("gender")}
          >
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Date of Birth"
            type="date"
            value={ItemProfile?.dateOfBirth || "1990-01-01"}
            onChange={handleChange("dateOfBirth")}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Bio"
            value={ItemProfile?.bio || ""}
            onChange={handleChange("bio")}
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            value={ItemProfile?.phoneNumber || ""}
            onChange={handleChange("phoneNumber")}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 2,
            }}
          >
            <Typography>Upload Avatar</Typography>
            <Button
              variant="contained"
              component="label"
              color="primary"
              sx={{ textTransform: "none", maxWidth: 200 }}
            >
              Choose File
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {uploadedFileName && (
              <Typography sx={{ fontStyle: "italic" }}>
                {uploadedFileName}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dispatch(dialogStore.setSelectedItemProfile(false));
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default User;
