import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#7B7773",
//     },
//     secondary: {
//       main: "#F0D755",
//     },
//     background: {
//       default: "#F4F2F1",
//       paper: "#ffffff",
//     },
//   },
// });

// theme.components = {
//     MuiBottomNavigationAction: {
//       styleOverrides: {
//         root: {
//           "&.Mui-selected .MuiSvgIcon-root": {
//             color: theme.palette.secondary.main,
//           },
//         },
//       },
//     },
//   };

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
        root: ({ theme }) => ({
          "&.Mui-selected .MuiSvgIcon-root": {
            color: theme.palette.secondary.main,
          },
        }),
      },
    },
  },
});

export default theme;
