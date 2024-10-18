import { useRouter } from "next/router";
import { Alert, Typography } from "@mui/material";
import { ISanitizedUser, IUser } from "@/types/user";
import { IProduct } from "@/types/product";
import ProductCard from "@/components/ProductCard";

interface ProductPageProps {
  userData: IUser;
}

export default function ProductPage({ userData }: ProductPageProps) {
  const router = useRouter();
  const { ean } = router.query;
  const productToShow = userData?.products?.find(
    (product: IProduct) => product.ean.toString() === ean
  );
  console.log('productToShow', productToShow)

  if (!productToShow) {
    return (
      <>
        <Typography variant="h5" component="h2" gutterBottom>
          Product Details
        </Typography>
        <Alert severity="error">No Product for EAN {`${ean}`} found.</Alert>
      </>
    );
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Product Details
      </Typography>
        <ProductCard product={productToShow} />
    </>
  );
}
