import Head from "next/head";
import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import SendIcon from "@mui/icons-material/Send";

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
          <Button
            sx={{ my: 10, padding: 5 }}
            variant="contained"
            startIcon={<DeleteIcon />}
          >
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
          <GreenButton variant="outlined" startIcon={<DeleteIcon />}>
            Test
          </GreenButton>
        </Box>
        <Typography variant="h1">Headline 1</Typography>

        <Typography variant="h2">Headline 2</Typography>

        <Typography variant="h3">Headline 3</Typography>
        <Typography variant="h4" gutterBottom>
          Headline 4
        </Typography>
        <Typography variant="h5">Headline 5</Typography>
        <Typography variant="h6" component="div">
          Headline 6
        </Typography>
        <hr />
        <Typography variant="body1">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam ab
          rerum dolorum laboriosam facere debitis quam, magni atque omnis
          voluptate aut odio deserunt consequuntur, adipisci corrupti, error
          quidem tempore ipsum!
        </Typography>
        <Typography variant="body2">
          Ich bin ein paragraph der zweiten (kleineren) Stufe <b>body2</b>
        </Typography>
        <Typography>
          Einfach ein <b>Typography</b> ohne Angabe von variant rendert eine
          paragraph des Typs <b>body2</b>
        </Typography>
        <Stack spacing={2} direction="row">
          <Button variant="text">Click text</Button>
          <Button
            component={Link}
            variant="outlined"
            href="https://www.google.com"
            size="small"
          >
            Click outlined
          </Button>
          <Button variant="contained" size="large">
            Click contained
          </Button>
          <Button variant="contained" size="small" disableElevation>
            Click contained
          </Button>
          <Button>Click no variant equals text</Button>
        </Stack>
        <Stack spacing={2} display="inline">
          <Typography>Warum funktioniert die size prop nicht?</Typography>
          <IconButton size="large">
            <SendIcon />
          </IconButton>
          <IconButton color="success" size="small">
            <SendIcon />
          </IconButton>
          <IconButton>
            <SendIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" spacing={2} display="block">
          <Button variant="outlined" size="small">
            Click
          </Button>
          <Button variant="outlined" size="medium">
            Click
          </Button>
          <Button variant="outlined" size="large">
            Click
          </Button>
        </Stack>
        <Typography>
          Die size prop scheint wohl doch zu funktionieren. Sie fügt
          unterschiedliche paddings hinzu und verändert evt. die Schriftgröüe?
        </Typography>
        <Typography>
          Ah! in einer flexbox mit direction row werden sie in die höge
          gestreched. Bei display block verhalten sie sich anders
        </Typography>
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
`;
