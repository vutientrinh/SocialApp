import { Box, Dialog, DialogContent, Divider } from "@mui/material";
import styled from "@mui/material/styles/styled";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HeaderDashboard } from "../../components/App/Header/Header";
import Navbar from "../../components/App/Navbar/Navbar";
import News, { Post } from "../../components/App/News";
import PostComments from "../../components/App/News/PostComment";
import PostContent from "../../components/App/News/PostContent";
import PostFooter from "../../components/App/News/PostFooter";
import PostHeader from "../../components/App/News/PostHeader";
import PostReaction from "../../components/App/News/PostReaction";
import FeedBar from "../../components/Feeds/FeedBar";
import { dialogStore, postStore } from "../../store/reducers";
import {
  fToConvertObjImgsToListStringURL,
  fToConvertStringToListString,
} from "../../utils/formatString";

export const NewPostStyles = styled(Box)({
  width: "55%",
  padding: "0px 20px",
});

const FeedTable = () => {
  const dispatch = useDispatch();
  const displayDetailPost = useSelector(dialogStore.selectDisplayDetailPost);
  const selectedPost = useSelector(dialogStore.selectSelectedPost);

  // if selected post is changed, get new post
  useEffect(() => {
    dispatch(postStore.sagaGetPosts());
  }, [selectedPost]);

  return (
    <>
      <HeaderDashboard />
      <Box sx={{ padding: "0px 50px" }}>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            marginTop: "20px",
          }}
        >
          <FeedBar />
          <NewPostStyles>
            <News />
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
    </>
  );
};
export default FeedTable;
