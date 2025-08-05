import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
          label="Yummies"
          icon={<StarIcon />}
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
