import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Link from "next/link";

import { useState } from "react";
export default function Navigation() {
  const [value, setValue] = useState(0);
  return (
    <Box sx={{ width: 500 }}>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            href="/"
            label="Home"
            icon={<HomeIcon />}
            component={Link}
          />
          <BottomNavigationAction
            href="/search"
            label="Search"
            icon={<SearchIcon />}
            component={Link}
          />
          <BottomNavigationAction
            href="/favorites"
            label="Favorites"
            icon={<FavoriteIcon />}
            component={Link}
          />
          <BottomNavigationAction
            href="/add"
            label="Add"
            icon={<AddIcon />}
            component={Link}
          />
          <BottomNavigationAction
            href="/profile"
            label="Profile"
            icon={<AccountBoxIcon />}
            component={Link}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
