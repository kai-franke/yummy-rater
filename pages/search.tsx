import { Alert, AlertTitle, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Scanner from "@/components/Scanner";
import { getProductByEAN } from "@/services/productService";
import { IProductNoMongoose } from "@/types/product";

export default function Scan() {
  const [ean, setEan] = useState("");
  const [product, setProduct] = useState<IProductNoMongoose | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleScan(scannedData: string) {
    setEan(scannedData);
  }

  function handleStartScanning() {
    setEan("");
    setProduct(null);
    setError(null);
  }

  useEffect(() => {
    if (ean) {
      setError(null);
      getProductByEAN(ean)
        .then((data) => {
          setProduct(data);
        })
        .catch((err) => {
          setError(err.message);
          setProduct(null);
        });
    }
  }, [ean]);

  return (
    <Box m={3} component="main">
      <Typography variant="h5" component="h2">
        Search
      </Typography>
      <Scanner onScan={handleScan} onStartScanning={handleStartScanning} />
      <Typography variant="body1" mt={2}>
        Scanned Data: {ean}
      </Typography>
      {error ? (
        <Alert severity="warning">{error}</Alert>
      ) : (
        <>
          <Typography variant="body1" mt={2}>
            EAN: {product?.ean ? product.ean.toString() : "No code"}
            <br />
            Name: {product?.name}
            <br />
            Brand: {product?.brand}
            <br />
            Description: {product?.description}
            <br />
            User Rating: {product?.user_rating}
            <br />
            User Note: {product?.user_note}
          </Typography>
          {product?.image && (
            <Box
              mt={2}
              component="img"
              alt="product Image"
              src={product?.image}
            />
          )}
        </>
      )}
    </Box>
  );
}
