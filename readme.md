# StreamForge – Video Streaming Backend Service

StreamForge is a backend service designed for secure video upload, storage, and streaming.  
It provides REST APIs for user authentication, video management, and efficient media delivery, following clean backend architecture and industry best practices.

This project focuses purely on backend engineering concerns such as authentication, file handling, cloud storage integration, and streaming performance.

---

## ✨ Features

- Secure user authentication using JWT
- Video upload with cloud-based storage
- Media streaming support for large video files
- RESTful API design
- Centralized error handling
- Scalable and modular backend architecture

---

## 🏗️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload Handling:** Multer
- **Cloud Storage:** Cloudinary
- **Environment Management:** dotenv

---

## 🔐 Authentication Flow

- User registration and login APIs
- JWT-based authentication for protected routes
- Secure password handling
- Middleware-based route protection

---

## 📁 Video Upload & Storage

- Videos are uploaded via multipart/form-data requests
- Multer handles file parsing and temporary storage
- Uploaded videos are stored securely in Cloudinary
- Only metadata is persisted in the database
- Large file uploads are handled efficiently

---

## 📡 Video Streaming

- Videos are streamed directly from cloud storage
- Optimized for progressive playback
- Designed to handle large media files with minimal backend overhead

---

## 📂 Project Structure

