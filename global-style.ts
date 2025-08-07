import { css } from "@emotion/react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500"],
});

export const global = css`
  :root {
    --scanner-background: #F4F2F1;
    --scanner-focus-marks: #ffffff85;
    --scanner-focus-marks-inactive: #7B7773;
  }

  body {
    font-family: ${roboto.style.fontFamily};
    margin: 0;
  }
`;
