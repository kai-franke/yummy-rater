import { Box } from "@mui/material";

export default function ProductCardContainer({ children }: { children: React.ReactNode }) {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    );
  }