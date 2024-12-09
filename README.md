# **PostApp**

A feature-rich MERN stack web application that allows users to explore the latest posts, create accounts, manage their profiles, edit or update their posts, and upload images. During registration, users can choose an image for their profile. The app incorporates modern authentication techniques using **Refresh Tokens** and **Access Tokens** for secure user management.

### **Live Demo**  
🌐 [PostApp Live](https://postapp01.vercel.app/)  

---

## **Features**
- **User Authentication**:  
  Secure login and registration system with token-based authentication.
  
- **Profile Management**:  
  Each user can manage their profile, view personalized information, and upload a profile image during registration.

- **Post Management**:  
  - Create, edit, and delete personal posts.  
  - View the latest posts from other users in real-time.

- **Image Upload with Preview**:  
  Users can upload images to associate them with their posts and profile, with a preview feature before uploading.

- **Secure Authentication**:  
  Uses **Refresh Tokens** and **Access Tokens** for robust session management.

- **MERN Stack**:  
  Built with:
  - **MongoDB**: Database to store user, post, and image data.
  - **Express.js**: Backend framework for API creation.
  - **React.js (with Vite)**: Frontend library for dynamic user interfaces.
  - **Node.js**: Runtime for server-side execution.

- **Deployment**:  
  Fully deployed using **Vercel** for frontend and backend hosting.

---

## **Tech Stack**
### **Frontend**
- React.js (with Vite)
- Tailwind CSS (for styling)
- Axios (for API calls)
- React Router DOM (v6.4 for routing)
- Custom image upload with preview functionality

### **Backend**
- Node.js
- Express.js
- MongoDB (Mongoose for schema modeling)
- JSON Web Tokens (JWT) for authentication
- Multer (for image uploads)

---

## **Getting Started**
Follow these instructions to run the project locally.

### **Prerequisites**
- Node.js (v14 or later)
- MongoDB (local or cloud-based)

### **Installation**
1. **Clone the Repository**
   ```bash
   git clone https://github.com/JawadErfani01/postApp.git
   cd postApp
   
2. **Install Dependencies**
- Backend
    ```bash
    cd backend
    npm install
- Frontend
     ```bash
    cd frontend
    npm install
---


###  Run the Application
- Backend
    ```bash
    cd backend
    npm run start
- Frontend
     ```bash
    cd frontend
    npm run dev
---
### Contributing
Contributions are welcome!

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
---

### Environment Variables
Backend: Create a `.env` file in the backend folder and add the following example:

  ```bash
# Server Port
PORT=8000

# JWT Secrets for Authentication
JWT_SECRET=yourSecretKeyHere
JWT_REFRESH_SECRET=yourRefreshSecretKeyHere

# JWT Expiration Times
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Bcrypt Salt Rounds
BCRYPT_SALT_ROUNDS=10

# Set the environment for deployment
NODE_ENV=production

# MongoDB URI (replace with your actual MongoDB connection string)
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.yourCluster.mongodb.net/yourDatabase?retryWrites=true&w=majority

# Cloudinary API Credentials (replace with your actual Cloudinary details)
CLOUD_NAME=yourCloudNameHere
CLOUDINARY_API_KEY=yourCloudinaryApiKeyHere
CLOUDINARY_API_SECRET=yourCloudinaryApiSecretHere.
