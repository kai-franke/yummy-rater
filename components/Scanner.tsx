import { Box } from "@mui/material";
import { useEffect } from "react";
import Quagga from "@ericblade/quagga2";
import { ScannerProps } from "@/types/scanner";

export default function Scanner({ onScan }: ScannerProps) {
  useEffect(() => {
    // Initialize Quagga when the component is mounted
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            facingMode: "environment", // Use the back camera on mobile devices
          },
          target: document.querySelector("#video")!, // The ID of the video element
        },
        decoder: {
          readers: ["ean_reader"], // Enable EAN barcode scanning
        },
      },
      (err) => {
        if (err) {
          console.error("Error initializing Quagga: ", err);
          return;
        }
        Quagga.start(); // Start scanning
      }
    );

    // Listen for detected barcodes
    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      if (code) {
        onScan(code); // Only call onScan if the code is not null
        Quagga.stop(); // Stop the scanner after a successful scan
      } else {
        console.warn("Scanned code is null");
      }
    });

    // Clean up Quagga when the component is unmounted
    return () => {
      Quagga.stop();
    };
  }, [onScan]);

  return (
    <Box
      id="video"
      sx={{
        width: "100%",
        height: 200,
        border: "1px solid black",
        overflow: "hidden",
      }}
    />
  );
}
