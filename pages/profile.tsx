import ProductCard from "@/components/ProductCard";
import ProductCardContainer from "@/components/ProductCardContainer";
import { IUser } from "@/types/user";
import { Typography } from "@mui/material";

interface ProfilePageProps {
  userData: IUser;
}

export default function ProfilePage({ userData }: ProfilePageProps) {
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
