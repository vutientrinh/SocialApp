import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { imagesStore } from "../../store/reducers";

const Profile = () => {
  const [selectedImage, setSelectedImage] = useState<string>();
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();

  const dispatch = useDispatch();
  // const completeUpload = useSelector(imagesStore.selectImageUploadList);
  const imageAvatar = useSelector(imagesStore.selectImageAvatar);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const file = event.target.files ? event.target.files[0] : null;
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setSelectedImage((prevImages) => [
    //       ...(prevImages || []),
    //       reader.result as string,
    //     ]);
    //   };
    //   reader.readAsDataURL(file);
    // }
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      const blobUrl = URL.createObjectURL(file);
      dispatch(imagesStore.uploadAvatarToCloud(blobUrl));
    }
  };
  // useEffect(() => {
  //   if (selectedImage.length > 0) {
  //     dispatch(imagesStore.actions.setImageList(selectedImage));
  //     dispatch(imagesStore.uploadImagesToCloud());
  //   }
  // }, [selectedImage, dispatch]);
  useEffect(() => {
    console.log("Upload complete:", imageAvatar);
    setImageUrl(imageAvatar);
  }, [imageAvatar]);
  const onSubmit = async (data: any) => {
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const profileData = { ...data, avatar: imageAvatar };
    console.log(profileData);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/profile/create-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(profileData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Profile created successfully:", data);
        dispatch(imagesStore.actions.setImageList([]));
        navigate("/");
      } else {
        console.error("Error creating profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error making request:", error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "30%",
          height: "50%",
        }}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <img
            src="/static/image/loginimage.svg"
            style={{ height: "100%", width: "100%" }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: 3,
          p: 3,
        }}
      >
        <Box>
          <Typography variant="h4" mb={3} textAlign="center">
            Profile Information
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: "70%",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "First Name is required",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="middleName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Middle Name is required",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Middle Name"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Last Name is required",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="phoneNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Phone Number is required",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone Number must be a valid 10-digit number",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue="MALE"
                    render={({ field }) => (
                      <Select {...field} label="Gender" fullWidth>
                        <MenuItem value="MALE">Male</MenuItem>
                        <MenuItem value="FEMALE">Female</MenuItem>
                      </Select>
                    )}
                  />
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Date of Birth is required",
                      validate: {
                        validDate: (value) =>
                          new Date(value) <= new Date() ||
                          "Date of Birth must be in the past",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Date of Birth"
                        variant="outlined"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Box>
                <Controller
                  name="bio"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Bio"
                      multiline
                      rows={4}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                  )}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "30%",
                }}
              >
                <Box
                  sx={{
                    width: "200px",
                    height: "250px",
                    border: "2px solid #ccc",
                    borderRadius: "10%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={selectedImage}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload your avatar
                  <input type="file" hidden onChange={handleImageUpload} />
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ padding: 10, width: "20%" }}
                disabled={imageAvatar == null}
              >
                Save Profile
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
