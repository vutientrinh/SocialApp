import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { HeaderDashboard } from "../../components/App/Header/Header";
import Navbar from "../../components/App/Navbar/Navbar";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Scrollbar from "../../components/App/Common/Scrollbar/Scrollbar";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dialogStore, folderStore, postStore } from "../../store/reducers";
import { fGetTheFirstLetterOfString } from "../../utils/formatString";
import { Post } from "../../components/App/News";
import PostHeader from "../../components/App/News/PostHeader";
import PostContent from "../../components/App/News/PostContent";
import PostReaction from "../../components/App/News/PostReaction";
import PostFooter from "../../components/App/News/PostFooter";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  fToConvertObjImgsToListStringURL,
  fToConvertStringToListString,
} from "../../utils/formatString";
import { useTranslation } from "react-i18next";

const SaveItemPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getAllFolders = useSelector(folderStore.selectFolders);
  const getSelectedFolder = useSelector(folderStore.getIsSelectedFolder);
  const displayDetailPost = useSelector(dialogStore.selectDisplayDetailPost);
  const selectedPost = useSelector(dialogStore.selectSelectedPost);
  const postsSelector = useMemo(
    () => folderStore.getPostFromFolder(getSelectedFolder?.uuid || null),
    [getSelectedFolder]
  );
  const items = useSelector(postsSelector);

  // dialog to create new folder
  const displayCreateNewFolder = useSelector(
    dialogStore.selectDisplayCreateFolder
  );
  const [folderName, setFolderName] = useState("");
  const handleCreate = () => {
    if (folderName.trim()) {
      dispatch(folderStore.sagaCreateNewFolder(folderName.trim()));
      setFolderName("");
      dispatch(dialogStore.setDisplayCreateFolder(false));
    }
  };
  useEffect(() => {
    dispatch(folderStore.sagaGetFolders());
  }, [dispatch]); // getAllFolders

  // display dialog to add post to folder
  const displayAddPostToFolder = useSelector(
    dialogStore.selectDisplayAddPostToFolder
  );

  // redirect to previous page
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <HeaderDashboard />
      <Box sx={{ padding: "0px 50px" }}>
        <Navbar />
        <Box sx={{ display: "flex", gap: 2, maxH: "500px" }}>
          <Box sx={{ width: "25%", padding: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton onClick={handleBack}>
                <KeyboardReturnIcon />
              </IconButton>
              <Typography variant="subtitle1">
                {t("savedItems.savedItems")}
              </Typography>
            </Box>
            {/* Item  */}
            <Box
              sx={{
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  textTransform: "none",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  margin: "5px 0px",
                }}
                onClick={() =>
                  dispatch(dialogStore.setDisplayCreateFolder(true))
                }
              >
                + {t("savedItems.addNewFolder")}
              </Button>
              <Divider sx={{ mb: 1 }} />
              <Scrollbar sx={{ maxHeight: "540px" }}>
                <Box>
                  {getAllFolders.map((request: any) => (
                    <ButtonBase
                      key={request.uuid}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: "12px",
                        paddingBottom: "10px",
                      }}
                      onClick={() => {
                        dispatch(
                          folderStore.actions.setSelectedFolder(request)
                        );
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={
                            "https://avatar-letter.fun/api/file/set1/full/" +
                            fGetTheFirstLetterOfString(request.name) +
                            "/png"
                          }
                          sx={{
                            marginRight: "10px",
                            borderRadius: "10px",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            maxWidth: "80%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Typography variant="subtitle2" color="black">
                            {request.name}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(folderStore.sagaDeleteFolder(request.name));
                        }}
                        sx={{ color: "red" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ButtonBase>
                  ))}
                </Box>
              </Scrollbar>
            </Box>
          </Box>

          {/* Show list post */}
          <Box
            sx={{
              width: "75%",
              padding: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" fontSize={18}>
                {t("savedItems.all")}
              </Typography>
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Box>

            <Scrollbar sx={{ maxHeight: "630px" }}>
              <Box>
                {items.length > 0 ? (
                  items.map((request: any) => (
                    <Box
                      key={request.uuid}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                        width: "100%",
                      }}
                    >
                      <Avatar
                        src={
                          request?.content?.imageURLs &&
                          request.content.imageURLs.length > 0
                            ? request.content.imageURLs[0].url
                            : "https://avatar-letter.fun/api/file/set1/full/z/png"
                        }
                        sx={{
                          width: "120px",
                          height: "120px",
                          marginRight: "10px",
                          borderRadius: "10px",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "88%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            maxWidth: "80%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="black"
                            fontSize={18}
                            sx={{
                              cursor: "pointer",
                              userSelect: "none",
                              "&:hover": {
                                color: "blue",
                              },
                            }}
                            onClick={() => {
                              dispatch(dialogStore.setDisplayDetailPost(true));
                              dispatch(dialogStore.setSelectedPost(request));
                            }}
                          >
                            {request?.content.message}
                          </Typography>
                          <Typography variant="subtitle2" color="grey">
                            Đã lưu từ bài viết của {request?.user.username}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "8px",
                          }}
                        >
                          <Button
                            onClick={() => {
                              dispatch(
                                dialogStore.setDisplayAddPostToFolder(true)
                              ); // set dialog to add post to folder
                              dispatch(dialogStore.setSelectedPost(request)); // set selected post
                            }}
                          >
                            Thêm vào bộ sưu tập
                          </Button>
                          <IconButton
                            onClick={() => {
                              dispatch(
                                folderStore.sagaRemovePostToFolder(
                                  getSelectedFolder?.name,
                                  request.uuid
                                )
                              );
                              dispatch(
                                folderStore.actions.setStatusUnsavedPost(
                                  request.uuid
                                )
                              );
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="h6"
                    color="grey"
                    textAlign="center"
                    sx={{ marginTop: "20px" }}
                  >
                    {t("savedItems.noSavedItems")}
                  </Typography>
                )}
              </Box>
            </Scrollbar>
          </Box>
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
              {/* <PostComments
                user={selectedPost.user}
                status={selectedPost.status}
                content={selectedPost.content}
                comments={selectedPost.comments}
                reactions={selectedPost.reactions}
                createdDateAt={selectedPost.createdDateAt}
                uuid={selectedPost.uuid}
              /> */}
            </Post>
          )}
        </DialogContent>
      </Dialog>

      {/* Display dialog create new folder */}
      <Dialog open={displayCreateNewFolder} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => dispatch(dialogStore.setDisplayCreateFolder(false))}
            sx={{
              color: "black",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            sx={{
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: "primary.main",
            }}
            disabled={!folderName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to choice folder that add post to */}
      <Dialog open={displayAddPostToFolder} maxWidth="sm" fullWidth>
        <DialogTitle>
          Thêm vào bộ sưu tập
          <IconButton
            aria-label="close"
            onClick={() => {
              dispatch(dialogStore.setDisplayAddPostToFolder(false));
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {getAllFolders.map((folder) => (
              <ButtonBase
                key={folder.uuid}
                onClick={() => {
                  dispatch(
                    folderStore.sagaAddPostToFolder(
                      folder.name,
                      selectedPost.uuid
                    )
                  );
                  dispatch(dialogStore.setDisplayAddPostToFolder(false)); // close dialog
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "10px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    backgroundColor: "#f1f1f1",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={`https://avatar-letter.fun/api/file/set1/full/${folder.name[0]}/png`}
                    sx={{
                      marginRight: "10px",
                      borderRadius: "10px",
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      maxWidth: "200px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      fontWeight: 500,
                    }}
                  >
                    {folder.name}
                  </Typography>
                </Box>
              </ButtonBase>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            onClick={() =>
              dispatch(dialogStore.setDisplayAddPostToFolder(false))
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default SaveItemPage;
