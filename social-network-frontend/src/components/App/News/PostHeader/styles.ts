import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PostHeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  background-color: transparent;
`;

export const PostAuthorInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PostMetadata = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606770;
`;

export const ActionButtons = styled(Box)`
  display: flex;
  align-items: center;
  padding-right: 10px;
  gap: 5px;
`;
