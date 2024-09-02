import { useSession, signIn, signOut } from "next-auth/react";
import Button from "@mui/material/Button";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button onClick={() => signOut()} variant="outlined" color="inherit">
        Sign out
      </Button>
    );
  }
  return (
    <Button onClick={() => signIn()} variant="outlined" color="inherit">
      Sign in
    </Button>
  );
}
