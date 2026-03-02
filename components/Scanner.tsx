import { useEffect, useState, useRef } from "react";
import Quagga from "@ericblade/quagga2";
import { Box, Alert, Slider, Typography } from "@mui/material";
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

type ZoomRange = { min: number; max: number; step: number };

export default function Scanner({
  onScan,
  onStartScanning,
  isScanning,
}: ScannerProps) {
  const [hasError, setHasError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomRange, setZoomRange] = useState<ZoomRange | null>(null);
  const videoRef = useRef();
  const trackRef = useRef<MediaStreamTrack | null>(null);

  const handleZoomChange = async (_: Event, value: number | number[]) => {
    const newZoom = value as number;
    setZoom(newZoom);
    if (trackRef.current) {
      await trackRef.current.applyConstraints({
        advanced: [{ zoom: newZoom } as any],
      });
    }
  };

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
        async (err) => {
          if (err) {
            if (err.name === "NotAllowedError") {
              setHasError(true);
            }
            //setIsScanning(false); <= toggleScanning in parent component
            console.error("Error initializing Quagga: ", err);
            return;
          }
          Quagga.start();
          const track = Quagga.CameraAccess.getActiveTrack();
          trackRef.current = track ?? null;
          const capabilities = track?.getCapabilities() as any;

          if (capabilities?.zoom) {
            const { min, max, step } = capabilities.zoom;
            const initialZoom = Math.max(1, min);
            setZoomRange({ min, max, step: step ?? 0.1 });
            setZoom(initialZoom);
            await track?.applyConstraints({
              advanced: [{ zoom: initialZoom } as any],
            });
          }
        },
      );

      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        if (code) {
          onScan(code);
        } else {
          console.warn("Scanned code is null");
        }
      });

      // Clean up Quagga when the component is unmounted
      return () => {
        Quagga.stop();
        trackRef.current = null;
        setZoomRange(null);
        setZoom(1);
      };
    }
  }, [isScanning, onScan]);


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
      {zoomRange && isScanning && (
        <Box width="100%" maxWidth="640px" px={2} pt={1}>
          <Typography variant="caption" color="text.secondary">
            Zoom: {zoom.toFixed(1)}×
          </Typography>
          <Slider
            value={zoom}
            min={zoomRange.min}
            max={zoomRange.max}
            step={zoomRange.step}
            onChange={handleZoomChange}
            aria-label="Camera zoom"
            size="small"
          />
        </Box>
      )}
    </Box>
  );
}
