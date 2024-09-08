import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Scanner from "@/components/Scanner";

export default function Scan() {
  const [data, setData] = useState("Not Found");

  const handleScan = (scannedData: string) => {
    setData(scannedData);
  };

  return (
    <Box m={3} component="main">
      <Typography variant="h5" component="h2">
        Scan
      </Typography>
      <Scanner onScan={handleScan} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Scanned Data: {data}
      </Typography>
    </Box>
  );
}
