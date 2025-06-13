import { useDispatch, useSelector } from "react-redux";
import { HeaderDashboard } from "../../../components/App/Header/Header";
import { Box, Button, Dialog, DialogContent, Divider } from "@mui/material";
import Navbar from "../../../components/App/Navbar/Navbar";
import FeedBar from "../../../components/Feeds/FeedBar";
import styled from "styled-components";
import { dialogStore, postStore } from "../../../store/reducers";
import { useEffect, useState } from "react";
import { Post } from "../../../components/App/News";
import PostHeader from "../../../components/App/News/PostHeader";
import PostContent from "../../../components/App/News/PostContent";
import PostReaction from "../../../components/App/News/PostReaction";
import PostFooter from "../../../components/App/News/PostFooter";
import PostComments from "../../../components/App/News/PostComment";
import {
  fToConvertStringToListString,
  fToConvertObjImgsToListStringURL,
} from "../../../utils/formatString";

export const NewPostStyles = styled(Box)({
  width: "55%",
  padding: "0px 20px",
});
const FollowFeed: React.FC = () => {
  const dispatch = useDispatch();
  const listFollowPost = useSelector(postStore.selectFollowPosts);
  const displayDetailPost = useSelector(dialogStore.selectDisplayDetailPost);
  const selectedPost = useSelector(dialogStore.selectSelectedPost);

  // pagination
  const [page, setPage] = useState(1);
  const size = 10;

  useEffect(() => {
    dispatch(postStore.TSagaGetFollowPosts(page, size));
  }, [dispatch]);

  //loading
  const [loading, setLoading] = useState(false);

  const loadMorePosts = async () => {
    setLoading(true);
    await dispatch(postStore.TSagaGetFollowPosts(page + 1, size));
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

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
            {listFollowPost.map((post) => (
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
                  postId={post.uuid}
                />
                <PostContent
                  messages={fToConvertStringToListString(post.content.message)}
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
                )}{" "}
              </Post>
            ))}
            <Button
              onClick={loadMorePosts}
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ margin: "10px 0px" }}
              fullWidth
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          </NewPostStyles>
        </Box>
      </Box>

      {/* dialog */}
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
export default FollowFeed;
