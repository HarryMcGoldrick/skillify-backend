process.env.NODE_ENV = 'test'
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const userController = require('../controllers/user-controller');
let mongoServer;

before(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri,  { useNewUrlParser: true,  useUnifiedTopology: true });
  });
  
  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  })

