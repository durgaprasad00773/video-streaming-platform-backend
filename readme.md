#StreamForge – Video Streaming Backend Service
[Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)


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
- 
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

src/
 ├── controllers/   # Request handling logic
 ├── routes/        # API route definitions
 ├── models/        # Database schemas
 ├── middlewares/   # Auth & error handling middleware
 ├── utils/         # Helper utilities
 ├── config/        # Configuration files
 ├── index.js       # Entry point
 └── app.js         # Express app initialization




## 🚀 API Endpoints (Sample)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Videos
- `POST /api/videos/upload` (Protected)
- `GET /api/videos`
- `GET /api/videos/:id/stream`

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js
- MongoDB
- Cloudinary account

### Environment Variables
This project uses a `.env` file to store sensitive configuration.  
Create a `.env` file in the root directory (refer to `.env.example` for placeholders):

```
.env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=*
```
```
git clone https://github.com/durgaprasad00773/video-streaming-backend.git
cd video-streaming-backend
npm install
```

npm run dev   # for development

📄 License

This project is licensed under the MIT License.
See the LICENSE
