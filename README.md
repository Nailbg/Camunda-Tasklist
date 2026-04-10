# Camunda Frontend UI (React + Vite + Node.js)

A full-stack application that provides a modern frontend interface for interacting with a Camunda workflow engine. The project combines a React (Vite) frontend with a Node.js backend and integrates with S3-compatible storage (MinIO or AWS S3).

---

## 📦 Project Overview

This application acts as a custom UI layer for Camunda, enabling users to:

* Start and manage workflow processes
* View and complete tasks
* Render and submit dynamic forms
* Upload and manage files associated with workflows
* Interact with backend APIs for orchestration

The Node.js backend serves as a bridge between the frontend, Camunda REST API, and object storage.

---

## 🏗️ Architecture

```text
React (Vite) Frontend (src/App.jsx)
        │
        ▼
Node.js Backend (src/api/server.js)
   ├── Camunda REST API
   └── S3-Compatible Storage (MinIO / AWS S3)
```

---

## 📁 Project Structure

```text
root/
├── src/
│   ├── App.jsx              # Main React application
│   ├── main.jsx             # Vite entry point
│   ├── components/          # UI components
│   ├── pages/               # Views (task list, forms, etc.)
│   ├── forms/               # Custom form schemas (JSON-like)
│   │   ├── index.jsx        # Form registry
│   │   └── bid_qualification.jsx
│   ├── api/
│   │   └── server.js        # Node.js backend & APIs
│   └── ...
├── public/
├── package.json
├── vite.config.js
└── README.md
```

> The backend (`src/api/server.js`) runs separately from the frontend dev server.

---

## ⚙️ Prerequisites

* Node.js (v18+ recommended)
* npm or yarn
* Docker (for Camunda)
* (Optional) AWS account for S3

---

## 🐳 Running Camunda

Camunda is **not included in this repository** and must be run separately.

### Quick start with Docker

```bash
docker run -d --name camunda \
  -p 8080:8080 \
  camunda/camunda-bpm-platform:run-latest
```

* Cockpit: http://localhost:8080/camunda
* REST API: http://localhost:8080/engine-rest

---

## 🔐 Login Instructions

Use the default Camunda credentials:

```text
Username: demo
Password: demo
```

These credentials are required to:

* Authenticate against the Camunda engine
* Retrieve and complete tasks
* Build and display the task list in the UI

> Ensure your Camunda instance has the demo user enabled.

---

## 🗄️ File Storage Setup

### Option A: MinIO (Local)

```bash
docker run -d -p 9000:9000 -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  quay.io/minio/minio server /data --console-address ":9001"
```

* API: http://localhost:9000
* Console: http://localhost:9001

Create a bucket (e.g., `camunda-files`).

---

### Option B: AWS S3

Provide:

* Access Key
* Secret Key
* Region
* Bucket name

---

## 🔧 Backend Setup (Node.js)

Location:

```text
src/api/server.js
```

### Install dependencies

```bash
npm install
```

### Environment Variables

Create `.env` in root:

```env
PORT=5000

CAMUNDA_BASE_URL=http://localhost:8080/engine-rest

S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=camunda-files
S3_FORCE_PATH_STYLE=true
```

### Run backend

```bash
node src/api/server.js
```

Backend runs on: `http://localhost:5000`

---

## 💻 Frontend Setup (React + Vite)

### Install dependencies

```bash
npm install
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CAMUNDA_BASE_URL=http://localhost:8080/engine-rest
```

### Run frontend

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🧩 Forms System

The application uses **custom JSON-based form schemas** that closely mirror Camunda forms.

### 📌 Key Concepts

* Forms are stored in: `src/forms/`
* Each form exports a `formSchema`
* Forms must be registered in `src/forms/index.jsx`
* The `formName` must match the Camunda form key to render correctly in tasks

---

### 📝 Registering a Form

Example (`src/forms/index.jsx`):

```javascript
import { formSchema as bidQualificationForm } from "./bid_qualification";

export const formRegistry = {
  [bidQualificationForm.formName]: bidQualificationForm,
};
```

---

### 🧾 Example Form

Example: `bid_qualification.jsx`

* Defines a schema using JSON structure
* Includes standard field types (`textfield`, `select`, `radio`, etc.)
* Supports custom type: `fileupload`

```javascript
export const formSchema = {
  formName: "bid_qualification",
  name: "Bid Qualification",
  components: [
    {
      label: "Client Name",
      type: "textfield",
      key: "textfield_sfk9k",
      validate: { required: true }
    },
    ...
    {
      label: "File test",
      type: "fileupload",
      key: "attachment"
    }
  ]
};
```

---

### 📂 File Upload Support

* Use `"type": "fileupload"` in form schema
* Files are sent to the backend
* Backend uploads to MinIO or AWS S3
* Stored file references can be attached to Camunda process variables

---

### ⚠️ Important Notes

* Form `formName` **must match** the Camunda task form key
* If not registered, tasks will not render properly in the UI
* Forms are not fetched dynamically—they must be defined locally

---

## 🔄 Application Flow

1. User logs in (`demo/demo`)
2. Task list is fetched from Camunda
3. Matching form is resolved via `formRegistry`
4. Form is rendered dynamically in React
5. On submit:

   * Data → Node.js backend
   * Files → S3/MinIO
   * Process variables → Camunda

---

## 🚀 Scripts

```bash
npm run dev       # Start frontend
npm run build     # Build frontend
npm run preview   # Preview build
```

---

## 🧪 Troubleshooting

### No tasks visible

* Ensure Camunda is running
* Confirm login credentials (`demo/demo`)
* Verify tasks exist for the user

### Form not rendering

* Check `formName` matches Camunda form key
* Ensure form is registered in `formRegistry`

### File upload failing

* Verify S3/MinIO config
* Ensure bucket exists

### CORS issues

* Enable CORS in `server.js`

---

## 📌 Future Improvements

* Authentication & role management
* Dynamic form fetching from Camunda
* Workflow visualization
* Deployment setup

---

## 📄 License

MIT
