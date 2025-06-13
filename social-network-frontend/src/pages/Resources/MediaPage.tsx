import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dialogStore, imagesStore, profileStore } from "../../store/reducers";
import { fGetIdFromURLCloudinary } from "../../utils/formatString";
import { useTranslation } from "react-i18next";

const MediaPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  // Get all images of current user selected
  const images = useSelector(imagesStore.selectImageStore) || [];
  const isSelectedProfile = useSelector(dialogStore.selectIsSelectedProfile);
  const profile = useSelector(
    isSelectedProfile
      ? profileStore.selectProfileLogin
      : dialogStore.selectSelectedProfile
  );

  // fetching images of current user
  useEffect(() => {
    dispatch(imagesStore.fetchImageByUser(profile));
  }, [dispatch, profile]);

  const handleEditClick = (uuid: string) => {
    setActiveImageId((prevId) => (prevId === uuid ? null : uuid));
  };

  const handleRemove = (uuid: string) => {
    dispatch(imagesStore.removeFromCloud(uuid, profile));
  };

  const handleDownloadFromCloudinary = async (
    imageId: string,
    imageName: string
  ) => {
    try {
      const imageUrl = `${process.env.REACT_APP_CLOUDINARY_URL}${imageId}`;
      const response = await fetch(imageUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const blob = await response.blob();

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${imageName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        marginTop: "20px",
      }}
    >
      {images.map((image) => (
        <Box
          key={image.uuid}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
            width: "150px",
            maxWidth: "300px",
            height: "130px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <img
            src={image.url}
            alt={image.name}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
          {/* Edit button */}
          <IconButton
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              zIndex: 1,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
            onClick={() => handleEditClick(image.uuid)}
          >
            <EditIcon />
          </IconButton>
          {activeImageId === image.uuid && (
            <>
              {/* Remove button */}
              {/* <IconButton
                sx={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  zIndex: 1,
                  color: "white",
                  backgroundColor: "rgba(255, 0, 0, 0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 0, 0, 0.7)",
                  },
                }}
                onClick={() => handleRemove(image.uuid)}
              >
                <DeleteIcon />
              </IconButton> */}

              {/* View button */}
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  zIndex: 1,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 255, 0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 255, 0.7)",
                  },
                }}
                href={image.url}
                target="_blank"
              >
                <RemoveRedEyeIcon />
              </IconButton>

              {/* Download button */}
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: "8px",
                  left: "55px",
                  zIndex: 1,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 255, 0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 255, 0.7)",
                  },
                }}
                onClick={() =>
                  handleDownloadFromCloudinary(
                    fGetIdFromURLCloudinary(image.url),
                    image.name
                  )
                }
              >
                <DownloadIcon />
              </IconButton>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default MediaPage;
