📦 InvyPal – Smart Inventory Management
InvyPal is a modern inventory management system powered by Appwrite, designed to help businesses efficiently track products, stock levels, and sales in real time.
🚀 Problem Statement
Many businesses still rely on outdated inventory tracking (paper, spreadsheets), leading to stockouts, overstocking, and poor visibility into sales.
💡 Our Solution
InvyPal provides a simple, scalable, and real-time inventory platform where businesses can:
- Add, edit, and manage products.
- Track stock levels and receive low-stock alerts.
- View insights through an interactive dashboard.
- Collaborate with staff using secure role-based accounts.
🛠 Tech Stack
Frontend: React + Tailwind CSS
Backend: Appwrite (Auth, Database, Storage, Realtime, Functions)
📋 Features
✅ Authentication (Admin & Staff roles)
✅ Product management (CRUD)
✅ Real-time stock updates
✅ Dashboard with analytics & insights
🗂 Database Schema
Users: id, role, name, email
Products: id, name, companyId, quantity, price, category, image, createdAt, updatedAt
Compnies: id, name, ownerId, companylogo
🏗 Setup Guide
1. Clone repo & install dependencies.
2. Configure Appwrite (Auth, DB, Storage).
3. Add collections for Products & Transactions.
4. Run `npm run dev` to start local server.
🔮 Future Improvements
- Multi-branch/warehouse support
- Advanced analytics & forecasting
- Transactions 

⚡ Built with ❤️ as part of the InvyPal platform.
