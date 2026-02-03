import { useState } from "react";
import { signIn } from "next-auth/react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

export default function SignIn() {
  const [showProviders, setShowProviders] = useState(false);

  return (
    <>
      <Box
        component="main"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // TODO: Replace background image with gradient
          backgroundImage: "url(/yummy-rater_landing_pure-background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        {/* Login Button or Provider Card */}
        {!showProviders ? (
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowProviders(true)}
            sx={{
              px: 6,
              py: 2,
              letterSpacing: 2,
              zIndex: 1,
            }}
          >
            Login
          </Button>
        ) : (
          <Paper
            component="section"
            aria-label="Sign in options"
            elevation={0}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: 3,
              p: 3,
              mx: 2,
              maxWidth: 300,
              zIndex: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h1"
              gutterBottom
              sx={{ lineHeight: 1.1 }}
            >
              Sign in or create an account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We'll set up your account automatically if it's your first time.
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<GitHubIcon />}
                onClick={() => signIn("github", { callbackUrl: "/" })}
              >
                Login with GitHub
              </Button>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<GoogleIcon />}
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Login with Google
              </Button>
              <Button
                variant="text"
                fullWidth
                size="small"
                onClick={() => setShowProviders(false)}
              >
                Cancel
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>

      {/* Tray Image */}
      <Box
        component="img"
        src="/yummy-rater_landing_tray_800.png"
        alt="Yummy Rater Logo auf Verpackung"
        sx={{
          position: "absolute",
          top: { xs: "5%", sm: "3%" },
          transform: "translateX(-5%)",
          width: { xs: "600px", sm: "100%" },
          maxWidth: "800px",
        }}
      />

      {/* Star Image */}
      <Box
        component="img"
        src="/yummy-rater_landing_star_500.png"
        alt=""
        role="presentation"
        sx={{
          position: "absolute",
          bottom: "min(0px, calc((100vh - 800px) * 0.5))",
          right: "-10%",
          width: { xs: "50%", sm: "40%" },
          maxWidth: "500px",
        }}
      />
    </>
  );
}
