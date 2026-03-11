import { Button } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={logout}
    >
      Logout
    </Button>
  );
}