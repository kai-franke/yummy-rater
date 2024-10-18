import { useRouter } from "next/router";
import { Alert, Typography } from "@mui/material";
import { ISanitizedUser } from "@/types/user";
import { IProduct } from "@/types/product";

interface ProductPageProps {
  userData: ISanitizedUser;
}
export default function ProductPage({ userData }: ProductPageProps) {
  const router = useRouter();
  const { ean } = router.query;
  const productToShow = userData?.products?.find(
    (product: IProduct) => product.ean.toString() === ean
  );

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
      <Typography variant="body1">EAN: {ean}</Typography>
    </>
  );
}
