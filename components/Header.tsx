import { AppBar, Typography, Toolbar } from "@mui/material";
import Login from "./Login";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h5"
          component="h1"
          sx={{ flexGrow: 1 }}
          color="inherit"
          aria-label="Yummy Rater App Name"
        >
          Yummy Rater
        </Typography>
        <Login />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
