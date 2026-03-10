import "./App.css";
import React, { useEffect, useState } from "react";
import { formRegistry } from "./forms/index";
import DynamicForm from "./DynamicForm";

export default function App() {
  const [taskId, setTaskId] = useState("");
  const [formSchema, setFormSchema] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const taskIdParam = params.get("taskId") || "";
    setTaskId(taskIdParam);

    if (!taskIdParam) {
      console.error("No taskId provided in URL");
      setLoading(false);
      return;
    } else{
      console.log("Found taskId in URL:", taskIdParam);
    }

    // Fetch task info from Camunda
    fetch(`/engine-rest/task/${taskIdParam}`)
      .then((res) => {
        console.log("Fetched task info, status:", res
        );
        if (!res.ok) throw new Error("Failed to fetch task info");
        return res.json();
      })
      .then((task) => {
        console.log("Loaded task info:", task);
        const schema = formRegistry[task.taskDefinitionKey];
        if (!schema) {
          console.error(
            "No form schema found for taskDefinitionKey:",
            task.taskDefinitionKey
          );
        }
        setFormSchema(schema || null);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading form...</div>;
  if (!formSchema) return <div>No form available for this task.</div>;

  return <DynamicForm schema={formSchema} taskId={taskId} />;
}