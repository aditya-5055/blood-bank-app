# 🩸 Blood Bank Management System

A full-stack web application that helps users find blood donors, request blood in emergencies, and manage donation activities efficiently.

---

## 🌐 Live Demo

Coming soon...

---

## 🚀 Features

- 🔍 Search and find blood donors
- 📝 Send and manage blood requests
- 👤 User authentication (Signup/Login)
- 🏥 Donor profile management
- 📊 Track donation history
- 🚨 Emergency blood request alerts

---

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT  

---

## 📂 Project Structure


blood-bank/
│── client/ # Frontend (React)
│── server/ # Backend (Node + Express)
│── .env.example # Environment variables template
│── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/blood-bank.git
cd blood-bank
2️⃣ Install dependencies
# Install frontend
cd client
npm install

# Install backend
cd ../server
npm install
3️⃣ Setup environment variables

Create a .env file inside the server folder and add:

PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email
MAIL_PASS=your_email_password
4️⃣ Run the project
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev
🌐 Usage
Open browser and go to:
http://localhost:5173
Register or login
Search for donors or request blood
📌 Future Improvements
 
🔔 Real-time notifications
📱 Mobile application
🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

👨‍💻 Author

Aditya Nalkande