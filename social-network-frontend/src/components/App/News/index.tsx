import { Reddit } from "@mui/icons-material";
import { Box, Button, CircularProgress, SxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { dialogStore, postStore } from "../../../store/reducers";
import {
  fToConvertObjImgsToListStringURL,
  fToConvertStringToListString,
} from "../../../utils/formatString";
import PostComments from "./PostComment";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import PostReaction from "./PostReaction";

export const Post = styled(Box)`
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 10px;
`;

const PopupBox = styled(Box)<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: ${({ isOpen }) => (isOpen ? "85%" : "100%")};
  transform: translate(-50%, -50%);
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: opacity 0.4s ease-in-out, left 0.4s ease-in-out, visibility 0.4s;
  border-radius: 12px;
  width: 25%;
  height: 50%;
  background-color: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: auto;
  perspective: 1000px;
  transform-style: preserve-3d;
  scale: ${({ isOpen }) => (isOpen ? 1 : 0.95)};
`;
export default function News({ sx }: { sx?: SxProps }) {
  const dispatch = useDispatch();
  const listPost = useSelector(postStore.selectPosts);
  const displayDetailPost = useSelector(dialogStore.selectDisplayDetailPost);

  // pagination
  const [page, setPage] = useState(1);
  const size = 3;
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(postStore.TSagaGetPosts(page, size));
  }, [dispatch]);

  //loading
  const [loading, setLoading] = useState(false);
  const [summeryModel, setSummeryModel] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const loadMorePosts = async () => {
    setLoading(true);
    await dispatch(postStore.TSagaGetPosts(page + 1, size));
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };
  const summaryLLM = async (message: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_LLM}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const { result } = await response.json();
      return result; // Directly return the value without extra variable creation
    } catch (error) {
      console.error("Error checking toxic language:", error);
      return null;
    }
  };
  const handleOpenPopup = async (message: string) => {
    setSummeryModel(true);
    const summaryResult = await summaryLLM(message);
    setSelectedMessage(summaryResult);
  };

  const handleClosePopup = () => {
    setSummeryModel(false);
    setSelectedMessage(null); // Clear the selected message
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        handleClosePopup();
      }
    };

    if (summeryModel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [summeryModel]);
  return (
    <>
      {listPost.map((post) => (
        <Post
          key={post.uuid}
          sx={{ padding: "5px", border: "1px solid #e0e0e0", ...sx }}
        >
          {/* header for owner user */}
          <PostHeader
            username={post.user?.username}
            lastUpdateAt={post.createdDateAt}
            status={post.status}
            uuid={post.user.uuid}
            postId={post.uuid}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => {
                if (summeryModel) {
                  handleClosePopup();
                } else {
                  handleOpenPopup(post.content.message);
                }
              }}
              variant="contained"
              size="medium"
              startIcon={<Reddit />}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                textTransform: "capitalize",
                px: 2,
                py: 1,
                borderRadius: 2,
                boxShadow: 3,
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "scale(1.05)",
                },
              }}
            >
              Summary
            </Button>
          </Box>
          <PostContent
            messages={fToConvertStringToListString(post.content.message)}
            images={fToConvertObjImgsToListStringURL(post.content.imageURLs)}
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
        {loading ? <CircularProgress /> : "Load More"}
      </Button>

      <PopupBox isOpen={summeryModel} onClick={handleClosePopup} ref={popupRef}>
        <Box
          sx={{
            p: 3,
            width: "100%",
            maxWidth: 500,
            bgcolor: "background.paper", // Use theme background for better integration
            borderRadius: 2, // Rounded corners for a polished look
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2, // Margin below the icon
            }}
          >
            <Reddit fontSize="large" color="primary" />
          </Box>
          {!selectedMessage ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 150, // Ensure consistent height during loading
              }}
            >
              <CircularProgress
                sx={{
                  color: "primary.main", // Primary theme color for loader
                  animation: "spin 2s linear infinite", // Smooth spinning animation
                }}
              />
            </Box>
          ) : (
            <Box sx={{}}>
              <Markdown>{selectedMessage}</Markdown>
            </Box>
          )}
        </Box>
      </PopupBox>
    </>
  );
}
