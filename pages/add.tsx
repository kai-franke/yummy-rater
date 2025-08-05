import { useState } from "react";
import { useRouter } from "next/router";
import { Button, TextField, Typography, Rating, Alert } from "@mui/material";
import Scanner from "@/components/Scanner";
import { getProductByEAN } from "@/services/productService";
import Image from "next/image";
import useSWR from "swr";
import ProductForm from "@/components/ProductForm";

export default function AddProduct() {
  const [ean, setEan] = useState<string | undefined>("");
  const [name, setName] = useState<string | undefined>("");
  const [brand, setBrand] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [image, setImage] = useState<string | undefined>("");
  const [userRating, setUserRating] = useState(0);
  const [userNote, setUserNote] = useState<string | undefined>("");
  const router = useRouter();
  const { mutate } = useSWR("/api/user");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const productData = {
      ean: Number(ean),
      name: name,
      brand: brand,
      description: description,
      image: image,
      user_rating: userRating,
      user_note: userNote,
    };

    await fetch("/api/user/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    }).catch((e) => {
      setError(e.message);
    });

    await mutate();
    router.push("/profile");

    // Nach dem Hinzufügen zur Startseite navigieren oder eine Bestätigungsseite anzeigen
  };
  async function handleScan(scannedData: string) {
    setEan(scannedData);
    try {
      const data = await getProductByEAN(scannedData);

      setName(data?.name);
      setBrand(data?.brand);
      setDescription(data?.description);
      setImage(data?.image);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Zugriff auf 'message' ist sicher
        setError(error.message);
      } else {
        console.error("Ein unbekannter Fehler ist aufgetreten", error);
      }
    }
  }

  function handleStartScanning() {
    setError(null);
    setEan("");
    setName("");
    setBrand("");
    setDescription("");
    setImage("");
    setUserRating(0);
    setUserNote("");
  }
  function handleChangeRating(
    _event: React.ChangeEvent<{}>,
    newValue: number | null
  ) {
    setUserRating(Number(newValue));
  }
  function addProduct(data: any) {
    console.log("Adding a product.", data);
  }
  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Add product
      </Typography>
      <Scanner onScan={handleScan} onStartScanning={handleStartScanning} />
      {error && (
        <Alert severity="warning">
          {error}
          {ean}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="EAN"
          type="number"
          value={ean}
          onChange={(e) => setEan(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Marke"
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Bild-URL"
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          fullWidth
          margin="normal"
        />
        {image && <Image src={image} alt="bild" width={200} height={200} />}
        <Typography component="legend" gutterBottom>Benutzerbewertung</Typography>

        <Rating
          defaultValue={0}
          value={userRating}
          onChange={handleChangeRating}
        />

        <TextField
          label="Benutzeranmerkung"
          value={userNote}
          onChange={(e) => setUserNote(e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Produkt hinzufügen
        </Button>
      </form>
    </>
  );
}
