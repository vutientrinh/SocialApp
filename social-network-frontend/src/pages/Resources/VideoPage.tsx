import { Box, IconButton } from "@mui/material";
import Scrollbar from "../../components/App/Common/Scrollbar/Scrollbar";
import EditIcon from "@mui/icons-material/Edit";

const VideoPage = () => {
  const images = [
    { id: 1, src: "/static/avatars/avatar_1.jpg", alt: "Image 1" },
    { id: 2, src: "/static/avatars/avatar_2.jpg", alt: "Image 2" },
    { id: 3, src: "/static/avatars/avatar_3.jpg", alt: "Image 3" },
    { id: 4, src: "/static/avatars/avatar_4.jpg", alt: "Image 4" },
    { id: 5, src: "/static/avatars/avatar_5.jpg", alt: "Image 5" },
    { id: 6, src: "/static/avatars/avatar_6.jpg", alt: "Image 6" },
    { id: 7, src: "/static/avatars/avatar_7.jpg", alt: "Image 7" },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          marginTop: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {images.map((image) => (
            <Box
              key={image.id}
              sx={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                overflow: "hidden",
                width: "150px",
                maxWidth: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
              />
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
              >
                <EditIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
export default VideoPage;
