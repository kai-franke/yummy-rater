import { AppBar, Typography, Toolbar } from "@mui/material";
import Login from "./Login";
import Navigation from "./Navigation";

function Header() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Yummy Rater
        </Typography>
        {/* <div>
          <Navigation />
        </div> */}
        <Login />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
