import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Quagga from "@ericblade/quagga2";

export default function Scan() {
  const [data, setData] = useState("Not Found");

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
      setData(code); // Set the scanned barcode result
      Quagga.stop(); // Stop the scanner after a successful scan
    });

    // Clean up Quagga when the component is unmounted
    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <main>
      <Box m={3} component="section">
        <Typography variant="h5" component="h2">
          Scan
        </Typography>
      </Box>
      <style jsx>{`
        #video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
      <div
        id="video"
        style={{
          width: "500px",
          height: "200px",
          border: "1px solid black",
          overflow: "hidden", // Ensure video doesn't overflow the div
        }}
      ></div>
      <p>{data}</p>
    </main>
  );
}
