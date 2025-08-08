import { useEffect, useState, useRef } from "react";
import Quagga from "@ericblade/quagga2";
import {
  Box,
  Button,
  Alert,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { ScannerProps } from "@/types/scanner";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ScannerContainer = styled(Box)`
  position: relative;
  width: 100%;
  max-width: 640px;
  aspect-ratio: 2.5 / 1;
  overflow: hidden;
  background-color: var(--scanner-background);
`;

const FocusMark = styled(Box)<{ rotation: number; active: boolean }>`
  position: absolute;
  width: 6%;
  height: 15%;
  border: min(15px, calc(5px + 1.5vw)) solid
    ${({ active }) =>
      active
        ? "var(--scanner-focus-marks)"
        : "var(--scanner-focus-marks-inactive)"};
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

const CameraErrorMessage = styled(Alert)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default function Scanner({ onScan, onStartScanning }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showEANInput, setShowEANInput] = useState(false);
  const [manualEANValue, setManualEANValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef();

  useEffect(() => {
    if (isScanning) {
      setHasError(false);
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              facingMode: "environment",
            },
            target: videoRef.current,
          },
          decoder: {
            readers: ["ean_reader"],
          },
        },
        (err) => {
          if (err) {
            if (err.name === "NotAllowedError") {
              setHasError(true);
            }
            setIsScanning(false);
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
    const newIsScanning = !isScanning;
    setIsScanning(newIsScanning);
    if (newIsScanning && onStartScanning) {
      onStartScanning();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedValue = manualEANValue.trim();
    if (trimmedValue) {
      onScan(trimmedValue);
      setManualEANValue("");
      setShowEANInput(false);
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Global styles={videoElementCss} />

      <ScannerContainer>
        <FocusMark
          active={isScanning}
          rotation={0}
          style={{ top: "15%", left: "6%" }}
        />
        <FocusMark
          active={isScanning}
          rotation={90}
          style={{ top: "15%", right: "6%" }}
        />
        <FocusMark
          active={isScanning}
          rotation={270}
          style={{ bottom: "15%", left: "6%" }}
        />
        <FocusMark
          active={isScanning}
          rotation={180}
          style={{ bottom: "15%", right: "6%" }}
        />
        {hasError && (
          <CameraErrorMessage severity="error">
            Please allow access to the camera.
          </CameraErrorMessage>
        )}
        {isScanning && <VideoBox ref={videoRef} id="video" />}
      </ScannerContainer>

      <Button
        variant={isScanning || showEANInput ? "outlined" : "contained"}
        color="primary"
        onClick={toggleScanning}
        sx={{ mt: 2, width: "100%", maxWidth: "640px" }}
      >
        {isScanning ? "Stop scanning" : "Start scanning"}
      </Button>
      {!showEANInput ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setShowEANInput(true);
          }}
          sx={{ mt: 2, width: "100%", maxWidth: "640px" }}
        >
          Enter article number
        </Button>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Stack direction="row" spacing={1.25} alignItems="flex-start" mt={2}>
            <TextField
              fullWidth
              label="Article Number"
              value={manualEANValue}
              onChange={(e) => setManualEANValue(e.target.value)}
              placeholder="e.g., 43879528"
              helperText="Enter a EAN or UPC Number"
              variant="outlined"
              size="small"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="Clear"
                      onClick={() => {
                        setManualEANValue(""), setShowEANInput(false);
                      }}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* <IconButton
              aria-label="Submit article number"
              onClick={(e) => handleSubmit(e)}
              type="submit"
              disabled={!manualEANValue.trim()}
              color="primary"
            >
              <ArrowForwardIcon />
            </IconButton> */}
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => handleSubmit(e)}
              type="submit"
              size="large"
              disabled={!manualEANValue.trim()}
              startIcon={<ArrowForwardIcon />}
            ></Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
