# Mini Q&A App (MERN Stack)

## 📌 Project Overview
This is a **Mini Q&A Web Application** built using the **MERN stack** (MongoDB, Express, React, Node.js).  
The app allows team members to **ask questions**, others to **answer questions**, and managers to **create insights**.  

### Features:
- User authentication & authorization (Member & Manager roles)
- Ask and answer questions
- Tagging system for questions
- Managers can create insights per question
- Search & filter questions by title or tags
- CRUD operations for questions, answers, and insights
- Clean, responsive UI with React and Tailwind CSS

### Tech Stack:
- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Authentication
- **Authentication:** JSON Web Token (JWT)
- **State Management:** React `useState`, `useEffect` hooks
- **Styling:** Tailwind CSS

---

## 🛠 Backend Setup

1. Clone the repository and navigate to the backend folder:

```bash
cd backend

2. Install dependencies:
npm install

3. Create a .env file in the backend folder with the following content:
PORT=8080
mongoDB_URL_ENV='your MongoDB connection URL'
JWT_SECRET='your_secret_key'

4. Start the backend server:
npm run dev or npm start

```

##  🛠 Frontend Setup

``` bash
1. cd frontend

2. Install dependencies:
npm install

3. Start the backend server:
npm run dev
