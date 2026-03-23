const BASE_URL = "/engine-rest";

export async function fetchTasks(userId) {
  const response = await fetch(`${BASE_URL}/task?candidateUser=${userId}&sortBy=created&sortOrder=desc`);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return await response.json();
}

export async function claimTask(taskId, userId) {
  const response = await fetch(`${BASE_URL}/task/${taskId}/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  if (!response.ok) throw new Error("Failed to claim task");
}

export async function unclaimTask(taskId) {
  const response = await fetch(`${BASE_URL}/task/${taskId}/unclaim`, {
    method: "POST"
  });

  if (!response.ok) throw new Error("Failed to unclaim task");
}
export async function camundaFetch(url, options = {}, user) {
  const authHeader = "Basic " + btoa(user.username + ":" + user.password);

  return fetch(`/engine-rest${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: authHeader
    }
  });
}