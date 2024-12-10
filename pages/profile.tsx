import ProductCard from "@/components/ProductCard";
import ProductCardContainer from "@/components/ProductCardContainer";
import { PageProps } from "@/types/pageProps";
import { Typography } from "@mui/material";
export default function ProfilePage({ userData }: PageProps) {
  const allProducts = userData?.products;
  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Profile
      </Typography>
      <ProductCardContainer>
        {allProducts.map((product) => (
          <ProductCard key={product.ean} product={product} />
        ))}
      </ProductCardContainer>
    </>
  );
}
