# Dollar Exchange API

A RESTful API for dollar exchange services built with Node.js, Express, and MongoDB. This application allows users to purchase dollars using Naira through Flutterwave payment integration.

## Features

- **User Management**: User registration, authentication, and profile management
- **Admin Panel**: Admin controls for managing exchange rates, balances, and orders
- **Order Processing**: Place and track dollar purchase orders
- **Payment Integration**: Secure payment processing with Flutterwave
- **Balance Management**: Track available and locked dollar balances
- **Rate Management**: Dynamic exchange rate updates

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Flutterwave
- **Validation**: Validator.js
- **Security**: bcrypt for password hashing

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Flutterwave account for payment processing

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Dollar_exchange_api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Update the configuration in `config/keys.js`:

   ```javascript
   const jwt_secret = "your-jwt-secret";
   const DB_url = "your-mongodb-connection-string";
   const flutterwavePublicKey = "your-flutterwave-public-key";
   const flutterwaveSecretKey = "your-flutterwave-secret-key";
   ```

4. **Start the application**
   ```bash
   npm start
   ```

The server will start on port 5500 (or the port specified in your environment).

## API Endpoints

### User Routes (`/user`)

| Method | Endpoint        | Description             | Auth Required |
| ------ | --------------- | ----------------------- | ------------- |
| POST   | `/signup`       | User registration       | No            |
| POST   | `/login`        | User login              | No            |
| GET    | `/profile`      | Get user profile        | Yes           |
| POST   | `/placeorder`   | Place dollar order      | Yes           |
| POST   | `/otp-checkout` | Complete order with OTP | Yes           |
| POST   | `/testtoken`    | Test token validity     | Yes           |

### Admin Routes (`/admin`)

| Method | Endpoint               | Description                | Auth Required |
| ------ | ---------------------- | -------------------------- | ------------- |
| POST   | `/create/j21`          | Admin registration         | No            |
| POST   | `/login`               | Admin login                | No            |
| GET    | `/profile`             | Get admin profile          | Yes           |
| GET    | `/productinit`         | Initialize product         | Yes           |
| POST   | `/addtobalance`        | Add to dollar balance      | Yes           |
| POST   | `/removefrombalance`   | Remove from dollar balance | Yes           |
| POST   | `/changenairarate`     | Update exchange rate       | Yes           |
| GET    | `/pendingorders`       | Get pending orders         | Yes           |
| GET    | `/allorders`           | Get all orders             | Yes           |
| POST   | `/approvependingorder` | Approve pending order      | Yes           |
| POST   | `/declinependingorder` | Decline pending order      | Yes           |

## Request/Response Examples

### User Registration

```bash
POST /user/signup
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Place Order

```bash
POST /user/placeorder
Authorization: <jwt-token>
Content-Type: application/json

{
  "card_number": "4187427415564246",
  "card_cvv": "828",
  "card_exp_month": "09",
  "card_exp_year": "32",
  "card_pin": "3310",
  "email": "john@example.com",
  "name": "John Doe",
  "amount": 100
}
```

## Project Structure

```
Dollar_exchange_api/
├── config/
│   ├── keys.js              # Configuration keys
│   └── tokenValidation.js   # JWT middleware
├── controller/
│   ├── admin.js            # Admin business logic
│   ├── product.js          # Product operations
│   └── user.js             # User business logic
├── model/
│   ├── admin.js            # Admin schema
│   ├── orders.js           # Order schema
│   ├── product.js          # Product schema
│   └── user.js             # User schema
├── routes/
│   ├── admin.js            # Admin routes
│   ├── product.js          # Product routes
│   └── user.js             # User routes
├── services/
│   ├── admin.js            # Admin data operations
│   ├── orders.js           # Order data operations
│   ├── product.js          # Product data operations
│   └── user.js             # User data operations
├── validation/
│   ├── addToBalance.js     # Balance validation
│   ├── adminSignup.js      # Admin signup validation
│   ├── checkout.js         # Checkout validation
│   ├── initiatePaymentInput.js # Payment validation
│   ├── isEmpty.js          # Utility validation
│   └── userSignup.js       # User signup validation
├── package.json
├── server.js               # Application entry point
└── README.md
```

## Database Schema

### User

- firstname, lastname, username, email
- password (hashed)
- profilePic (optional)

### Admin

- firstname, lastname, email
- password (hashed)
- timestamps

### Product

- account (identifier)
- availableDollarBalance
- lockedDollarBalance
- nairaRate

### Order

- user (reference to User)
- amountInDollar, amountInNaira
- orderStatus (pending/success/failed)
- paymentRecieve (boolean)
- payment details (ID, references)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team.

#
