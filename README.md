frontend/
  src/
    api/
      client.js
    components/
      Navbar.jsx
      ProductCard.jsx
      Loader.jsx
    context/
      AuthContext.jsx
      CartContext.jsx
    pages/
      Home.jsx
      ProductDetails.jsx
      CartPage.jsx
      Login.jsx
      Register.jsx
      Checkout.jsx
    utils/
      auth.js
    App.jsx
    main.jsx


Epnic – Full Stack E-commerce App

A modern full-stack e-commerce web application built using **React (Frontend)** and **Django REST Framework (Backend)** with **JWT Authentication**.

##  Features

* User Authentication (Login / Signup with JWT)
* Product Listing & Details Page
* Add to Cart / Remove from Cart
* Update Product Quantity
* Checkout System (Order Placement)
* Protected Routes (Only logged-in users can checkout)
* Search Products
* Responsive UI (Tailwind CSS)

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router

### Backend

* Django
* Django REST Framework
* PostgreSQL

### Authentication

* JWT (JSON Web Tokens)

---

##  Project Structure

```
Ebay.com/
│
├── frontend/        # React App
├── backend/         # Django API
├── README.md
```

---

##  Setup Instructions

### 🔹 1. Clone Repository

```
git clone https://github.com/ZiaSaafir/Ebay.com.git
cd Ebay.com
```

---

### 🔹 2. Backend Setup (Django)

```
cd backend
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

pip install -r requirements.txt
```

#### Create `.env` file:

```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your_secret_key
```

#### Run server:

```
python manage.py migrate
python manage.py runserver
```

---

### 🔹 3. Frontend Setup (React)

```
cd frontend
npm install
npm run dev
```

---
---

## 🔒 Authentication

* Uses JWT tokens
* Stored in localStorage
* Protected routes for checkout

---

## 📸 Screenshots
<img width="1278" height="638" alt="image" src="https://github.com/user-attachments/assets/d0cdc34b-3f6d-4a9c-80a3-7a6efcadb3d9" />


## 🌐 Future Improvements

* Online Payment Integration (Stripe)
* Order History Page
* Admin Dashboard
* Product Reviews & Ratings

---

##  Author

**Ziaullah**
Computer Science Student | Full Stack Developer | Fast Univeristy

