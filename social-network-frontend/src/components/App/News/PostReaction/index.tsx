import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { dialogStore, reactionStore } from "../../../../store/reducers";
import {
  InfoComponent,
  PostReactionStyled,
  ReactionComponent,
  StyledIconButton,
} from "./styles";
import { useTranslation } from "react-i18next";

// Styled components
export const StyleLinkReaction = styled(Link)({
  textDecoration: "none",
  marginLeft: "120px",
  color: "#000",
  "&:hover": {
    textDecoration: "underline",
  },
});

export const StyleLink = styled(Box)({
  textDecoration: "none",
  color: "#000",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
});

const PostReaction: React.FC<{ post: any }> = ({ post }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Reaction icons
  const reactions = [
    { src: "/static/icons/post/like.png", alt: "Like" },
    { src: "/static/icons/post/love.png", alt: "Love" },
    { src: "/static/icons/post/haha.png", alt: "Haha" },
    { src: "/static/icons/post/sad.png", alt: "Sad" },
    { src: "/static/icons/post/wow.png", alt: "Wow" },
    { src: "/static/icons/post/angry.png", alt: "Angry" },
  ];

  useEffect(() => {
    dispatch(reactionStore.actions.setCurrentReaction([post]));
  }, [dispatch, post]);

  //call reaction count
  useEffect(() => {
    dispatch(reactionStore.getReactionCount());
  }, []);

  const reactionsCount = useSelector(
    (state: any) => state.reaction.posts[post.uuid]?.reactionCount
  );

  const totalCountReaction =
    (reactionsCount?.countAngry || 0) +
    (reactionsCount?.countWow || 0) +
    (reactionsCount?.countSad || 0) +
    (reactionsCount?.countLike || 0) +
    (reactionsCount?.countHaha || 0) +
    (reactionsCount?.countLove || 0);

  return (
    <PostReactionStyled>
      <ReactionComponent>
        {reactions.map((reaction, index) => (
          <StyledIconButton key={index} index={index}>
            <img src={reaction.src} alt={reaction.alt} />
          </StyledIconButton>
        ))}
        <StyleLinkReaction to="/open-model">
          {`${totalCountReaction}`} {t("post.interact")}
        </StyleLinkReaction>
      </ReactionComponent>
      <InfoComponent>
        <StyleLink
          onClick={() => {
            dispatch(dialogStore.setDisplayDetailPost(true));
            dispatch(dialogStore.setSelectedPost(post));
          }}
        >
          {`${post.comments.length} `} {t("post.comment")}
        </StyleLink>
      </InfoComponent>
    </PostReactionStyled>
  );
};

export default PostReaction;
