import { Button } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

export default function UnclaimTaskButton({ taskId, onSuccess }) {
  const { user } = useAuth();

  const unclaimTask = async () => {
    const authHeader = "Basic " + btoa(user.username + ":" + user.password);

    const res = await fetch(`/engine-rest/task/${taskId}/unclaim`, {
      method: "POST",
      headers: {
        Authorization: authHeader
      }
    });

    if (!res.ok) {
      alert("Failed to clear claim");
      return;
    }

    if (onSuccess) onSuccess();
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={unclaimTask}
    >
      Clear Claim
    </Button>
  );
}