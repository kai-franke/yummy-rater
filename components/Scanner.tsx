import { useEffect, useState } from "react";
import Quagga from "@ericblade/quagga2";
import { Box, Button } from "@mui/material";
import { ScannerProps } from "@/types/scanner";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";

const ScannerContainer = styled(Box)`
  position: relative;
  width: 100%;
  max-width: 640px;
  aspect-ratio: 2.5 / 1;
  overflow: hidden;
  background-color: var(--scanner-background);
`;

const FocusMark = styled(Box)<{ rotation: number }>`
  position: absolute;
  width: 6%;
  height: 15%;
  border: min(15px, calc(5px + 1.5vw)) solid var(--scanner-focus-marks);
  border-right: none;
  border-bottom: none;
  transform: rotate(${(props) => props.rotation}deg);
  z-index: 10;

  @media (max-width: 359px) {
    display: none;
  }
`;

const VideoBox = styled(Box)`
  position: absolute;
  height: 100%;
  display: flex;
`;

const videoElementCss = css`
  #video video {
    width: 100%;
    align-self: center;
    flex-basis: 100%;
  }
`;

export default function Scanner({ onScan }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isScanning) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              facingMode: "environment",
            },
            target: document.querySelector("#video")!,
          },
          decoder: {
            readers: ["ean_reader"],
          },
        },
        (err) => {
          if (err) {
            console.error("Error initializing Quagga: ", err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        if (code) {
          onScan(code);
          toggleScanning();
        } else {
          console.warn("Scanned code is null");
        }
      });

      // Clean up Quagga when the component is unmounted
      return () => {
        Quagga.stop();
      };
    }
  }, [isScanning, onScan]);

  function toggleScanning() {
    setIsScanning(!isScanning);
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Global styles={videoElementCss} />

      <ScannerContainer>
        <FocusMark rotation={0} style={{ top: "15%", left: "6%" }} />
        <FocusMark rotation={90} style={{ top: "15%", right: "6%" }} />
        <FocusMark rotation={270} style={{ bottom: "15%", left: "6%" }} />
        <FocusMark rotation={180} style={{ bottom: "15%", right: "6%" }} />
        {isScanning && <VideoBox id="video" />}
      </ScannerContainer>

      <Button
        variant="contained"
        color="primary"
        onClick={toggleScanning}
        sx={{ mt: 2 }}
      >
        {isScanning ? "Stop" : "Scan"}
      </Button>
    </Box>
  );
}
