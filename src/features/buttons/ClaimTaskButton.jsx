import { Button } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

export default function ClaimTaskButton({ taskId, onSuccess }) {
  const { user } = useAuth();

  const claimTask = async () => {
    const authHeader = "Basic " + btoa(user.username + ":" + user.password);

    const res = await fetch(`/engine-rest/task/${taskId}/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader
      },
      body: JSON.stringify({
        userId: user.username
      })
    });

    if (!res.ok) {
      alert("Failed to claim task");
      return;
    }

    if (onSuccess) onSuccess();
  };

  return (
    <Button
      variant="contained"
      size="small"
      onClick={claimTask}
    >
      Claim
    </Button>
  );
}