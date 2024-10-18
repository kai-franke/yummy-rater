import { useState } from "react";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";

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
        <div>
          <label>EAN:</label>
          <input
            type="number"
            value={ean}
            onChange={(e) => setEan(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Marke:</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div>
          <label>Beschreibung:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Bild-URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <div>
          <label>Benutzerbewertung:</label>
          <input
            type="number"
            value={userRating}
            onChange={(e) => setUserRating(e.target.value)}
            min="0"
            max="5"
            step="0.1"
          />
        </div>
        <div>
          <label>Benutzeranmerkung:</label>
          <textarea
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
          />
        </div>
        <button type="submit">Produkt hinzufügen</button>
      </form>
    </>
  );
}
