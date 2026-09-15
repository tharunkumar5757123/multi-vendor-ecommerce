A full-stack multi-vendor e-commerce platform built using the MERN stack.

MultiShop allows customers to browse and purchase products from multiple sellers, while sellers can manage their products and orders. Administrators can manage users, products, categories, and orders through a dedicated admin dashboard.

---

## 🚀 Live Project

### Frontend

https://multi-vendor-ecommerce-eight-lovat.vercel.app/

### Backend API

https://multi-vendor-ecommerce-hxth.onrender.com

---

## 📌 Features

### 👤 Customer Features

- User registration and login
- JWT-based authentication
- Browse products
- Search products
- Filter products by category
- Filter products by price
- Sort products
- View product details
- Add products to cart
- Update cart quantity
- Remove products from cart
- Clear cart
- Wishlist management
- Add products to wishlist
- Remove products from wishlist
- Manage delivery addresses
- Set default delivery address
- Checkout
- Cash on Delivery
- Stripe online payment
- View order history
- View order details
- Track order status
- Cancel eligible orders
- Submit product reviews
- Update reviews
- Delete reviews
- View product ratings
- Manage customer profile

---

## 🛍️ Seller Features

- Seller authentication
- Seller dashboard
- View seller statistics
- Add products
- Edit products
- Delete products
- Upload multiple product images
- Cloudinary image upload
- Manage product stock
- Activate/deactivate products
- View seller products
- View seller orders
- Update order status
- Track seller revenue
- Track total products
- Track active products
- Track pending orders
- Track delivered orders

---

## 🛠️ Admin Features

- Admin authentication
- Admin dashboard
- View platform statistics
- Manage users
- Activate/deactivate users
- Manage products
- View product details
- Activate/deactivate products
- Delete products
- Manage categories
- Create categories
- Edit categories
- Delete categories
- Activate/deactivate categories
- View all orders
- View order details
- View recent orders
- View total revenue
- Manage the overall platform

---

# 🔐 Authentication & Authorization

The application uses JWT-based authentication.

There are three user roles:

    Customer
    Seller
    Admin

Role-based authorization controls access to different sections of the application.

    Customer
       ↓
    Customer Shopping Features

    Seller
       ↓
    Seller Dashboard / Product & Order Management

    Admin
       ↓
    Admin Dashboard / Platform Management

Passwords are securely hashed using bcrypt.

JWT tokens are used to authenticate protected API requests.

---

# 💳 Payment Integration

Stripe Checkout is integrated for online payments.

The application supports:

    Cash on Delivery
    Stripe Online Payment

### Stripe Payment Flow

    Customer
        ↓
    Cart
        ↓
    Checkout
        ↓
    Create Order
        ↓
    Create Stripe Checkout Session
        ↓
    Stripe Checkout
        ↓
    Customer Completes Payment
        ↓
    Stripe Webhook
        ↓
    Update Payment Status
        ↓
    Payment Success Page
        ↓
    Orders

The Stripe webhook is responsible for confirming the payment on the backend.

The frontend does not directly mark an order as paid.

---

# ☁️ Image Upload

Product images are handled using:

- Multer
- Cloudinary

The application supports multiple images per product.

    Maximum Images: 5
    Maximum File Size: 5 MB per image

Only image files are accepted.

---

# 🧰 Tech Stack

## Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer

## Third-Party Services

- Stripe
- Cloudinary
- MongoDB Atlas

## Development Tools

- Git
- GitHub
- VS Code
- Postman
- MongoDB Atlas
- Render
- Vercel

---

# 📁 Project Structure

    multi-vendor-ecommerce/
    │
    ├── backend/
    │   │
    │   ├── src/
    │   │   │
    │   │   ├── config/
    │   │   │   ├── db.js
    │   │   │   ├── cloudinary.js
    │   │   │   └── stripe.js
    │   │   │
    │   │   ├── controllers/
    │   │   │   ├── authController.js
    │   │   │   ├── userController.js
    │   │   │   ├── productController.js
    │   │   │   ├── categoryController.js
    │   │   │   ├── cartController.js
    │   │   │   ├── orderController.js
    │   │   │   ├── paymentController.js
    │   │   │   ├── webhookController.js
    │   │   │   ├── sellerController.js
    │   │   │   ├── reviewController.js
    │   │   │   ├── addressController.js
    │   │   │   ├── adminController.js
    │   │   │   └── wishlistController.js
    │   │   │
    │   │   ├── models/
    │   │   │   ├── User.js
    │   │   │   ├── Product.js
    │   │   │   ├── Category.js
    │   │   │   ├── Cart.js
    │   │   │   ├── Order.js
    │   │   │   ├── Review.js
    │   │   │   ├── Address.js
    │   │   │   └── Wishlist.js
    │   │   │
    │   │   ├── routes/
    │   │   │   ├── authRoutes.js
    │   │   │   ├── userRoutes.js
    │   │   │   ├── productRoutes.js
    │   │   │   ├── categoryRoutes.js
    │   │   │   ├── cartRoutes.js
    │   │   │   ├── orderRoutes.js
    │   │   │   ├── paymentRoutes.js
    │   │   │   ├── sellerRoutes.js
    │   │   │   ├── reviewRoutes.js
    │   │   │   ├── addressRoutes.js
    │   │   │   ├── adminRoutes.js
    │   │   │   └── wishlistRoutes.js
    │   │   │
    │   │   ├── middleware/
    │   │   │   ├── authMiddleware.js
    │   │   │   ├── roleMiddleware.js
    │   │   │   ├── errorMiddleware.js
    │   │   │   └── uploadMiddleware.js
    │   │   │
    │   │   ├── utils/
    │   │   │   ├── generateToken.js
    │   │   │   ├── generateSlug.js
    │   │   │   ├── uploadToCloudinary.js
    │   │   │   └── deleteFromCloudinary.js
    │   │   │
    │   │   └── app.js
    │   │
    │   ├── server.js
    │   ├── package.json
    │   ├── .env
    │   └── .gitignore
    │
    ├── frontend/
    │   │
    │   ├── public/
    │   │   └── multishop.svg
    │   │
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── ProductCard.jsx
    │   │   │   ├── ProductGrid.jsx
    │   │   │   ├── SearchBar.jsx
    │   │   │   ├── CategoryCard.jsx
    │   │   │   ├── Rating.jsx
    │   │   │   ├── Loader.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   ├── WishlistLoader.jsx
    │   │   │   ├── AddressForm.jsx
    │   │   │   ├── AdminSidebar.jsx
    │   │   │   └── AdminLayout.jsx
    │   │   │
    │   │   ├── pages/
    │   │   │   ├── Home.jsx
    │   │   │   ├── Products.jsx
    │   │   │   ├── ProductDetails.jsx
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   ├── Cart.jsx
    │   │   │   ├── Checkout.jsx
    │   │   │   ├── Orders.jsx
    │   │   │   ├── OrderDetails.jsx
    │   │   │   ├── Wishlist.jsx
    │   │   │   ├── Profile.jsx
    │   │   │   ├── Unauthorized.jsx
    │   │   │   ├── PaymentSuccess.jsx
    │   │   │   ├── PaymentCancelled.jsx
    │   │   │   │
    │   │   │   ├── seller/
    │   │   │   │   ├── SellerDashboard.jsx
    │   │   │   │   ├── SellerProducts.jsx
    │   │   │   │   ├── SellerAddProduct.jsx
    │   │   │   │   ├── SellerEditProduct.jsx
    │   │   │   │   └── SellerOrders.jsx
    │   │   │   │
    │   │   │   └── admin/
    │   │   │       ├── AdminDashboard.jsx
    │   │   │       ├── AdminUsers.jsx
    │   │   │       ├── AdminProducts.jsx
    │   │   │       ├── AdminProductDetails.jsx
    │   │   │       ├── AdminOrders.jsx
    │   │   │       └── AdminCategories.jsx
    │   │   │
    │   │   ├── redux/
    │   │   │   ├── store.js
    │   │   │   └── slices/
    │   │   │       ├── authSlice.js
    │   │   │       ├── productSlice.js
    │   │   │       ├── cartSlice.js
    │   │   │       ├── orderSlice.js
    │   │   │       └── wishlistSlice.js
    │   │   │
    │   │   ├── services/
    │   │   │   └── api.js
    │   │   │
    │   │   ├── App.jsx
    │   │   ├── main.jsx
    │   │   └── index.css
    │   │
    │   ├── package.json
    │   ├── .env
    │   └── .gitignore
    │
    └── README.md

---

# 🗄️ Database Models

MongoDB and Mongoose are used for database management.

Main models:

    User
    Product
    Category
    Cart
    Order
    Review
    Address
    Wishlist

## User

Stores:

- Name
- Email
- Password
- Role
- Phone
- Profile image
- Account status

## Product

Stores:

- Product name
- Brand
- Description
- SKU
- Price
- Discount price
- Images
- Category
- Seller
- Stock
- Rating
- Number of reviews
- Active status

## Category

Stores:

- Category name
- Description
- Image
- Active status

## Cart

Stores:

- Customer
- Products
- Quantities

## Order

Stores:

- Customer
- Products
- Seller
- Quantity
- Product price
- Shipping address
- Subtotal
- Shipping price
- Tax
- Total amount
- Payment method
- Payment status
- Order status
- Payment date
- Delivery date

## Review

Stores:

- Customer
- Product
- Rating
- Comment

## Address

Stores:

- Customer
- Full name
- Phone
- Address
- City
- State
- Postal code
- Country
- Default address

## Wishlist

Stores:

- Customer
- Wishlist products

---

# 🔗 API Routes

## Authentication

    POST   /api/auth/register
    POST   /api/auth/login

## Products

    GET    /api/products
    GET    /api/products/:id

    POST   /api/products
    PUT    /api/products/:id
    DELETE /api/products/:id

    PUT    /api/products/:id/status

    GET    /api/products/admin/all
    GET    /api/products/seller/my-products

## Categories

    GET    /api/categories
    GET    /api/categories/admin/all

    POST   /api/categories
    PUT    /api/categories/:id
    DELETE /api/categories/:id

## Cart

    GET    /api/cart
    POST   /api/cart
    PUT    /api/cart/:productId
    DELETE /api/cart/:productId
    DELETE /api/cart

## Wishlist

    GET    /api/wishlist
    POST   /api/wishlist/:productId
    DELETE /api/wishlist/:productId
    DELETE /api/wishlist

## Orders

    POST   /api/orders
    GET    /api/orders
    GET    /api/orders/my-orders
    GET    /api/orders/:id
    PUT    /api/orders/:id/cancel

## Seller Orders

    GET    /api/orders/seller/my-orders
    PUT    /api/orders/seller/:orderId/status

## Admin Orders

    GET    /api/orders/admin/all

## Addresses

    GET    /api/addresses
    GET    /api/addresses/:id
    POST   /api/addresses
    PUT    /api/addresses/:id
    DELETE /api/addresses/:id
    PUT    /api/addresses/:id/default

## Reviews

    GET    /api/reviews/product/:productId
    POST   /api/reviews/product/:productId
    PUT    /api/reviews/:reviewId
    DELETE /api/reviews/:reviewId

## Payments

    POST   /api/payments/create-checkout-session
    POST   /api/payments/webhook

---
