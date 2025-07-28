import { ProductFormProps } from "@/types/productFormProps";
import { useState } from "react";
import { Button, TextField, Typography, Rating } from "@mui/material";
import Image from "next/image";
import { init } from "next/dist/compiled/webpack/webpack";

export default function ProductForm({
  onSubmit,
  isEditMode = false,
  initialData = { ean: "" },
}: ProductFormProps) {
  const [userRating, setUserRating] = useState(initialData.user_rating || 0);
  const [imageSource, setImageSource] = useState<string | undefined>(
    initialData.image || ""
  );
  console.log("initialData: ", initialData);

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
          inputProps={{ readOnly: true }}
        />
        <TextField
          defaultValue={initialData.name}
          name="name"
          label="Name"
          type="text"
          fullWidth
          margin="normal"
          required
        />

        <TextField
          defaultValue={initialData.brand || ""}
          name="brand"
          label="Marke"
          type="text"
          fullWidth
          margin="normal"
        />
        <TextField
          defaultValue={initialData.description || ""}
          name="description"
          label="Beschreibung"
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <TextField
          defaultValue={initialData.image || ""}
          name="image"
          label="Bild-URL"
          type="text"
          // value={image}
          // onChange={(e) => setImage(e.target.value)}
          fullWidth
          inputProps={{ readOnly: true }}
          margin="normal"
        />
        {imageSource && (
          <Image src={imageSource} alt="bild" width={200} height={200} />
        )}
        <Typography gutterBottom>Benutzerbewertung</Typography>

        <Rating
          name="user_rating"
          value={userRating}
          onChange={handleChangeRating}
        />

        <TextField
          defaultValue={initialData.user_note || ""}
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
          {isEditMode ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </>
  );
}
