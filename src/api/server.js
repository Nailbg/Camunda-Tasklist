// server.js (ES Modules)
import express from "express";
import AWS from "aws-sdk";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// --- MinIO S3 client ---
const s3 = new AWS.S3({
  endpoint: "http://localhost:9000", // MinIO URL
  accessKeyId: "admin",
  secretAccessKey: "password123",
  s3ForcePathStyle: true, // important for MinIO
  signatureVersion: "v4",
  region: "us-east-1",
});

// 1️⃣ Generate pre-signed URL
app.post("/api/get-presigned-url", async (req, res) => {
  const { fileName, fileType } = req.body;

  const key = `${Date.now()}-${fileName}`;
  const params = {
    Bucket: "camunda-files",
    Key: key,
    Expires: 60, // 60 seconds
    ContentType: fileType,
  };

  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    const fileUrl = `http://localhost:9000/camunda-files/${key}`;
    res.json({ uploadUrl, fileUrl, key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ Attach file metadata to Camunda task
app.post("/api/attach-file", async (req, res) => {
  const { taskId, fileUrl, fileName } = req.body;

  try {
    await axios.post(
      `http://localhost:8080/engine-rest/task/${taskId}/variables`,
      {
        attachment: {
          value: JSON.stringify({ fileName, fileUrl }),
          type: "String",
        },
      }
    );
    res.json({ message: "File attached to task" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional: generate download URL
app.get("/api/get-download-url", async (req, res) => {
  const { key } = req.query;
  try {
    const url = await s3.getSignedUrlPromise("getObject", {
      Bucket: "camunda-files",
      Key: key,
      Expires: 60,
    });
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Use port 5001 (avoiding macOS AirTunes on 5000)
app.listen(5001, () => console.log("Server running on port 5001"));