import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Slider, TextField, Typography } from "@mui/material";

export default function AddProduct() {
  const [ean, setEan] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [userRating, setUserRating] = useState("");
  const [userNote, setUserNote] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const productData = {
      ean: Number(ean),
      name: name || undefined,
      brand: brand || undefined,
      description: description || undefined,
      image: image || undefined,
      user_rating: userRating ? Number(userRating) : undefined,
      user_note: userNote || undefined,
    };

    await fetch("/api/user/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    // Nach dem Hinzufügen zur Startseite navigieren oder eine Bestätigungsseite anzeigen
    router.push("/");
  };

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Add product
      </Typography>
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
        <Typography gutterBottom>Benutzerbewertung</Typography>
        <Slider
          value={userRating ? Number(userRating) : 0}
          onChange={(_, newValue) => setUserRating(newValue.toString())}
          step={0.1}
          min={0}
          max={5}
          valueLabelDisplay="auto"
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
