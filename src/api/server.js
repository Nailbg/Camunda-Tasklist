// server.js
import express from "express";
import AWS from "aws-sdk";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// --- MinIO S3 client ---
const s3 = new AWS.S3({
  endpoint: "http://localhost:9000",
  accessKeyId: "admin",
  secretAccessKey: "password123",
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  region: "us-east-1",
});

// --- CORS middleware ---
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  next();
});

// --- 1️⃣ Generate pre-signed URL ---
app.post("/api/get-presigned-url", async (req, res) => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "Missing fileName or fileType" });
  }

  const key = `${Date.now()}-${fileName}`;
  const params = {
    Bucket: "camunda-files",
    Key: key,
    Expires: 300,
    ContentType: fileType,
  };

  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    const fileUrl = `http://localhost:9000/camunda-files/${key}`;
    res.json({ uploadUrl, fileUrl, key });
  } catch (err) {
    console.error("MinIO presigned URL error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- 2️⃣ Attach file metadata (UPDATED → supports arrays) ---
app.post("/api/attach-file", async (req, res) => {
  const { taskId, fileUrl, fileName } = req.body;

  if (!taskId || !fileUrl || !fileName) {
    return res.status(400).json({ error: "Missing taskId, fileUrl, or fileName" });
  }

  try {
    let existing = [];

    try {
      const response = await axios.get(
        `http://localhost:8080/engine-rest/task/${taskId}/variables/attachment`
      );

      existing = response.data.value
        ? JSON.parse(response.data.value)
        : [];
    } catch (e) {
      existing = [];
    }

    if (!Array.isArray(existing)) existing = [];

    const updated = [...existing, { fileName, fileUrl }];

    await axios.put(
      `http://localhost:8080/engine-rest/task/${taskId}/variables/attachment`,
      {
        value: JSON.stringify(updated),
        type: "String",
      }
    );

    res.json({ message: "File attached to task successfully" });
  } catch (err) {
    console.error("Camunda attach error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});

// --- 3️⃣ Generate download URL ---
app.get("/api/get-download-url", async (req, res) => {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "Missing key" });

  try {
    const url = await s3.getSignedUrlPromise("getObject", {
      Bucket: "camunda-files",
      Key: key,
      Expires: 300,
    });
    res.json({ url });
  } catch (err) {
    console.error("MinIO download URL error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Get files attached to a task (UPDATED) ---
app.get("/api/get-task-files", async (req, res) => {
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: "Missing taskId" });

  try {
    const response = await axios.get(
      `http://localhost:8080/engine-rest/task/${taskId}/variables/attachment`
    );

    const attachment = response.data.value
      ? JSON.parse(response.data.value)
      : [];

    const files = Array.isArray(attachment) ? attachment : [attachment];

    res.json({ files });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.json({ files: [] });
    }

    console.error("Error fetching task files:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// --- Download file ---
app.get("/api/download-file", async (req, res) => {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "Missing key" });

  try {
    const url = await s3.getSignedUrlPromise("getObject", {
      Bucket: "camunda-files",
      Key: key,
      Expires: 300,
    });
    res.json({ url });
  } catch (err) {
    console.error("MinIO download URL error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Delete file (UPDATED → supports arrays) ---
app.post("/api/delete-file", async (req, res) => {
  const { taskId, fileName } = req.body;

  try {
    const response = await axios.get(
      `http://localhost:8080/engine-rest/task/${taskId}/variables/attachment`
    );

    let files = response.data.value
      ? JSON.parse(response.data.value)
      : [];

    if (!Array.isArray(files)) files = [];

    const updated = files.filter((f) => f.fileName !== fileName);

    await axios.put(
      `http://localhost:8080/engine-rest/task/${taskId}/variables/attachment`,
      {
        value: JSON.stringify(updated),
        type: "String",
      }
    );

    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start server ---
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));