import { Box } from "@mui/material";
import Image from "next/image";

export default function Splashscreen() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        background: "linear-gradient(to top, #1e3c72, #2a5298)",
      }}
    >
      <Image src="/yummy_rater_logo_splash.png" alt="Logo" width={209} height={250} />
    </Box>
  );
}
