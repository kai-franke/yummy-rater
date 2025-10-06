import { ProductFormProps } from "@/types/productFormProps";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Rating,
  Tooltip,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Image from "next/image";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ProductForm({
  onSubmit,
  isEditMode = false,
  initialData = { ean: "" },
}: ProductFormProps) {
  const [userRating, setUserRating] = useState(initialData.user_rating || 0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSource, setImageSource] = useState<string | undefined>(
    initialData.image || undefined
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    if (imageFile) {
      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        console.error("Failed to upload image");
      } else {
        const result = await response.json();
        console.log("Image uploaded successfully:", result);
        data.image = result.url; // Assuming the API returns the image URL
      }
    } else {
      data.image = imageSource || ""; // Use the initial image if no file is provided
    }
    onSubmit(data);
  }

  function handleChangeRating(
    _event: React.ChangeEvent<{}>,
    newValue: number | null
  ) {
    setUserRating(Number(newValue));
  }

  function handleChangeFile(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setImageFile(event.target.files[0]);
      setImageSource(URL.createObjectURL(event.target.files[0]));
    }
  }

  function handleResetImage() {
    setImageFile(null);
    setImageSource(initialData.image);
  }

  function handleDeleteImage() {
    setImageFile(null);
    setImageSource(undefined);
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditMode ? "Edit Product" : "Add Product"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="subtitle1" component="h3" gutterBottom>
          EAN: {initialData.ean}
        </Typography>
        <input type="text" name="ean" hidden value={initialData.ean} readOnly />
        <TextField
          defaultValue={initialData.name}
          name="name"
          label="Product"
          type="text"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          defaultValue={initialData.brand || ""}
          name="brand"
          label="Brand"
          type="text"
          fullWidth
          margin="normal"
        />
        <TextField
          defaultValue={initialData.description || ""}
          name="description"
          label="Description"
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <Box
          component="fieldset"
          sx={{
            // Kopiert das Styling von TextField
            border: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.23)",
            borderRadius: 1,
            padding: "16.5px 14px",
            margin: 0,
            minWidth: 0,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "start",
            typography: "body1",
            "&:hover": {
              borderColor: "black",
            },
          }}
        >
          <Box
            component="legend"
            sx={{ px: 0.5, fontSize: "0.75rem", color: "text.secondary" }}
          >
            Image
          </Box>

          {imageSource && (
            <Box sx={{ position: "relative" }}>
              <Tooltip title="Delete Image" placement="top">
                <CancelIcon
                  onClick={handleDeleteImage}
                  sx={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                    fill: "black",
                    backgroundColor: "white",
                    borderRadius: "50%",
                  }}
                />
              </Tooltip>
              <Image
                src={imageSource}
                alt={initialData.name || "Product Image"}
                width={200}
                height={200}
                style={{
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
          <Button variant="outlined" component="label">
            {imageSource ? "Change" : "Choose File"}
            <input
              name="image"
              type="file"
              hidden
              accept="image/*"
              onChange={handleChangeFile}
            />
          </Button>

          {imageSource !== initialData.image && (
            <Button variant="outlined" onClick={handleResetImage}>
              Reset
            </Button>
          )}
        </Box>
        <FormControl variant="outlined" fullWidth sx={{ mt: 3 }}>
          <InputLabel shrink htmlFor="rating-fieldset">
            Rating
          </InputLabel>
          <OutlinedInput
            id="rating-fieldset"
            notched
            label="Rating"
            readOnly
            startAdornment={
              <>
                <Rating
                  name="user_rating"
                  value={userRating}
                  onChange={handleChangeRating}
                />
                <input type="hidden" name="user_rating" value={userRating} />
              </>
            }
          />
        </FormControl>
        <TextField
          defaultValue={initialData.user_note || ""}
          name="user_note"
          label="Note"
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />

        <Button
          type="button"
          variant="outlined"
          color="primary"
          href="/products"
          sx={{ mt: 2, mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          {isEditMode ? "Update Product" : "Create Product"}
        </Button>
      </Box>
    </>
  );
}
