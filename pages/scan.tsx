import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Scanner from "@/components/Scanner";

export default function Scan() {
  const [data, setData] = useState("Not Found");

  const handleScan = (scannedData: string) => {
    setData(scannedData);
  };

  return (
    <main>
      <Box m={3} component="section">
        <Typography variant="h5" component="h2">
          Scan
        </Typography>
      </Box>
      <Scanner onScan={handleScan} />

      <Typography variant="body1" sx={{ mt: 2 }}>
        Scanned Data: {data}
      </Typography>
    </main>
  );
}
