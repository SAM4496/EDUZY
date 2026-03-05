# 🎓 Eduzy — Smart College Management System

> **CE 5E Group 3 | React + Node.js + AWS DynamoDB**

---

## 📁 Project Structure

```
eduzy/
├── src/              # React Frontend
│   ├── components/
│   ├── pages/
│   └── ...
├── backend/          # Node.js + Express Backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── .env.example  # Copy this to .env and fill in your values
│   └── server.js
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- npm (comes with Node.js)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SAM4496/CE_5E_GRP3_SMART_CLG_SYSTEM_EDUZY.git
cd CE_5E_GRP3_SMART_CLG_SYSTEM_EDUZY
```

### 2. Switch to Your Branch

Each team member works on their assigned branch:

| Team Member | Branch           | Responsibility         |
|-------------|------------------|------------------------|
| Samarth     | `main` / `backend` | Backend, AWS, DynamoDB |
| Member 2    | `admin-panel`    | Admin Panel UI         |
| Member 3    | `faculty-panel`  | Faculty Panel UI       |
| Member 4    | `student-panel`  | Student Panel UI       |

```bash
# Switch to your branch (example for admin-panel)
git checkout admin-panel
```

### 3. Install Frontend Dependencies

```bash
# From the root folder
npm install
```

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

### 5. Set Up Environment Variables

> ⚠️ **IMPORTANT:** Never push `.env` files to GitHub!

```bash
# Inside the backend/ folder, copy the example file
cp .env.example .env
```

Then open `backend/.env` and fill in the values provided by Samarth privately:

```env
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
AWS_REGION=ap-south-1
PORT=5000
```

> 🔐 **AWS credentials are only provided by Samarth. Do NOT share them.**

### 6. Run the Backend

```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:5000`

### 7. Run the Frontend

```bash
# From root folder
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🌿 Branch Workflow (For Team Members)

### Before You Start Working (Every Session)

```bash
# Make sure you're on your branch
git checkout your-branch-name

# Pull latest changes from main
git pull origin main
```

### Saving Your Work

```bash
# Stage your changes
git add .

# Commit with a clear message
git commit -m "feat: add admin dashboard table component"

# Push to your branch
git push origin your-branch-name
```

### Submitting Work to Samarth (Pull Request)

1. Go to [GitHub Repository](https://github.com/SAM4496/CE_5E_GRP3_SMART_CLG_SYSTEM_EDUZY)
2. Click **"Compare & pull request"** for your branch
3. Set **base: main** ← **compare: your-branch**
4. Add a clear title and description of what you built
5. Click **"Create pull request"**
6. Wait for Samarth to review and merge ✅

---

## 📌 Commit Message Format

Use clear, descriptive commit messages:

```
feat: add student attendance table
fix: correct login redirect bug
ui: update navbar styling
refactor: clean up faculty form code
```

---

## ⚠️ Important Rules

- ❌ **Never push `.env` or `node_modules/`**
- ❌ **Never push directly to `main`**
- ✅ Always work on your assigned branch
- ✅ Always pull from `main` before starting new work
- ✅ Raise a Pull Request when your feature is ready
- ✅ Contact Samarth for any backend/AWS API changes

---

## 🔗 Tech Stack

| Layer     | Technology                   |
|-----------|------------------------------|
| Frontend  | React.js                     |
| Backend   | Node.js + Express            |
| Database  | AWS DynamoDB (ap-south-1)    |
| Auth      | JWT / AWS Cognito (TBD)      |
| Hosting   | AWS (managed by Samarth)     |

---

## 📞 Contact

**Samarth Deshmukh** — Project Lead & Backend Dev  
GitHub: [@SAM4496](https://github.com/SAM4496)
