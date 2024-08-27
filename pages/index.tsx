import Head from "next/head";
import Login from "@/components/Login";


export default function Home() {
 
  return (
    <>
      <Login />
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
        <h2>Hallo</h2>
      </main>
    </>
  );
}
