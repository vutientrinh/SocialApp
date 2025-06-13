import styled from "@emotion/styled";
import { Box, Dialog, DialogContent, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../../components/App/News";
import PostComments from "../../../components/App/News/PostComment";
import PostContent from "../../../components/App/News/PostContent";
import PostFooter from "../../../components/App/News/PostFooter";
import PostHeader from "../../../components/App/News/PostHeader";
import PostReaction from "../../../components/App/News/PostReaction";
import { dialogStore, profileStore } from "../../../store/reducers";
import {
  fToConvertObjImgsToListStringURL,
  fToConvertStringToListString,
} from "../../../utils/formatString";
import { useTranslation } from "react-i18next";

export const NewPostStyles = styled(Box)({
  width: "100%",
  padding: "0px 20px",
});

// profile post
const ProfilePost = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const displayDetailPost = useSelector(dialogStore.selectDisplayDetailPost);
  const selectedPost = useSelector(dialogStore.selectSelectedPost);
  const profilePosts = useSelector(dialogStore.selectProfilePost);

  useEffect(() => {
    dispatch(profileStore.getProfileByUser());
    dispatch(profileStore.cacheProfiles());
    dispatch(dialogStore.actionToSetProfilePost()); // call to get posts data for profile
  }, []);

  return (
    <Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          {/* Post */}
          <NewPostStyles>
            {/* <News /> */}
            {profilePosts.length === 0 ? (
              <Typography
                variant="body1"
                sx={{ textAlign: "center", marginTop: "20px" }}
              >
                {t("profile.noPost")}
              </Typography>
            ) : (
              profilePosts.map((post: any) => (
                <Post
                  key={post.uuid}
                  sx={{ padding: "5px", border: "1px solid #e0e0e0" }}
                >
                  {/* header for owner user */}
                  <PostHeader
                    username={post.user?.username}
                    lastUpdateAt={post.createdDateAt}
                    uuid={post.user.uuid}
                    status={post.status}
                    postId={profilePosts.uuid}
                  />
                  <PostContent
                    messages={fToConvertStringToListString(
                      post.content.message
                    )}
                    images={fToConvertObjImgsToListStringURL(
                      post.content.imageURLs
                    )}
                  />
                  <PostReaction post={post} />
                  <PostFooter post={post} />
                  {displayDetailPost && (
                    <PostComments
                      user={post.user}
                      status={post.status}
                      content={post.content}
                      comments={post.comments}
                      reactions={post.reactions}
                      createdDateAt={post.createdDateAt}
                      uuid={post.uuid}
                    />
                  )}
                </Post>
              ))
            )}
          </NewPostStyles>
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
                  user={selectedPost.user}
                  status={selectedPost.status}
                  content={selectedPost.content}
                  comments={selectedPost.comments}
                  reactions={selectedPost.reactions}
                  createdDateAt={selectedPost.createdDateAt}
                  uuid={selectedPost.uuid}
                />
              </Post>
            )}
          </DialogContent>
        </Dialog>
      </Dialog>
    </Box>
  );
};
export default ProfilePost;
