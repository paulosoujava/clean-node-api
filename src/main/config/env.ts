export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://admin:admin@localhost:27017/',
  port: process.env.PORT || 5050,
  salt: 12
}
