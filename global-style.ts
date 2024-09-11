import { css } from "@emotion/react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500"],
});

export const global = css`
  :root {
    --scanner-background: #e0e0e0;
    --scanner-focus-marks: #ffffff85;
  }

  body {
    background-color: #f6f6f6;
    font-family: ${roboto.style.fontFamily};
    margin: 0;
  }
`;
