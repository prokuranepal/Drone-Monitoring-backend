require('dotenv').config()

module.exports = {
    'mongoUrl': process.env.DB_URL,
    'mongoTestUrl':'mongodb://localhost:27017/inventoryTest',
    'whitelist' : [
        'http://localhost:3001',
        'http://localhost',
        'http://localhost:3000',
        'http://157.230.120.51:3001',
        'http://157.230.120.51',
        'http://e527ae2f5361.ngrok.io',
        'http://dms.prokurainnovations.com',
        'http://dms.prokurainnovations.com:3001',
        'https://dms.prokurainnovations.com',
        'https://dms.prokurainnovations.com:3001',
    ],
    'secretKey': 'youcankeepanyvalue',
    'refreshSecretKey':'youcankeepanyvalue'
}