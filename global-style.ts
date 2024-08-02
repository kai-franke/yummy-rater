import { css } from "@emotion/react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500"],
});

export const global = css`
  body {
    background-color: #f6f6f6;
    font-family: ${roboto.style.fontFamily};
    padding: 1em;
  }
`;
