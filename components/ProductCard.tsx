import { IProduct } from "@/types/product";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";

function ProductCard({ product }: { product: IProduct }) {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 350,
      }}
    >
      <Box sx={{ position: "relative", paddingTop: "100%" }}>
        <CardMedia
          component="img"
          image={product.image ? product.image : "/no_product_image.jpg"}
          alt={product.name}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%", // Not sure if this is needed
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <CardContent>
        <Typography variant="body2" color="textSecondary" mb={0.5}>
          {product.brand}
        </Typography>
        <Typography variant="h5" mb={0.75}>
          {product.name}
        </Typography>
        <Typography variant="body2" mb={2.5}>
          {product.description}
        </Typography>
        <Tooltip title={product.user_rating} followCursor>
          <Box sx={{ display: "inline-block" }}>
            <Rating
              defaultValue={0}
              precision={0.5}
              value={product.user_rating}
              readOnly
            />
          </Box>
        </Tooltip>
        <Typography variant="body1" mt={0.5}>
          {product.user_note}
        </Typography>
        <Typography variant="body2" color="grey.500" mt={2.5}>
          EAN: {product.ean}
        </Typography>
      </CardContent>
    </Card>
  );
}

function ProductCardContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
}

export { ProductCard, ProductCardContainer };
