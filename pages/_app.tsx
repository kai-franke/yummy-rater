import type { AppProps } from "next/app";
import { Global } from "@emotion/react";
import { SessionProvider, useSession } from "next-auth/react";

import { global } from "@/global-style";
import { ReactNode } from "react";

interface AuthProps {
  children: ReactNode;
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
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
