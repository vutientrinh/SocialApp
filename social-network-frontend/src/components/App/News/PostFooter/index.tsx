import { Box, Divider, Typography } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import {
  PostFooterStyled,
  PostContentStyled,
  StyledIconButton,
} from "./styles";
import ReactionStyle from "./ReactionStyle";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dialogStore,
  folderStore,
  reactionStore,
} from "../../../../store/reducers";
import { parseCookies } from "nookies";
import socketService from "../../../../helper/SocketService";
import { useTranslation } from "react-i18next";

const PostFooter: React.FC<any> = ({ post }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReactionIndex, setSelectedReactionIndex] = useState<number>(6);
  const reactionType =
    useSelector(
      (state: any) => state.reaction.posts[post.uuid]?.reactionType
    ) || "DEFAULT";
  const isReact = post.isReact === "true";

  // call that post is saved to folder
  const isSaved = useSelector(folderStore.getStatusSavedPost(post.uuid));

  // Reaction icons and colors
  const reactions = useMemo(
    () => [
      { src: "/static/icons/post/like.png", alt: "Like", color: "#4267B2" },
      { src: "/static/icons/post/love.png", alt: "Love", color: "#fc4985" },
      { src: "/static/icons/post/haha.png", alt: "Haha", color: "#fcba04" },
      { src: "/static/icons/post/sad.png", alt: "Sad", color: "#fcba04" },
      { src: "/static/icons/post/wow.png", alt: "Wow", color: "#fcba04" },
      { src: "/static/icons/post/angry.png", alt: "Angry", color: "#e54b4b" },
      { src: "/static/icons/post/default.png", alt: "Default", color: "grey" },
    ],
    []
  );

  const defaultReactionIndex = reactions.findIndex(
    (reaction) => reaction.alt.toUpperCase() === reactionType.toUpperCase()
  );

  // Ensure Default is selected if no reaction is set
  useEffect(() => {
    if (reactionType === "DEFAULT") {
      setSelectedReactionIndex(6);
    } else {
      setSelectedReactionIndex(defaultReactionIndex);
    }
  }, [reactionType, defaultReactionIndex, isReact]);

  const callAPINewReaction = async (postId: string, reactionType: string) => {
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const requestCreate = {
      postUUID: postId,
      reactionType: reactionType.toUpperCase(),
    };

    const requestRemove = {
      postUUID: postId,
      reactionType: reactionType.toUpperCase(),
    };
    const url = `${process.env.REACT_APP_BACKEND_URL}api/reaction`;
    const urlRemove = `${process.env.REACT_APP_BACKEND_URL}api/reaction/remove`;

    try {
      let response;
      if (reactionType.toUpperCase() === "DEFAULT") {
        response = await fetch(urlRemove, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestRemove),
        });
      } else {
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestCreate),
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // update reaction count
    } catch (error) {
      console.error("Error processing reaction:", error);
    }
  };

  useEffect(() => {
    if (selectedReactionIndex !== 6) {
      const selectedReaction = {
        postId: post.uuid,
        reactionType: reactions[selectedReactionIndex].alt.toUpperCase(),
      };

      dispatch(reactionStore.actions.setSelectedReaction(selectedReaction));
      callAPINewReaction(post.uuid, reactions[selectedReactionIndex].alt);
    }
  }, [selectedReactionIndex, dispatch, post.uuid, reactions]);

  const handleReactionSelect = (index: number) => {
    setSelectedReactionIndex(index);
    setShowReactions(false);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setShowReactions(false);
    }, 800);
  };

  return (
    <PostFooterStyled>
      <Divider sx={{ margin: "1px 20px" }} />
      <PostContentStyled>
        <Box
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={handleMouseLeave}
          sx={{ position: "relative" }}
        >
          <ReactionStyle index={selectedReactionIndex} />
          {showReactions && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "transparent",
                borderRadius: "4px",
                zIndex: 200,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                {reactions.map((reaction, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      handleReactionSelect(index);
                      // send private
                      const cookies = parseCookies();
                      const username = cookies["username"];
                      const id = post.user.uuid;
                      const notification = {
                        title: "Reaction",
                        message: "received a new interaction from " + username,
                        imagesUrl: "",
                        type: "FRIEND_INTERACTIVE",
                        createdAt: new Date().toISOString(),
                        unread: true,
                      };
                      socketService.sendPrivate(
                        id,
                        "/app/private",
                        notification
                      );
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "2px",
                      cursor: "pointer",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <img
                      src={reaction.src}
                      alt={reaction.alt}
                      style={{ width: "30px", height: "30px" }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
        <StyledIconButton
          onClick={() => {
            dispatch(dialogStore.setDisplayDetailPost(true));
            dispatch(dialogStore.setSelectedPost(post));
          }}
        >
          <MessageIcon sx={{ marginRight: "5px" }} />
          <Typography>{t("post.comment")}</Typography>
        </StyledIconButton>
        <StyledIconButton
          onClick={() => {
            if (!isSaved) {
              // call API to save post
              dispatch(folderStore.sagaAddPostToFolder("Default", post.uuid));
              dispatch(folderStore.actions.setStatusSavedPost(post.uuid));
            } else {
              dispatch(folderStore.actions.setStatusUnsavedPost(post.uuid));
            }
          }}
        >
          <BookmarkAddedIcon
            sx={{ marginRight: "5px", color: isSaved ? "blue" : "" }}
          />
          <Typography color={isSaved ? "blue" : ""}>
            {t("post.savePost")}
          </Typography>
        </StyledIconButton>
      </PostContentStyled>
    </PostFooterStyled>
  );
};

export default PostFooter;
