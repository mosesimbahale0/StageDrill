# 🚀 Node.js App — Dockerized with Bitnami Base Image

This project demonstrates how to containerize a Node.js application using the **Bitnami Node.js** image for a secure and production-ready setup.

---

## 🧩 Overview

This multi-stage Docker build includes:

1. **Base Stage** — Bitnami Node.js image (latest or specific version).
2. **Deps Stage** — Installs dependencies (`npm install`).
3. **Build Stage** — Builds your Node.js app (`npm run build`).
4. **Production Stage** — Runs only the production artifacts to reduce image size.

---

## 📦 Prerequisites

Before you start, ensure you have:

- [Docker](https://docs.docker.com/get-docker/) installed (version 20+ recommended)
- [Node.js](https://nodejs.org/) installed locally (optional, for local testing)
- Your project contains:
  - `package.json` and `package-lock.json`
  - A build script in `package.json`, e.g.:
    ```json
    "scripts": {
      "build": "tsc"          // or next build / react-scripts build etc.
    }
    ```

---

## 🏗️ Build the Docker Image

Run the following command in the project root (where your Dockerfile lives):

```bash
docker build -t my-node-app .

```

## 💡 Tip: You can specify a version tag, e.g. -t my-node-app:v1.0.0

# ▶️ Run the Container Locally

- Start the container with:

```
docker run -d -p 4000:4000 \
  -e "MONGODB_ATLAS_PRODUCTION_URI=" \
  -e "NODE_ENV=production" \
  --name my-node-app \
  my-node-app

```

This maps port 4000 from the container to your local machine.

- Check Logs

```
  docker logs -f my-node-app
```

# Stop and Remove Container

```
docker stop my-node-app
docker rm my-node-app
```

docker run -d -p 8080:8080 \ -e "MONGODB_ATLAS_PRODUCTION_URI=" \
 -e "NODE_ENV=production" \
 -e "NODE_ENV=production" \
 -e "NODE_ENV=production" \

 -e "NODE_ENV=production" \
 -e "NODE_ENV=production" \
 -e "NODE_ENV=production" \
 -e "NODE_ENV=production" \
 -e "NODE_ENV=production" \
 -e "NODE_ENV=production" \

--name my-node-app \
 my-remix-app
