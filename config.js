require('dotenv').config()


module.exports = {
    'mongoUrl': process.env.DB_URL,
    'mongoTestUrl':'mongodb://localhost:27017/inventoryTest',
    'whitelist' :  process.env.WHITELIST.split(','),
    'secretKey': process.env.SECRET_KEY,
    'refreshSecretKey': process.env.REFRESH_SECRET_KEY
}
