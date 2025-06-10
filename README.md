# 📝 Mini Commenting Platform – Intern Assignment

## 🚀 Objective

This project is designed as part of an intern assignment to demonstrate your ability to work with a full-stack application, apply newly learned tools, and communicate your development process. It emphasizes **problem-solving** over perfection.

---

## 🧩 What You’ll Build

A simple full-stack web application that simulates a commenting system with features like nested replies, login, and comment interactions.

---

## 🛠️ Tech Stack

- **Frontend**: Angular
- **Backend**: FastAPI
- **Database**: MySQL  
  *(Supabase or MongoDB can be optionally used if free tier is available)*

---

## 🎯 Features

### 🔐 Frontend (Angular)

- ✅ Dummy login screen (accepts any credentials)
- ✅ Display list of comments (up to 2 nested levels)
- ✅ Add new comment or reply to existing comments
- ✅ Delete your own comment
- ✅ Basic form validations (e.g., required text)
- 🔼 Optional: Upvote/Downvote UI (Frontend only, no backend)

### 🔙 Backend (FastAPI)

- `POST /login`  
  ➤ Returns a dummy token for authentication simulation

- `GET /comments`  
  ➤ Fetches comments from MySQL or fallback mock data

- `POST /comments`  
  ➤ Adds a new comment to the database

- `DELETE /comments/:id`  
  ➤ Deletes a comment by its ID

- 💾 Comments stored in:
  - MySQL (preferred)
  - OR fallback to in-memory data if DB setup isn't available

---

## 🧪 How to Run

### 📦 Backend (FastAPI)

1. Install dependencies:
    ```bash
    pip install fastapi uvicorn sqlalchemy mysql-connector-python
    ```

2. Run the server:
    ```bash
    uvicorn main:app --reload
    ```

### 🌐 Frontend (Angular)

1. Install dependencies:
    ```bash
    npm install
    ```

2. Start Angular app:
    ```bash
    ng serve
    ```

---

## 💡 Bonus Ideas

- Upvote/downvote buttons
- Reply count indicators
- Sort by newest/oldest

---

## 📁 Folder Structure (Example)


  
