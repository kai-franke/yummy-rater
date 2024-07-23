import Head from "next/head";
import styled from "@emotion/styled";


export default function Home() {
  return (
    <>
      <Head>
        <title>Yummy Rater</title>
        <meta name="description" content="The best app to rate your yummy products" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
          <Test>Hallo</Test>
      </main>
    </>
  );
}

const Test = styled.div`
  background-color: red;
  color: white;
  padding: 50px;
`