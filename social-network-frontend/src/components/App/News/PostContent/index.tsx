import { Link, Typography } from "@mui/material";
import { useState } from "react";
import SlideShow from "./SlideShow";
import { PostContentStyles } from "./styles";

interface PostContentProps {
  messages: string[];
  images: string[];
}

const PostContent: React.FC<PostContentProps> = ({ messages, images }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleShowMore = () => {
    setIsExpanded(true);
  };
  const handleShowLess = () => {
    setIsExpanded(false);
  };
  return (
    <PostContentStyles>
      {messages.length > 0 && !isExpanded ? (
        <Typography sx={{ fontSize: "15px", marginBottom: 1 }}>
          {messages[0].length > 100 && !isExpanded
            ? `${messages[0].slice(0, 100)}...`
            : messages[0]}
        </Typography>
      ) : (
        messages.map((message, index) => (
          <Typography key={index} sx={{ fontSize: "15px", marginBottom: 1 }}>
            {message}
          </Typography>
        ))
      )}
      {!isExpanded && messages[0].length > 100 && (
        <Link
          component="button"
          onClick={handleShowMore}
          sx={{ color: "primary.main", textDecoration: "underline" }}
        >
          Show More
        </Link>
      )}
      {isExpanded && messages[0].length > 100 && (
        <Link
          component="button"
          onClick={handleShowLess}
          sx={{ color: "primary.main", textDecoration: "underline" }}
        >
          Show less
        </Link>
      )}
      {images.length > 0 && <SlideShow images={images} />}
    </PostContentStyles>
  );
};
export default PostContent;
