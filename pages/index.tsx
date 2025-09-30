import {
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  CardActions,
  Button,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import Scanner from "@/components/Scanner";
import { useState } from "react";
import { set } from "mongoose";

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedEAN, setScannedEAN] = useState<string | null>(null);

  function toggleScanning() {
    const newIsScanning = !isScanning;
    setIsScanning(newIsScanning);
  }

  function handleScanResult(scannedData: string) {
    toggleScanning();
    setScannedEAN(scannedData);
    console.log("Scanned EAN:", scannedData);
  }

  return (
    <>
      <Stack spacing={5}>
        <Card
          sx={{
            borderRadius: 4,
            p: 2,
            backgroundImage: "url('/yummy-rater_card_background_star.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right bottom",
            backgroundSize: "cover",
          }}
        >
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              Get started
            </Typography>
            <Typography variant="body2">
              {`It looks like you don't have any Yummies yet. Start by scanning a
              product and then add it to your Yummies.`}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <IconButton
              sx={{
                width: 60,
                height: 60,
                "& .MuiSvgIcon-root": {
                  fontSize: 35, // Icon-Größe
                },
              }}
              href=""
              color="primary"
              aria-label="jump to scan"
            >
              <ArrowDownwardIcon />
            </IconButton>
          </CardActions>
        </Card>
        <Card
          sx={{
            borderRadius: 4,
            p: 2,
            backgroundColor: "secondary.main",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Scan a product
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {`Scan a barcode or enter an article number to find it in your rated products or add it to your collection.`}
            </Typography>
            <Scanner onScan={handleScanResult} isScanning={isScanning} />
            <Button
              variant="contained"
              color="primary"
              onClick={toggleScanning}
              sx={{ mt: 2, width: "100%", maxWidth: "640px" }}
            >
              {isScanning ? "Stop Scanning" : "Start Scanning"}
            </Button>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}></CardActions>
        </Card>
        <Card
          sx={{
            borderRadius: 4,
            p: 2,
            backgroundColor: "#EFEBE9",
          }}
        >
          <CardContent>
            <StarOutlineIcon fontSize="large" />
            <Typography variant="h6" component="h3" gutterBottom>
              My Yummies
            </Typography>
            <Typography variant="body2">
              {`View and manage the foods you've rated and want to remember.`}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              href="/products"
              variant="outlined"
              color="primary"
              sx={{ width: "100%", maxWidth: "640px" }}
            >
              Go to your rated products
            </Button>
          </CardActions>
        </Card>
      </Stack>
    </>
  );
}
