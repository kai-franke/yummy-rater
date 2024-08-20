import type { AppProps } from "next/app";
import { Global } from "@emotion/react";
import { SessionProvider, useSession } from "next-auth/react";
import useSWR from "swr";

import { global } from "@/global-style";
import { ReactNode } from "react";

interface AuthProps {
  children: ReactNode;
}

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { data: userData, error, isLoading } = useSWR("/api/user", fetcher);
  if (isLoading) {
    return <h2>Is Loading...</h2>;
  }
  console.log("userData", userData);
  console.log("error", error);

  return (
    <>
      <SessionProvider session={session}>
        <Auth>
          <Global styles={global} />
          <Component {...pageProps} />
        </Auth>
      </SessionProvider>
    </>
  );
}

function Auth({ children }: AuthProps) {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Is loading</div>;
  }
  return children;
}
