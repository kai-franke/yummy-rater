import Head from "next/head";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <>
      <Head>
        <title>Yummy Rater</title>
        <meta
          name="description"
          content="The best app to rate your yummy products"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box component="main" m={3}>
        <Typography variant="h5" component="h2" gutterBottom>
          Home
        </Typography>
      </Box>
    </>
  );
}
