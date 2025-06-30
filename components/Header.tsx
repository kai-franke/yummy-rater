import { AppBar, Typography, Toolbar, Box } from "@mui/material";
import Login from "./Login";

function Header() {
  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Box
          component="img"
          sx={{
            height: 23,
          }}
          alt="Yummy Rater"
          src="./yummy_rater_logo.svg"
        />
        {/* Box with flexGrow works like a spacer */}
        <Box sx={{ flexGrow: 1 }} />
        <Login />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
