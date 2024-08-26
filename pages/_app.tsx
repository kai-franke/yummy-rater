import type { AppProps } from "next/app";
import { Global } from "@emotion/react";
import { SessionProvider, useSession } from "next-auth/react";
import useSWR from "swr";

import { global } from "@/global-style";
import { ReactNode } from "react";

interface AuthProps {
  children: ReactNode;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { data: userData, error, isLoading } = useSWR("/api/user", fetcher);

  if (isLoading) {
    return <h2>Is Loading...</h2>;
  }

  if (error) {
    return <h2>Error loading user data: {error.message}</h2>;
  }

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
    return <div>Is Loading...</div>;
  }
  return children;
}
