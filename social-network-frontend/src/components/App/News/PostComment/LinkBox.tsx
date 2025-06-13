import { Box, Typography } from "@mui/material";

interface LinkBoxProps {
  url: string;
  label?: string;
}

const LinkBox: React.FC<LinkBoxProps> = ({ url, label }) => {
  return (
    <Box
      sx={{
        marginTop: "16px",
        padding: "12px 16px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography variant="body2" sx={{ flex: 1 }}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#1976d2",
            textDecoration: "none",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#115293")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#1976d2")}
        >
          {label || url}
        </a>
      </Typography>
      <Box
        component="span"
        sx={{
          ml: 1,
          fontSize: "1.2rem",
          color: "text.secondary",
        }}
      >
        🔗
      </Box>
    </Box>
  );
};

export default LinkBox;
