const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB
} = process.env;
const host = 'localhost';
const port = '27017';
const db = 'inventory';

module.exports = {
    'mongoUrl': `mongodb://${MONGO_HOST||host}:${MONGO_PORT||port}/${MONGO_DB||db}`,
    'mongoTestUrl':'mongodb://localhost:27017/inventoryTest',
    'whitelist' : [
        'http://localhost:3001',
        'http://localhost',
        'http://localhost:3000',
        'http://157.230.120.51:3001',
        'http://157.230.120.51',
        'http://e527ae2f5361.ngrok.io',
    ],
    'secretKey': 'youcankeepanyvalue',
    'refreshSecretKey':'youcankeepanyvalue'
}