import { useRouter } from "next/router";
import { Alert, Typography } from "@mui/material";
import { PageProps } from "@/types/pageProps";
import { IProduct } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ProductCardContainer from "@/components/ProductCardContainer";

export default function ProductPage({ userData }: PageProps) {
  const router = useRouter();
  const { ean } = router.query;
  const productToShow = userData.products?.find(
    (product: IProduct) => product.ean.toString() === ean
  );

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Product Details
      </Typography>
      {productToShow ? (
        <ProductCardContainer>
          <ProductCard product={productToShow} />
        </ProductCardContainer>
      ) : (
        <Alert severity="error">No Product for EAN {`${ean}`} found.</Alert>
      )}
    </>
  );
}
