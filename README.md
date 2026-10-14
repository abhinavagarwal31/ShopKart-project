# ShopKart

ShopKart is a full-stack e-commerce application built with React, Express, and MongoDB. It includes customer authentication, product discovery, a wishlist, a shopping cart, order history, and Razorpay payment integration.

## Features

- Customer registration and login
- JWT-based authentication stored in an HttpOnly cookie
- Protected customer pages and API routes
- Product listing, product details, search, category filtering, and price sorting
- Persistent wishlist and shopping cart
- Cart quantity updates with stock validation
- Checkout with shipping details
- Razorpay order creation and payment signature verification
- Order confirmation and order history

## Tech stack

**Frontend**
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React

**Backend**
- Node.js
- Express 5
- MongoDB and Mongoose
- bcrypt for password hashing
- JSON Web Tokens
- cookie-parser
- Razorpay SDK

## Project structure

```text
ShopKart-project/
├── client/
│   └── vite-project/
│       ├── src/
│       │   ├── axiosCalls/       # Axios client configuration
│       │   ├── components/       # Shared UI and route guards
│       │   ├── context/          # Authentication and cart contexts
│       │   └── pages/            # Application pages
│       ├── package.json
│       └── vite.config.js
├── server/
│   ├── config/                   # Third-party service configuration
│   ├── controllers/              # Request handlers
│   ├── middlewares/              # Authentication middleware
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API route definitions
│   ├── utils/                    # Shared utilities
│   ├── .env.example
│   ├── index.js
│   └── package.json
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js (a current LTS release is recommended)
- npm
- A MongoDB database, either local MongoDB or MongoDB Atlas
- Razorpay API credentials for testing checkout and payments

Check that Node.js and npm are installed:

```bash
node --version
npm --version
```

## Getting started

Run the frontend and backend in separate terminal windows.

### 1. Clone the repository

```bash
git clone <repository-url>
cd ShopKart-project
```

Replace `<repository-url>` with the URL of your Git repository.

### 2. Configure the backend

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and provide the values for your environment:

```dotenv
PORT=9000
dburl=mongodb+srv://<username>:<password>@<cluster>/<database>
jwt_secret=<long-random-secret>
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

Notes:

- `dburl` is the MongoDB connection string. URL-encode special characters in the database username or password when required.
- `jwt_secret` is used to sign authentication tokens. Use a long, randomly generated value.
- `CLIENT_URL` is the frontend origin allowed by the backend's CORS configuration. For local development, use `http://localhost:5173`.
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are required for payment-order creation and payment verification. Use Razorpay test-mode credentials while developing.
- `PORT` is optional; the server defaults to port `9000`.

Start the backend:

```bash
npm run dev
```

The server should print a message indicating which port it is listening on and log a successful database connection. Keep this terminal running.

### 3. Configure the frontend

Open a second terminal from the project root:

```bash
cd client/vite-project
npm install
```

Create a `.env` file in `client/vite-project/`:

```dotenv
VITE_API_URL=http://localhost:9000
```

The frontend uses this value as the base URL for Axios requests. If it is omitted, the client defaults to `http://localhost:9000`.

Start the development server:

```bash
npm run dev
```

Vite will print the local address, normally `http://localhost:5173`. Open that address in your browser.

### 4. Create products

The product listing reads its data from MongoDB; it does not use a hardcoded product catalogue. The backend currently exposes `POST /products` for creating products.

You can use Postman or another API client to send a request to `http://localhost:9000/products` with a JSON body like this:

```json
{
  "name": "Mechanical Keyboard",
  "description": "Mechanical keyboard for everyday use.",
  "price": 2999,
  "category": "Electronics",
  "image": "https://example.com/keyboard.jpg",
  "stock": 10
}
```

Use a real, publicly accessible image URL for products you want to display. The current product creation endpoint does not require authentication, so do not expose it publicly as-is in a production deployment.

## API reference

The local API base URL is `http://localhost:9000`. Routes below are relative to that base URL.

### Customers

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| `POST` | `/customers/register` | No | Register a customer |
| `POST` | `/customers/login` | No | Log in and set the authentication cookie |
| `GET` | `/customers/me` | Yes | Get the authenticated customer's profile |
| `POST` | `/customers/logout` | No | Clear the authentication cookie |
| `PATCH` | `/customers/change-password` | Yes | Change the customer's password |

Registration expects `fullName`, `email`, `password`, and `phone`. Login expects `email` and `password`. The change-password endpoint expects `oldP` and `newP`.

### Products

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| `POST` | `/products` | No | Create a product |
| `GET` | `/products` | No | List products |
| `GET` | `/products/:id` | No | Get one product |

Supported query parameters for `GET /products`:

- `search`: case-insensitive match against the product name
- `category`: filter by exact category
- `sort=price_asc`: sort by price from low to high
- `sort=price_desc`: sort by price from high to low

Examples:

```text
GET /products?search=keyboard
GET /products?category=Electronics
GET /products?search=keyboard&category=Electronics
GET /products?sort=price_asc
```

Search, category, and sort parameters can be combined.

### Wishlist

All wishlist endpoints require authentication.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/wishlist/:productId` | Add a product to the wishlist |
| `GET` | `/wishlist` | Get the current customer's wishlist |
| `DELETE` | `/wishlist/:productId` | Remove a product from the wishlist |

### Cart

All cart endpoints require authentication.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/cart/:productId` | Add a product or increase its quantity |
| `GET` | `/cart` | Get the current customer's cart |
| `PATCH` | `/cart/:productId` | Set a product's quantity |
| `DELETE` | `/cart/:productId` | Remove a product from the cart |

The quantity update request expects a JSON body such as:

```json
{
  "quantity": 2
}
```

### Orders and payments

All order endpoints require authentication.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/orders/create-payment-order` | Create a ShopKart order and a Razorpay payment order |
| `POST` | `/orders/verify-payment` | Verify the payment signature and place the order |
| `GET` | `/orders` | Get the current customer's order history |

The payment-order endpoint expects a `shippingAddress` object containing `fullName`, `phone`, `addressLine1`, `city`, `state`, and `pincode`. Payment verification expects `shopKartOrderId`, `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.

## Authentication and cookies

After a successful login, the server signs a JWT and stores it in a cookie named `token`. The cookie is configured as `HttpOnly`, `Secure`, and `SameSite=None`, and the Axios client sends requests with credentials enabled.

Because the cookie is marked `Secure`, local HTTP development may behave differently across browsers. If login appears successful but authenticated requests do not include the cookie, check the browser's cookie settings and network tools. For local-only development, you may need a development-specific cookie configuration that uses settings appropriate for HTTP. Do not weaken cookie settings in production.

The frontend and backend must use the correct origins. The backend allows `http://localhost:5173` and the origin configured by `CLIENT_URL`.

## Production build

To build the frontend:

```bash
cd client/vite-project
npm run build
```

To preview the generated build locally:

```bash
npm run preview
```

The backend can be started with:

```bash
cd server
npm start
```

For deployment, configure the same environment variables in the hosting provider rather than uploading `.env` files. Set `VITE_API_URL` to the deployed backend base URL and `CLIENT_URL` to the deployed frontend origin. Configure CORS, HTTPS, cookie settings, and Razorpay credentials for the production domains.

## Security notes

- Do not commit `.env` files, database credentials, JWT secrets, or Razorpay secrets.
- Never put `RAZORPAY_KEY_SECRET`, the MongoDB connection string, or `jwt_secret` in frontend environment variables. Variables prefixed with `VITE_` are exposed to the browser.
- The current product creation endpoint is public. Add authorization before using it in a production store.
- Use Razorpay test credentials for development and verify payment signatures on the server.
- If a secret has been committed or shared, rotate it; deleting the value from the latest commit alone does not remove it from Git history.

## Current scope

ShopKart currently covers the main shopping flow from customer login through product browsing, wishlist and cart management, checkout, payment verification, and order history. Features such as product administration, inventory reservation, refunds, and a production-grade order lifecycle may require additional implementation before the application is ready for real customers.
