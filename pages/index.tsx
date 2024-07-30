import Head from "next/head";
import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button } from "@mui/material";

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
      <main>
        <Test>Hallo</Test>
        <Box>
          <Button sx={{my:10, padding:5}} variant="contained" startIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Button variant="outlined" startIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Button
            size="large"
            color="primary"
            variant="outlined"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <GreenButton variant="outlined" startIcon={<DeleteIcon/>}>Test</GreenButton>
        </Box>
      </main>
    </>
  );
}

const Test = styled.div`
  background-color: red;
  color: white;
  padding: 50px;
`;

const GreenButton = styled(Button)`
border-color: green;
color: green;
`