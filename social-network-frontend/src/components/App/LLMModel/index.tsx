import { Box } from "@mui/material";
import Markdown from "react-markdown";

const PopupLLMModel: React.FC<any> = (message: any) => {
  console.log(message);
  return (
    <>
      <Box>
        <Markdown>{message}</Markdown>
      </Box>
    </>
  );
};
export default PopupLLMModel;
