import * as mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/project'

function connect() {
    mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true })
    return mongoose.connection
}

function close() {
    return mongoose.disconnect();
}

module.exports = {
    connect,
    close
}