import { IProduct } from "@/types/product";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";

function ProductCard({ product }: { product: IProduct }) {
  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardMedia
        height="250"
        component="img"
        image={product.image}
        alt={product.name}
      />
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
          {
            // Tooltip doesn't work directly on Rating component
          }
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
        <CardActions></CardActions>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
