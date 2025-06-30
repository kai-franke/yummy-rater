import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7B7773",
    },
    secondary: {
      main: "#F0D755",
    },
    background: {
      default: "#F4F2F1",
      paper: "#ffffff",
    },
  },
  components: {
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            "& .MuiSvgIcon-root": {
              color: "#F0D755",
            },
          },
        },
      },
    },
  },
});

export default theme;
