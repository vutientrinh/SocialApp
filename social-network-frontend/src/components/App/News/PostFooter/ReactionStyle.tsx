import React from "react";
import { Typography } from "@mui/material";
import { StyledIconButton } from "./styles";

interface ReactionStyleProps {
  index: number;
}

const ReactionStyle: React.FC<ReactionStyleProps> = ({ index }) => {
  const reactions = [
    { src: "/static/icons/post/like.png", alt: "Like", color: "#4267B2" },
    { src: "/static/icons/post/love.png", alt: "Love", color: "#fc4985" },
    { src: "/static/icons/post/haha.png", alt: "Haha", color: "#fcba04" },
    { src: "/static/icons/post/sad.png", alt: "Sad", color: "#fcba04" },
    { src: "/static/icons/post/wow.png", alt: "Wow", color: "#fcba04" },
    { src: "/static/icons/post/angry.png", alt: "Angry", color: "#e54b4b" },
    { src: "/static/icons/post/default.png", alt: "Default", color: "grey" },
  ];

  if (index < 0 || index >= reactions.length) {
    return null;
  }

  return (
    <StyledIconButton>
      <img
        src={reactions[index].src}
        alt={reactions[index].alt}
        style={{
          width: "24px",
          height: "24px",
          objectFit: "contain",
          marginRight: "5px",
        }}
      />
      <Typography sx={{ color: reactions[index].color }}>
        {reactions[index].alt}
      </Typography>
    </StyledIconButton>
  );
};

export default ReactionStyle;
