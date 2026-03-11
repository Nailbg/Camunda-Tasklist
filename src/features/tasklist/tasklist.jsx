import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTasks, claimTask, unclaimTask } from "../api/camundaApi";
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const currentUser = "demo"; // replace with auth user

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await fetchTasks(currentUser);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleClaim(taskId) {
    await claimTask(taskId, currentUser);
    await loadTasks();
  }

  async function handleUnclaim(taskId) {
    await unclaimTask(taskId);
    await loadTasks();
  }

  function openTask(taskId) {
    navigate(`/tasks/${taskId}`);
  }

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Task List</h2>

      {tasks.length === 0 && <p>No tasks available</p>}
<TableRow key={task.id}>
  <TableCell>{task.name}</TableCell>
  <TableCell>{task.assignee || "Unassigned"}</TableCell>

  <TableCell>

    {!task.assignee && (
      <ClaimTaskButton
        taskId={task.id}
        onSuccess={loadTasks}
      />
    )}

    {task.assignee && (
      <UnclaimTaskButton
        taskId={task.id}
        onSuccess={loadTasks}
      />
    )}

  </TableCell>

</TableRow>
      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Assignee</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.assignee || "Unassigned"}</td>
              <td>{new Date(task.created).toLocaleString()}</td>

              <td>
                {task.assignee === null && (
                  <button onClick={() => handleClaim(task.id)}>
                    Claim
                  </button>
                )}

                {task.assignee === currentUser && (
                  <>
                    <button onClick={() => openTask(task.id)}>
                      Open
                    </button>

                    <button onClick={() => handleUnclaim(task.id)}>
                      Unclaim
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}