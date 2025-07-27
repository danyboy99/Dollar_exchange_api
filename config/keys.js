// Configuration keys and secrets
const jwt_secret = "omotehinse"; // JWT secret for token signing
const DB_url = "mongodb://127.0.0.1:27017/dollarExchangeApi"; // MongoDB connection URL
const flutterwavePublicKey = "FLWPUBK_TEST-d8a5d2c77fd8d4ecfcfca5d95161e06b-X"; // Flutterwave public key
const flutterwaveSecretKey = "FLWSECK_TEST-42c6b907b1087f5d1a51e8602cabe713-X"; // Flutterwave secret key

// Export all configuration values
module.exports = {
  jwt_secret,
  DB_url,
  flutterwavePublicKey,
  flutterwaveSecretKey,
};
