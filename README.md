# Supabase Next.js Table

A **full-stack table UI** built with **Next.js (App Router)** and **Supabase** for database management. This project includes **CRUD operations, search, pagination, and notifications**.

---

## 🚀 Features

- **Next.js (App Router)** for SSR & API handling
- **Supabase** as a PostgreSQL database & backend
- **CRUD operations** (Create, Read, Update, Delete)
- **Search functionality** (works across all pages)
- **Pagination** with custom rows per page
- **Notifications** without WebSockets
- **Dynamic imports** for better performance

---

## 🛠️ Tech Stack

- **Frontend**: React (Next.js 14, Tailwind CSS)
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **State Management**: useState, useEffect
- **API Calls**: Axios

---

## 📂 Folder Structure

```
/project-root
│── components/         # Reusable UI components
│   ├── CreateEntryDialog.js  # Modal for creating entries
│   ├── EditEntryDialog.js    # Modal for editing entries
│   ├── ConfirmDeleteDialog.js # Modal for confirming deletions
│   ├── Notifications.js      # Handles UI notifications
│   ├── CustomPagination.js   # Pagination component
│── pages/api/         # API routes (Serverless functions)
│   ├── carData.js      # CRUD operations with Supabase
│   ├── notifications.js # Fetches notifications from Supabase
│── app/                # Next.js (App Router) structure
│   ├── page.js         # Main table UI
│── utils/              # Utility functions (if needed)
│── styles/             # Global styles (if needed)
│── .env.local          # Environment variables
│── README.md           # Project documentation
```

---

## 🏗️ Setup & Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/Anwar-3108/supabase-next-dashboard.git
cd supabase-next-table
```

### 2️⃣ Install Dependencies

```sh
yarn install   # or npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env.local` file and add your Supabase credentials:

```sh
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4️⃣ Run Development Server

```sh
yarn dev   # or npm run dev
```

Access the app at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔗 API Endpoints

### **1️⃣ Get All Entries**

```http
GET /api/carData?page=1&limit=10&search=example
```

Response:

```json
{
  "data": [{ "id": 1, "expense_name": "Oil Change", "total": 200 }],
  "total": 1
}
```

### **2️⃣ Create Entry**

```http
POST /api/carData
```

Request Body:

```json
{
  "expense_name": "Tire Replacement",
  "total": 500
}
```

### **3️⃣ Update Entry**

```http
PUT /api/carData/{id}
```

### **4️⃣ Delete Entry**

```http
DELETE /api/carData/{id}
```

### **5️⃣ Fetch Notifications**

```http
GET /api/notifications
```

---

## 🔍 Search Implementation

- **If searching:** Only `searchQuery` is sent (ignores pagination)
- **Otherwise:** `page` and `limit` are included

```js
const fetchInvoices = async () => {
  try {
    const params = searchQuery ? { search: searchQuery } : { page: currentPage, limit: rowsPerPage };
    const response = await axios.get('/api/carData', { params });
    setInvoices(response.data?.data || []);
    setTotalInvoices(response?.data?.total || 0);
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
};
```

---

## 🚀 Deployment

### **1️⃣ Deploy to Vercel**

```sh
vercel deploy
```

### **2️⃣ Deploy Supabase Backend**

- Go to **Supabase Dashboard** → **Database** → **SQL Editor**
- Run the schema migration script for `carData`

```sql
CREATE TABLE carData (
  id SERIAL PRIMARY KEY,
  expense_name TEXT NOT NULL,
  total DECIMAL NOT NULL
);
```

---

## 📜 License

This project is **MIT licensed**. Feel free to use and modify it.



