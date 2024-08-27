import type { AppProps } from "next/app";
import { Global } from "@emotion/react";
import { SessionProvider, useSession } from "next-auth/react";
import useSWR from "swr";
import { useEffect } from "react";
import { global } from "@/global-style";
import { ReactNode } from "react";

interface AuthProps {
  children: ReactNode;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json();
    const error = new Error(errorData);
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const {
    data: userData,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/user", fetcher);

  useEffect(() => {
    if (error && error.status === 404) {
      fetch("/api/user/create", { method: "POST" })
        .then((result) => result.json())
        .then(() => {
          mutate();
        });
    }
  }, [error, mutate]);

  if (isLoading) {
    return <h2>Is Loading...</h2>;
  }

  console.log("userData", userData);

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
