import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from "@mui/icons-material/Add";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Link from "next/link";
import { useRouter } from "next/router";
export default function Navigation() {
  const router = useRouter();

  return (
    // <Box sx={{ width: 500 }}>
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
      elevation={3}
    >
      <BottomNavigation showLabels value={router.pathname}>
        <BottomNavigationAction
          href="/"
          value="/"
          label="Home"
          icon={<HomeIcon />}
          component={Link}
        />
        <BottomNavigationAction
          href="/products"
          value="/products"
          label="My Products"
          icon={<ShoppingCartIcon />}
          component={Link}
        />
        <BottomNavigationAction
          href="/favorites"
          value="/favorites"
          label="Favorites"
          icon={<FavoriteIcon />}
          component={Link}
        />
        <BottomNavigationAction
          href="/add"
          value="/add"
          label="Add"
          icon={<AddIcon />}
          component={Link}
        />
        <BottomNavigationAction
          href="/profile"
          value="/profile"
          label="Profile"
          icon={<AccountBoxIcon />}
          component={Link}
        />
      </BottomNavigation>
    </Paper>
    // </Box>
  );
}
