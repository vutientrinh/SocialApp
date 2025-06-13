import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AcccountInfo from "../../components/App/AccountInfo";
import ArrowBar from "../../components/App/ArrowBar";
import ListFollow from "../../components/App/Follow";
import AppFooter from "../../components/App/Footer";
import { HeaderNotification } from "../../components/App/Header/Header";
import Navbar from "../../components/App/Navbar/Navbar";
import News, { Post } from "../../components/App/News";
import NewPost from "../../components/App/News/NewPost";
import PostComments from "../../components/App/News/PostComment";
import PostContent from "../../components/App/News/PostContent";
import PostFooter from "../../components/App/News/PostFooter";
import PostHeader from "../../components/App/News/PostHeader";
import PostReaction from "../../components/App/News/PostReaction";
import {
  commonStore,
  dialogStore,
  imagesStore,
  postStore,
  profileStore,
} from "../../store/reducers";
import {
  fToConvertObjImgsToListStringURL,
  fToConvertStringToListString,
} from "../../utils/formatString";
import { useTranslation } from "react-i18next";
export const PostComponentStyle = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

export const NewPostStyles = styled(Box)({
  width: "55%",
  padding: "0px 20px",
  height: "100vh",
  overflowY: "auto",
  // overflow: "hidden",
});

const MainPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cookies = parseCookies();
  const token = cookies["accessToken"];
  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    }
  }, [token, navigate]);
  const dispatch = useDispatch();
  const currentUser = useSelector(profileStore.selectProfile);
  const displayDetailPost = useSelector(dialogStore.selectDisplayDetailPost);
  const displayCreatePost = useSelector(dialogStore.selectDisplayCreatePost);
  const selectImageUploadList = useSelector(imagesStore.selectImageUploadList);
  const selectedPost = useSelector(dialogStore.selectSelectedPost);
  const completeUpload = useSelector(imagesStore.selectCompleteUpload);
  const loadingCreateNewPost = useSelector(dialogStore.selectCreateNewPost);

  // Change state public or private
  const [mode, setMode] = useState("public");
  const handleChange = (event: SelectChangeEvent<string>) => {
    setMode(event.target.value);
  };

  const checkToxicLanguage = async (message: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_LLM}ToxicLanguage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        console.error(
          `Failed to check toxic language. Status: ${response.status}`
        );
        return false;
      }

      const { passValidate } = await response.json();
      return passValidate; // Directly return the value without extra variable creation
    } catch (error) {
      console.error("Error checking toxic language:", error);
      return false;
    }
  };
  // Message for new post
  const [message, setMessage] = useState("");
  const handleChangeMessage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessage(event.target.value);
  };

  // Image to upload and push to server
  const [images, setImages] = useState<string[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileURLs = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prevImages) => [...prevImages, ...fileURLs]);
    }
  };
  const handleImageClick = () => {
    document.getElementById("file-input")?.click();
  };
  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const handleCreateNewPost = async () => {
    const checker = await checkToxicLanguage(message);
    if (checker) {
      dispatch(imagesStore.actions.setImageList(images));
      dispatch(imagesStore.uploadImagesToCloud());
    } else {
      dispatch(
        commonStore.actions.setErrorMessage("Your status has toxic language")
      );
    }
  };

  useEffect(() => {
    dispatch(profileStore.getProfileByUser());
    dispatch(profileStore.cacheProfiles());
  }, []);

  useEffect(() => {
    if (completeUpload) {
      const newPost = {
        message,
        status: mode,
        imageURLs: selectImageUploadList,
        fileUUID: "",
      };
      dispatch(postStore.actions.setNewPost(newPost));
      dispatch(postStore.createNewPost());
    }
    // reload main page
    dispatch(dialogStore.setDisplayCreatePost(false));
  }, [completeUpload]);

  return (
    <>
      {token && (
        <>
          <HeaderNotification number={3} />
          <Box sx={{ padding: "0px 50px" }}>
            <Navbar />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <PostComponentStyle>
                <Box
                  sx={{
                    width: "20%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  <AcccountInfo />
                  <ArrowBar />
                  <AppFooter />
                </Box>

                {/* Post */}
                <NewPostStyles>
                  <NewPost />
                  <News />
                </NewPostStyles>

                {/* List box */}
                <Box
                  sx={{
                    width: "25%",
                    height: "100vh",
                    marginLeft: 2,
                    // minWidth: "200px",
                  }}
                >
                  <ListFollow />
                  {/* <ListActiveUsers /> */}
                </Box>
              </PostComponentStyle>
            </Box>
          </Box>

          {/* Dialog display current post */}
          <Dialog
            open={displayDetailPost}
            onClose={() => {
              dispatch(dialogStore.setDisplayDetailPost(false));
            }}
            sx={{
              "& .MuiDialog-paper": {
                width: "90%",
                maxWidth: "800px",
                paddingLeft: "5px",
              },
            }}
          >
            <Divider />
            <DialogContent sx={{ padding: "0px" }}>
              {selectedPost && (
                <Post>
                  <PostHeader
                    username={selectedPost.user?.username}
                    lastUpdateAt={selectedPost.createdDateAt}
                    uuid={selectedPost.user.uuid}
                    status={selectedPost.status}
                    postId={selectedPost.uuid}
                  />
                  <PostContent
                    messages={fToConvertStringToListString(
                      selectedPost.content.message
                    )}
                    images={fToConvertObjImgsToListStringURL(
                      selectedPost.content.imageURLs
                    )}
                  />
                  <PostReaction post={selectedPost} />
                  <PostFooter post={selectedPost} />
                  <PostComments
                    user={selectedPost?.user}
                    status={selectedPost?.status}
                    content={selectedPost?.content}
                    comments={selectedPost?.comments}
                    reactions={selectedPost?.reactions}
                    createdDateAt={selectedPost?.createdDateAt}
                    uuid={selectedPost?.uuid}
                  />
                </Post>
              )}
            </DialogContent>
          </Dialog>

          {/* Dialog for create new post */}
          <Dialog
            open={displayCreatePost}
            onClose={() => {
              dispatch(dialogStore.setDisplayCreatePost(false));
            }}
            sx={{
              "& .MuiDialog-paper": {
                width: "90%",
                maxWidth: "800px",
                paddingLeft: "5px",
              },
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", margin: "15px" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  paddingBottom: 2,
                }}
              >
                <IconButton sx={{ padding: 0 }}>
                  <Avatar src={currentUser.profileLogin?.avatar} alt="avatar" />
                </IconButton>

                <Typography variant="subtitle2">
                  {`${currentUser.profileLogin?.firstName} 
              ${currentUser.profileLogin?.middleName} 
              ${currentUser.profileLogin?.lastName}`}
                </Typography>

                <Select
                  value={mode}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    marginLeft: "auto",
                    minWidth: "80px",
                    border: "none",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  displayEmpty
                >
                  <MenuItem value="public">{t("post.public")}</MenuItem>
                  <MenuItem value="private">{t("post.private")}</MenuItem>
                </Select>
              </Box>

              {/* Input Base for message typing */}
              <InputBase
                placeholder={t("post.writePostContent")}
                fullWidth
                multiline
                sx={{
                  fontSize: "0.875rem",
                  minHeight: "200px",
                  border: "1px solid #e0e0e0",
                  padding: "12px 0 0 12px",
                  display: "flex",
                  alignItems: "flex-start",
                }}
                value={message}
                onChange={handleChangeMessage}
              />

              {/* Display List of Uploaded Images with Remove Icon */}
              <Box
                sx={{ display: "flex", flexWrap: "wrap", marginTop: 2, gap: 2 }}
              >
                {images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: "100px",
                      height: "100px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <img
                      src={image}
                      alt={`uploaded-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                      onClick={() => removeImage(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              {/* Button */}
              <Box
                sx={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "8px",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button>
                      <IconButton sx={{ padding: 0 }}>
                        <InsertEmoticonIcon color="action" />
                      </IconButton>
                      <Typography variant="caption" sx={{ paddingLeft: 1 }}>
                        Emojis
                      </Typography>
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button onClick={handleImageClick}>
                      <IconButton sx={{ padding: 0 }}>
                        <ImageIcon color="action" />
                      </IconButton>
                      <Typography variant="caption" sx={{ paddingLeft: 1 }}>
                        {t("mainPage.imageVideo")}
                      </Typography>
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </Box>
                </Box>
                <IconButton
                  color="primary"
                  onClick={() => {
                    dispatch(dialogStore.setCreateNewPost(true)); // set loading
                    handleCreateNewPost();
                  }}
                >
                  {loadingCreateNewPost ? <CircularProgress /> : <SendIcon />}
                </IconButton>
              </Box>
            </Box>
          </Dialog>
        </>
      )}
    </>
  );
};

export default MainPage;
