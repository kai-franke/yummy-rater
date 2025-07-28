import { ProductFormProps } from "@/types/productFormProps";
import { useState } from "react";
import { Button, TextField, Typography, Rating } from "@mui/material";
import Image from "next/image";

export default function ProductForm({
  onSubmit,
  isEditMode = false,
  initialData = { ean: "" },
}: ProductFormProps) {
  const [userRating, setUserRating] = useState(0);
  const [imageSource, setImageSource] = useState<string | undefined>("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log(userRating);
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    // data.user_rating = String(userRating);
    onSubmit(data);
  }

  function handleChangeRating(
    _event: React.ChangeEvent<{}>,
    newValue: number | null
  ) {
    setUserRating(Number(newValue));
  }
  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditMode ? "Edit Product" : "Add Product"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          defaultValue={initialData.ean || ""}
          name="ean"
          label="EAN"
          type="number"
          required
          fullWidth
          margin="normal"
        />
        <TextField
          name="name"
          label="Name"
          type="text"
          fullWidth
          margin="normal"
          required
        />

        <TextField
          name="brand"
          label="Marke"
          type="text"
          fullWidth
          margin="normal"
        />
        <TextField
          name="description"
          label="Beschreibung"
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <TextField
          name="image"
          label="Bild-URL"
          type="text"
          // value={image}
          // onChange={(e) => setImage(e.target.value)}
          fullWidth
          disabled
          margin="normal"
        />
        {imageSource && (
          <Image src={imageSource} alt="bild" width={200} height={200} />
        )}
        <Typography gutterBottom>Benutzerbewertung</Typography>

        <Rating
          name="user_rating"
          defaultValue={0}
          value={userRating}
          onChange={handleChangeRating}
        />

        <TextField
          name="user_note"
          label="Benutzeranmerkung"
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
          {isEditMode ? "Edit Product" : "Add Product"}
        </Button>
      </form>
    </>
  );
}
